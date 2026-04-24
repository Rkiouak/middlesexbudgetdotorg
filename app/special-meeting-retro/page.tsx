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
import GeneralGovernmentChart from "@/components/GeneralGovernmentChart";
import BudgetVsActualsChart from "@/components/BudgetVsActualsChart";
import CapitalImprovementChart from "@/components/CapitalImprovementChart";

function getRetroContent(): string {
  const filePath = join(
    process.cwd(),
    "content",
    "Special-Budget-Meeting-Retro.md"
  );
  return readFileSync(filePath, "utf-8");
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
  h2: createHeading(2),
  h3: createHeading(3),
};

const RETRO_TOC: TocSection[] = [
  { label: "The Meeting", href: "#the-meeting" },
  { label: "A Moving Target", href: "#a-moving-target" },
  { label: "What Wasn't Discussed", href: "#what-wasn-t-discussed" },
  { label: "Office Staff Costs", href: "#gen-gov-chart-heading", indent: true },
  { label: "Capital Improvement", href: "#cip-chart-heading", indent: true },
  { label: "Budget Number Games", href: "#budget-number-games" },
  { label: "Budget vs. Actuals", href: "#budget-actuals-heading", indent: true },
  { label: "Town Office Staffing", href: "#town-office-staffing" },
  { label: "How Do We Fix Things", href: "#how-do-we-fix-things-in-the-office" },
];

export default function SpecialMeetingRetro() {
  const content = getRetroContent();

  const proseClasses =
    "prose prose-gray max-w-none prose-headings:text-gray-800 prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-800";

  // Split content at chart markers
  // Order in markdown: [GEN_GOV_CHART], [CIP_CHART], [BUDGET_ACTUALS_CHART]
  // Produces parts[0] through parts[3]
  const parts = content.split(/\[GEN_GOV_CHART\]|\[CIP_CHART\]|\[BUDGET_ACTUALS_CHART\]/);
  const hasGenGovChart = content.includes("[GEN_GOV_CHART]");
  const hasCipChart = content.includes("[CIP_CHART]");
  const hasBudgetActualsChart = content.includes("[BUDGET_ACTUALS_CHART]");

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
            customToc={RETRO_TOC}
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

          {/* Special vote alert */}
          <div className="bg-red-50 border-b-2 border-red-200 py-3 px-4">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <span className="flex-shrink-0 px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded">
                MAY 9
              </span>
              <p className="text-sm text-red-800">
                <strong>Special Town Meeting vote</strong> on the reconsideration
                of the FY2027 budget. Middlesex Town Hall, 7:00 PM.
              </p>
            </div>
          </div>

          <div className="py-8 px-4">
            <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <header className="px-6 py-6 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Special Budget Meeting Retrospective
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-red-50 text-red-800 flex-shrink-0">
                    Opinion
                  </span>
                </div>

                <div className="text-gray-700">
                  <p className="font-medium">Matt Rkiouak</p>
                  <p className="text-sm">
                    Middlesex, VT &middot; Budget Committee Member
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
                  <time dateTime="2026-04-24">
                    {formatDate("2026-04-24")}
                  </time>
                </div>
              </header>

              <div className="px-6 py-6">
                <div className={proseClasses}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {parts[0]}
                  </ReactMarkdown>
                </div>
              </div>

              {/* General Government Growth Chart */}
              {hasGenGovChart && (
                <div>
                  <GeneralGovernmentChart />
                </div>
              )}

              {parts[1] && (
                <div className="px-6 py-6">
                  <div className={proseClasses}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {parts[1]}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Capital Improvement Chart */}
              {hasCipChart && (
                <div>
                  <CapitalImprovementChart />
                </div>
              )}

              {parts[2] && (
                <div className="px-6 py-6">
                  <div className={proseClasses}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {parts[2]}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Budget vs Actuals Chart */}
              {hasBudgetActualsChart && (
                <div>
                  <BudgetVsActualsChart />
                </div>
              )}

              {parts[3] && (
                <div className="px-6 py-6">
                  <div className={proseClasses}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {parts[3]}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
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
