import { readFileSync } from "fs";
import { join } from "path";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { ReactNode } from "react";
import DataDownloads from "@/components/DataDownloads";
import type { TocSection } from "@/components/DataDownloads";
import MobileNav from "@/components/MobileNav";
import TownOfficeComparisonChart from "@/components/TownOfficeComparisonChart";

function getSurveyContent(): string {
  const filePath = join(
    process.cwd(),
    "content",
    "town-office-survey.md"
  );
  return readFileSync(filePath, "utf-8");
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

const markdownComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
};

const SURVEY_TOC: TocSection[] = [
  { label: "Comparison Chart", href: "#town-comparison-heading" },
  { label: "Office Only", href: "#view-1-office-only-town-admin-manager-excluded" },
  { label: "Office + Admin", href: "#view-2-everything-all-salary-lines-included" },
  { label: "Rank Movement", href: "#rank-movement-between-views" },
  { label: "Per-Town Breakdown", href: "#per-town-salary-breakdown" },
  { label: "Sources & Methodology", href: "#appendix-sources-methodology" },
];

export default function TownOfficeSurvey() {
  const content = getSurveyContent();

  const proseClasses =
    "prose prose-gray max-w-none prose-headings:text-gray-800 prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-base prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-800 prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700 prose-td:text-gray-600";

  // Insert chart after the introductory tables, before View 1
  const viewMarker = "## View 1";
  const splitIndex = content.indexOf(viewMarker);
  const intro = splitIndex > 0 ? content.slice(0, splitIndex) : "";
  const rest = splitIndex > 0 ? content.slice(splitIndex) : content;

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header>
        <div
          className="relative w-full h-24 md:h-32"
          style={{
            background:
              "linear-gradient(135deg, #162e1a 0%, #1e4d2b 25%, #1e4d2b 75%, #162e1a 100%)",
          }}
        >
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
          <DataDownloads
            showToc={false}
            customToc={SURVEY_TOC}
            customTocTitle="In This Post"
          />
        </div>

        <main id="main-content" className="flex-1 overflow-auto bg-gray-50" role="main">
          <div className="bg-white border-b border-gray-200 py-3 px-4">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 text-sm transition-colors"
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
                    Survey of Recent Town Budgets: Office Spend
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 flex-shrink-0">
                    Analysis
                  </span>
                </div>

                <div className="text-gray-700">
                  <p className="font-medium">Matt Rkiouak</p>
                  <p className="text-sm">
                    Middlesex, VT &middot; Budget Committee Member
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <p>
                    How does Middlesex&apos;s town office spending compare to 17
                    similar Vermont towns? Two views: office staff only, and
                    office staff plus Town Administrator.
                  </p>
                </div>
              </header>

              {/* Intro section */}
              <div className="px-6 py-6">
                <div className={proseClasses}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {intro}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Comparison chart */}
              <TownOfficeComparisonChart />

              {/* Rest of content */}
              <div className="px-6 py-6">
                <div className={proseClasses}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {rest}
                  </ReactMarkdown>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>

      <footer
        className="py-6 px-4 bg-[#1e4d2b] text-white text-center text-sm"
        role="contentinfo"
      >
        <p>A Resident&apos;s Guide to Middlesex Budgets</p>
        <p className="mt-1 text-white/90">
          Site created by Matt Rkiouak, 2025/2026 Budget Committee Member.
          Content from town reports, Middlesex Town employees, Select Board &amp;
          volunteers.
        </p>
        <p className="mt-2 text-white/70 text-xs">
          &copy; 2025 Matt Rkiouak. Content may not be sold or misrepresented.
          {" · "}
          <a
            href="https://hungermountaini.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/90"
          >
            Built by Hunger Mountain Intelligence
          </a>
          {" · "}
          <a
            href="https://github.com/Rkiouak/middlesexbudgetdotorg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/90"
          >
            View source on GitHub
          </a>
        </p>
      </footer>
      <MobileNav showToc={false} />
    </div>
  );
}
