import { getMeetings } from "@/app/actions/meetings";
import { getCurrentUser } from "@/actions/auth";
import { MeetingList } from "@/components/meetings/MeetingList";
import { redirect } from "next/navigation";

export default async function WorkspaceMeetingsPage(props: { params: Promise<{ workspaceId: string }> }) {
  const params = await props.params;
  const workspaceId = params.workspaceId;

  const context = await getCurrentUser();
  if (!context) redirect("/login");

  const res = await getMeetings(workspaceId);

  if (!res.success) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{res.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Video Meetings</h1>
        <p className="text-gray-500">Connect with your team in real-time with high-quality video calls.</p>
      </div>

      <MeetingList workspaceId={workspaceId} initialMeetings={res.meetings || []} />
    </div>
  );
}
