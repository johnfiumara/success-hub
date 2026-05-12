import { getPosts } from "@/actions/cms"
import { PostsTable } from "@/components/cms/PostsTable"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = { title: "Blog Posts | CMS | Success Hub" }

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-0.5">{posts.length} post{posts.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/cms/posts/new">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white gap-2">
            <Plus size={16} /> New Post
          </Button>
        </Link>
      </div>
      <PostsTable posts={posts} />
    </div>
  )
}
