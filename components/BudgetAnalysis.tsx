import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { ReactNode } from "react";
import InflationComparisonChart from "./InflationComparisonChart";

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

// Context text to introduce the chart and tables
const OVERVIEW_CONTEXT = `
The chart below shows how Middlesex's annual budget increases compare to various inflation measures. While CPI-U (the standard consumer price index) is often cited as "inflation," municipal budgets are driven by very different cost pressures—primarily wages, benefits, and construction materials.

**Key patterns to note:**
- The town's budget increases have generally tracked between ECI (government wages) and highway construction costs
- In 2022-2023, highway costs spiked 20-25% while CPI was only 3-7%—this gap explains much of the budget pressure
- The 2021 budget jump (11.45%) was a deliberate "catch-up" after years of deferred maintenance
`;

export default function BudgetAnalysis({ content }: BudgetAnalysisProps) {
  // Split content to insert chart after "# Overview" heading
  const overviewMarker = "# Overview";
  const budgetGrowthMarker = "## Budget Growth vs. Inflation";

  const overviewIndex = content.indexOf(overviewMarker);
  const budgetGrowthIndex = content.indexOf(budgetGrowthMarker);

  // Split into: before overview, overview to budget growth, rest
  const beforeOverview = overviewIndex > 0 ? content.slice(0, overviewIndex) : "";
  const overviewSection = overviewIndex > 0 && budgetGrowthIndex > 0
    ? content.slice(overviewIndex, budgetGrowthIndex)
    : "";
  const afterChart = budgetGrowthIndex > 0 ? content.slice(budgetGrowthIndex) : content;

  const proseClasses = "prose prose-gray max-w-none prose-headings:text-gray-800 prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b-2 prose-h2:border-gray-200 prose-h2:pb-2 prose-h3:text-xl prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-800 prose-table:text-sm prose-th:bg-gray-50 prose-th:text-gray-700 prose-td:text-gray-600";

  const markdownComponents = {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Title and intro */}
        {beforeOverview && (
          <article className={proseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {beforeOverview}
            </ReactMarkdown>
          </article>
        )}

        {/* Overview heading */}
        {overviewSection && (
          <article className={proseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {overviewSection}
            </ReactMarkdown>
          </article>
        )}

        {/* Context text and chart */}
        <article className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {OVERVIEW_CONTEXT}
          </ReactMarkdown>
        </article>

        {/* Inflation comparison chart */}
        <div className="my-8 -mx-4 sm:mx-0">
          <InflationComparisonChart />
        </div>

        {/* Rest of content (tables and analysis) */}
        <article className={proseClasses}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {afterChart}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
