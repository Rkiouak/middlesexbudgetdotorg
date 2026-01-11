import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { ReactNode } from "react";

interface BudgetAnalysisProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createHeading(level: number) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  return function Heading({ children }: { children?: ReactNode }) {
    const text = typeof children === "string" ? children : String(children);
    const id = slugify(text);
    return (
      <Tag id={id}>
        <a href={`#${id}`} className="no-underline hover:underline">
          {children}
        </a>
      </Tag>
    );
  };
}

export default function BudgetAnalysis({ content }: BudgetAnalysisProps) {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <article className="prose prose-gray max-w-none prose-headings:text-gray-800 prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b-2 prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800 prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700 prose-td:text-gray-600">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: createHeading(1),
              h2: createHeading(2),
              h3: createHeading(3),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
