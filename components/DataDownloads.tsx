import Link from "next/link";
import { posts } from "@/lib/data";

const YEARS = [
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012,
  2011,
];

const TOC_SECTIONS = [
  { label: "Overview", href: "#overview" },
  { label: "Budget vs. Inflation", href: "#budget-growth-vs-inflation", indent: true },
  { label: "Three Budget Eras", href: "#three-budget-eras", indent: true },
  { label: "Primary Cost Drivers", href: "#primary-cost-drivers", indent: true },
  { label: "What the Data Shows", href: "#what-the-data-shows", indent: true },
  { label: "Key Takeaways", href: "#key-takeaways", indent: true },
  { label: "Growth by Department", href: "#budget-growth-by-department" },
  { label: "Flat or Declining", href: "#flat-or-declining-budgets" },
  { label: "Notable Changes", href: "#notable-changes" },
  { label: "Major Events", href: "#major-events" },
  { label: "Year-over-Year", href: "#year-over-year-volatility" },
];

interface DataDownloadsProps {
  showToc?: boolean;
}

export default function DataDownloads({ showToc = true }: DataDownloadsProps) {
  return (
    <aside className="bg-white border-r border-gray-200 p-4 h-full" aria-label="Sidebar navigation">
      {!showToc && (
        <Link
          href="/"
          className="block py-2 mb-4 text-sm font-medium text-[#1e4d2b] hover:text-[#2d724a] transition-colors"
        >
          &larr; Home
        </Link>
      )}

      {showToc && (
        <>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Contents
          </h2>

          <nav aria-label="Table of contents" className="flex flex-col gap-0.5 mb-6">
            {TOC_SECTIONS.map((section) => (
              <a
                key={section.href}
                href={section.href}
                className={`py-1 text-gray-700 text-xs hover:text-[#1e4d2b] hover:bg-gray-50 rounded transition-colors ${
                  section.indent ? "pl-3" : "font-medium"
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </>
      )}

      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Community Posts
      </h2>

      <nav aria-label="Community posts" className="flex flex-col gap-0.5 mb-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="py-1 text-gray-700 text-xs hover:text-[#1e4d2b] hover:bg-gray-50 rounded transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
        ))}
      </nav>

      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Town Reports
      </h2>

      <nav aria-label="Town report PDFs" className="flex flex-col gap-0.5 mb-6">
        {YEARS.map((year) => (
          <a
            key={`report-${year}`}
            href={`https://storage.googleapis.com/middlesex-budget-org/reports/${year}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 text-gray-700 text-xs hover:text-[#1e4d2b] hover:bg-gray-50 rounded transition-colors"
          >
            FY {year} <span aria-hidden="true">↗</span>
            <span className="sr-only">(PDF, opens in new tab)</span>
          </a>
        ))}
      </nav>

      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
        Budget Data
      </h2>

      <nav aria-label="Budget data downloads" className="flex flex-col gap-0.5">
        {YEARS.map((year) => (
          <a
            key={`csv-${year}`}
            href={`/data/${year}.csv`}
            download
            className="px-2 py-1 text-gray-700 text-xs hover:text-[#1e4d2b] hover:bg-gray-50 rounded transition-colors"
          >
            FY {year}
            <span className="sr-only">(CSV download)</span>
          </a>
        ))}
      </nav>

      <p className="text-xs text-gray-600 mt-4 leading-relaxed">
        CSV: section, line item, fiscal year, budgeted, actual.
      </p>
    </aside>
  );
}
