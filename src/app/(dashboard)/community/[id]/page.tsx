import { getCommunityPost } from "@/actions/community"
import { PostDetail } from "@/components/community/PostDetail"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const post = await getCommunityPost(id)

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <PostDetail post={post as any} />
    </div>
  )
}
