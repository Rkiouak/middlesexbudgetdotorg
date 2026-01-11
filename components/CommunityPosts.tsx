import { getPostsWithAuthors } from "@/lib/data";
import PostCard from "./PostCard";

export default function CommunityPosts() {
  const posts = getPostsWithAuthors();

  return (
    <section className="py-8 px-4 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Community Posts
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} author={post.author} />
          ))}
        </div>
      </div>
    </section>
  );
}
