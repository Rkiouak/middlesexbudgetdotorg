"use client";

import { useState } from "react";
import Link from "next/link";
import { posts } from "@/lib/data";

const YEARS = [
  2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012,
  2011,
];

interface MobileNavProps {
  showToc?: boolean;
}

const TOC_SECTIONS = [
  { label: "Overview", href: "#overview" },
  { label: "Budget vs. Inflation", href: "#budget-growth-vs-inflation" },
  { label: "Three Budget Eras", href: "#three-budget-eras" },
  { label: "Primary Cost Drivers", href: "#primary-cost-drivers" },
  { label: "What the Data Shows", href: "#what-the-data-shows" },
  { label: "Key Takeaways", href: "#key-takeaways" },
  { label: "Growth by Department", href: "#budget-growth-by-department" },
  { label: "Flat or Declining", href: "#flat-or-declining-budgets" },
  { label: "Notable Changes", href: "#notable-changes" },
  { label: "Major Events", href: "#major-events" },
  { label: "Year-over-Year", href: "#year-over-year-volatility" },
];

export default function MobileNav({ showToc = true }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-[#1e4d2b] text-white p-3 rounded-full shadow-lg"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed inset-y-0 right-0 w-72 bg-white z-50 overflow-y-auto shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-800"
                  aria-label="Close navigation menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {showToc && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Contents
                  </h3>
                  <nav aria-label="Table of contents" className="mb-6">
                    {TOC_SECTIONS.map((section) => (
                      <a
                        key={section.href}
                        href={section.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 text-gray-700 text-sm hover:text-[#1e4d2b]"
                      >
                        {section.label}
                      </a>
                    ))}
                  </nav>
                </>
              )}

              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Community Posts
              </h3>
              <nav aria-label="Community posts" className="mb-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-gray-700 text-sm hover:text-[#1e4d2b]"
                  >
                    {post.title}
                  </Link>
                ))}
              </nav>

              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Town Reports
              </h3>
              <nav aria-label="Town report PDFs" className="mb-6">
                {YEARS.map((year) => (
                  <a
                    key={`report-${year}`}
                    href={`https://storage.googleapis.com/middlesex-budget-org/reports/${year}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-gray-700 text-sm hover:text-[#1e4d2b]"
                  >
                    FY {year} <span aria-hidden="true">↗</span>
                    <span className="sr-only">(PDF, opens in new tab)</span>
                  </a>
                ))}
              </nav>

              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Budget Data
              </h3>
              <nav aria-label="Budget data downloads">
                {YEARS.map((year) => (
                  <a
                    key={`csv-${year}`}
                    href={`/data/${year}.csv`}
                    download
                    className="block py-2 text-gray-700 text-sm hover:text-[#1e4d2b]"
                  >
                    FY {year}
                    <span className="sr-only">(CSV download)</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
