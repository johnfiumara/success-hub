"use client";

import { useState } from "react";
import { Plus, Video, Calendar, Users, ArrowRight, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { createMeeting, endMeeting } from "@/app/actions/meetings";
import { useRouter } from "next/navigation";

interface Meeting {
  id: string;
  title: string;
  description: string | null;
  status: string;
  workspaceId: string;
  hostId: string;
  roomName: string;
  createdAt: Date | string;
  host: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function MeetingList({ workspaceId, initialMeetings }: { workspaceId: string; initialMeetings: Meeting[] }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const activeMeetings = initialMeetings.filter((m) => m.status === "ACTIVE");
  const pastMeetings = initialMeetings.filter((m) => m.status === "ENDED");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    try {
      const res = await createMeeting(workspaceId, title.trim(), description.trim() || undefined);
      if (res.success && res.meeting) {
        router.push(`/workspaces/${workspaceId}/meetings/${res.meeting.id}`);
      } else {
        alert(res.error || "Failed to create meeting");
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  const handleEnd = async (meetingId: string) => {
    if (!confirm("End this meeting?")) return;
    await endMeeting(meetingId);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Quick Action Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowForm(true)}
          className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Video size={18} className="group-hover:rotate-6 transition-transform" />
          New Meeting
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Video size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Start a Meeting</h3>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  placeholder="e.g. Weekly Standup, Sprint Review"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
                  placeholder="What will you discuss?"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setTitle(""); setDescription(""); }}
                  className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                  {loading ? "Starting..." : "Start Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Meetings */}
      {activeMeetings.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-semibold text-gray-900">Active Meetings</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{activeMeetings.length}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} workspaceId={workspaceId} onEnd={handleEnd} />
            ))}
          </div>
        </div>
      )}

      {/* Past Meetings */}
      {pastMeetings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Meetings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} workspaceId={workspaceId} onEnd={handleEnd} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {initialMeetings.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-20 px-8 bg-white/60 backdrop-blur rounded-2xl border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No meetings yet</h3>
          <p className="text-gray-500 text-center max-w-sm mb-6 leading-relaxed">
            Start an impromptu video call to collaborate with your team in real-time. Screen sharing, audio, and video included.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Create Your First Meeting
          </button>
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting, workspaceId, onEnd }: { meeting: Meeting; workspaceId: string; onEnd: (id: string) => void }) {
  const router = useRouter();
  const isActive = meeting.status === "ACTIVE";

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      isActive 
        ? "border-indigo-100 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-200" 
        : "border-gray-100 opacity-75 hover:opacity-100"
    }`}>
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2.5 rounded-xl ${isActive ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-400"}`}>
            <Video size={18} />
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            isActive
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-gray-50 text-gray-500"
          }`}>
            {isActive ? "● Live" : "Ended"}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 truncate">{meeting.title}</h3>
        {meeting.description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{meeting.description}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Calendar size={12} />
          {format(new Date(meeting.createdAt), "MMM d, yyyy · h:mm a")}
        </div>

        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-violet-500 text-white flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
              {meeting.host?.name?.charAt(0)?.toUpperCase() || meeting.host?.email?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[100px]">
              {meeting.host?.name?.split(" ")[0] || "Host"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isActive && (
              <>
                <button
                  onClick={() => onEnd(meeting.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  End
                </button>
                <button
                  onClick={() => router.push(`/workspaces/${workspaceId}/meetings/${meeting.id}`)}
                  className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Join <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
