import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import { notFound, redirect } from "next/navigation";
import { MeetingRoom } from "@/components/meetings/MeetingRoom";

export default async function MeetingRoomPage(props: { params: Promise<{ workspaceId: string, meetingId: string }> }) {
  const params = await props.params;
  const { workspaceId, meetingId } = params;

  const context = await getCurrentUser();
  if (!context) {
    redirect("/login");
  }
  const user = context.user;

  // Verify access to meeting
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId, workspaceId },
  });

  if (!meeting) {
    notFound();
  }

  // Verify workspace membership
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: user.id,
      },
    },
  });

  if (!membership) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p>You are not a member of this workspace.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 h-full min-h-[90vh]">
      <MeetingRoom 
        workspaceId={workspaceId} 
        meetingId={meeting.id}
        meetingTitle={meeting.title}
        roomName={meeting.roomName}
        participantName={user.name || user.email || "Guest"}
      />
    </div>
  );
}
