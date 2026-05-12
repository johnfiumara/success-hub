import { getCommunityPosts } from "@/actions/community"
import { CommunityFeed } from "@/components/community/CommunityFeed"

export const metadata = {
  title: "Community | Success Hub",
  description: "Connect and share with your workspace community"
}

export default async function CommunityPage() {
  const posts = await getCommunityPosts()

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <CommunityFeed initialPosts={posts as any} />
    </div>
  )
}
