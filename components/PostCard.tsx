import Link from "next/link";
import type { Post, Author } from "@/lib/data";

interface PostCardProps {
  post: Post;
  author: Author;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getExcerpt(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/[#*_\-\[\]]/g, "").trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength).trim() + "...";
}

export default function PostCard({ post, author }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <Link href={`/posts/${post.id}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-gray-800 leading-tight">
            {post.title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 flex-shrink-0">
            {post.type}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {getExcerpt(post.content)}
        </p>
      </Link>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{author.name}</span>
        <div className="flex items-center gap-3">
          {post.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700"
            >
              FPF →
            </a>
          )}
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </div>
  );
}
