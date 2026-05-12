import { getPost } from "@/actions/cms"
import { PostEditor } from "@/components/cms/PostEditor"
import { notFound } from "next/navigation"

export const metadata = { title: "Edit Post | CMS | Success Hub" }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) notFound()
  return <PostEditor post={post} />
}
