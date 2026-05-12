"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { generateMeetingToken } from "@/app/actions/meetings";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Video, AlertTriangle } from "lucide-react";

interface MeetingRoomProps {
  workspaceId: string;
  meetingId: string;
  meetingTitle: string;
  roomName: string;
  participantName: string;
}

export function MeetingRoom({ workspaceId, meetingId, meetingTitle, roomName, participantName }: MeetingRoomProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function getToken() {
      try {
        const res = await generateMeetingToken(roomName, participantName);
        if (mounted) {
          if (res.success && res.token) {
            setToken(res.token);
          } else {
            setError(res.error || "Failed to generate token");
          }
        }
      } catch {
        if (mounted) setError("An error occurred getting access token.");
      }
    }

    getToken();
    return () => { mounted = false; };
  }, [roomName, participantName]);

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-500 mb-2">{error}</p>
          <p className="text-sm text-gray-400">
            Make sure your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">LIVEKIT_API_KEY</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">LIVEKIT_API_SECRET</code>, and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_LIVEKIT_URL</code> environment variables are correctly set.
          </p>
        </div>
        <button
          onClick={() => router.push("/meetings")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Meetings
        </button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-5">
        <div className="relative">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Video size={28} className="text-indigo-600" />
          </div>
          <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-indigo-500 animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Joining {meetingTitle}...</h2>
          <p className="text-gray-500 text-sm">Setting up your secure connection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[88vh] bg-gray-950 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3.5 bg-gray-900/80 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/meetings")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Leave Meeting"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-semibold text-white text-sm">{meetingTitle}</h2>
            <p className="text-xs text-gray-500">{roomName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-semibold text-red-400 tracking-wide">LIVE</span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative" data-lk-theme="default">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          connect={true}
          onDisconnected={() => router.push("/meetings")}
          className="h-full flex flex-col"
        >
          <VideoLayout />
          <RoomAudioRenderer />
          <ControlBar variation="minimal" />
        </LiveKitRoom>
      </div>
    </div>
  );
}

function VideoLayout() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: "calc(100vh - 200px)" }}>
      <ParticipantTile />
    </GridLayout>
  );
}
