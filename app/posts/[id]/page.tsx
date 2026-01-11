import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { posts, getAuthor } from "@/lib/data";
import DataDownloads from "@/components/DataDownloads";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  const author = getAuthor(post.authorId);

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="relative w-full h-24 md:h-32 bg-[#1e4d2b]">
          <Image
            src="/middlesex-header.png"
            alt="Town of Middlesex, Vermont"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </header>

      <div className="flex flex-1">
        <div className="w-48 flex-shrink-0 hidden md:block sticky top-0 h-screen overflow-y-auto">
          <DataDownloads showToc={false} />
        </div>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="bg-white border-b border-gray-200 py-3 px-4">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>

          <div className="py-8 px-4">
            <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <header className="px-6 py-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {post.title}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 flex-shrink-0">
                    {post.type}
                  </span>
                </div>

                {author && (
                  <div className="text-gray-600">
                    <p className="font-medium">{author.name}</p>
                    <p className="text-sm">{author.location}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>{formatDate(post.date)}</span>
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      View on Front Porch Forum →
                    </a>
                  )}
                </div>
              </header>

              <div className="px-6 py-6">
                <div className="prose prose-gray max-w-none prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>

      <footer className="py-6 px-4 bg-[#1e4d2b] text-white/80 text-center text-sm">
        <p>Town of Middlesex, Vermont</p>
        <p className="mt-1 text-white/60">
          Created by Matt Rkiouak with input from the Middlesex Budget Committee and other volunteers
        </p>
      </footer>
    </div>
  );
}
