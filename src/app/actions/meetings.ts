"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import { AccessToken } from "livekit-server-sdk";

export async function createMeeting(workspaceId: string, title: string, description?: string) {
  try {
    const context = await getCurrentUser();
    if (!context) {
      throw new Error("Unauthorized");
    }
    const user = context.user;

    // Verify user is in workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      throw new Error("You do not have access to this workspace");
    }

    const roomName = `room-${workspaceId}-${Date.now()}`;

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        workspaceId,
        hostId: user.id,
        roomName,
        status: "ACTIVE",
      },
    });

    revalidatePath(`/workspaces/${workspaceId}/meetings`);
    revalidatePath(`/meetings`);

    return { success: true, meeting };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return { success: false, error: "Failed to create meeting" };
  }
}

export async function getMeetings(workspaceId: string) {
  try {
    const context = await getCurrentUser();
    if (!context) {
      throw new Error("Unauthorized");
    }
    const user = context.user;

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      throw new Error("You do not have access to this workspace");
    }

    const meetings = await prisma.meeting.findMany({
      where: {
        workspaceId,
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, meetings };
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return { success: false, error: "Failed to fetch meetings" };
  }
}

export async function endMeeting(meetingId: string) {
  try {
    const context = await getCurrentUser();
    if (!context) {
      throw new Error("Unauthorized");
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Only the host can end a meeting
    if (meeting.hostId !== context.user.id) {
      throw new Error("Only the host can end this meeting");
    }

    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: "ENDED" },
    });

    revalidatePath(`/workspaces/${meeting.workspaceId}/meetings`);
    revalidatePath(`/meetings`);

    return { success: true };
  } catch (error) {
    console.error("Error ending meeting:", error);
    return { success: false, error: "Failed to end meeting" };
  }
}

export async function generateMeetingToken(roomName: string, participantName: string) {
  try {
    const context = await getCurrentUser();
    if (!context) {
      throw new Error("Unauthorized");
    }
    const user = context.user;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      throw new Error("LiveKit environment variables are missing. Set LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and NEXT_PUBLIC_LIVEKIT_URL.");
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: participantName || user.name || user.email || "Guest",
    });

    at.addGrant({ roomJoin: true, room: roomName });

    const token = await at.toJwt();

    return { success: true, token };
  } catch (error) {
    console.error("Error generating meeting token:", error);
    return { success: false, error: "Failed to generate meeting token" };
  }
}
