import { readFileSync } from "fs";
import { join } from "path";
import Hero from "@/components/Hero";
import CommunityPosts from "@/components/CommunityPosts";
import BudgetWaterfallChart from "@/components/BudgetWaterfallChart";
import BudgetOptionsComparison from "@/components/BudgetOptionsComparison";
import ProposedBudgetWaterfall from "@/components/ProposedBudgetWaterfall";
import BudgetAnalysis from "@/components/BudgetAnalysis";
import DataDownloads from "@/components/DataDownloads";
import MobileNav from "@/components/MobileNav";
import PdfExportButton from "@/components/PdfExportButton";

function getAnalysisContent(): string {
  const analysisPath = join(
    process.cwd(),
    "content",
    "comprehensive_analysis.md"
  );
  return readFileSync(analysisPath, "utf-8");
}

export default function Home() {
  const analysisContent = getAnalysisContent();

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Hero />
      <div className="flex flex-1">
        <div className="w-48 flex-shrink-0 hidden md:block sticky top-0 h-screen overflow-y-auto">
          <DataDownloads />
        </div>
        <main id="main-content" className="flex-1 overflow-auto" role="main">
          <div className="py-6 px-4 border-b-2 border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl text-gray-800 font-semibold">
                    A Resident&apos;s Guide to Middlesex Budgets
                  </h1>
                  <p className="text-sm text-gray-700 mt-1">
                    Fiscal Year 2011 - 2027 Budget Data and Analysis
                  </p>
                </div>
                <PdfExportButton />
              </div>
            </div>
          </div>
          {/* Urgent: Special Town Meeting Banner */}
          <div className="bg-red-50 border-b-2 border-red-300">
            <div className="max-w-4xl mx-auto py-4 px-4">
              <a
                href="/special-meeting-retro.html"
                className="flex items-start sm:items-center gap-3 group"
              >
                <span className="flex-shrink-0 px-2.5 py-1 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
                  MAY 9
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-900 group-hover:underline">
                    Special Town Meeting: FY2027 Budget Reconsideration
                  </p>
                  <p className="text-xs text-red-700 mt-0.5">
                    New post: Budget Committee member reflects on the April 23rd
                    special meeting and the alternative budget process.
                    Read the full analysis &rarr;
                  </p>
                </div>
              </a>
            </div>
          </div>

          <CommunityPosts />

          {/* Proposed FY2027 Budget Section */}
          <section id="proposed-fy2027-budget" className="py-6 px-4 border-b-2 border-gray-200 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl md:text-2xl text-gray-800 font-semibold">
                    Proposed FY2027 Budget
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Pre-Town Meeting provisional budget under consideration by the Select Board
                  </p>
                </div>
                <a
                  href="https://docs.google.com/spreadsheets/d/1DCt7qceMu2RbS5G75_c1jhVVbR-WhUdN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#1e4d2b] bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-[#1e4d2b] transition-colors whitespace-nowrap"
                  title="Opens in Google Sheets"
                >
                  {/* Google Sheets icon */}
                  <svg className="h-4 w-4 text-[#0f9d58]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.5 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7.5L14.5 2zM18 20H6V4h7v4h5v12z"/>
                    <path d="M8 12h3v2H8v-2zm5 0h3v2h-3v-2zm-5 3h3v2H8v-2zm5 0h3v2h-3v-2z"/>
                  </svg>
                  View Proposed Budget for Town Meeting Day
                </a>
              </div>
            </div>
          </section>
          <ProposedBudgetWaterfall />
          <BudgetOptionsComparison />

          {/* Historical Analysis Section */}
          <section id="historical-analysis" className="py-6 px-4 border-b-2 border-gray-200 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl text-gray-800 font-semibold">
                Historical Budget Analysis
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                16 years of Town Reports: FY2011 - FY2026
              </p>
            </div>
          </section>
          <BudgetWaterfallChart />
          <BudgetAnalysis content={analysisContent} />
        </main>
      </div>
      <footer className="py-6 px-4 bg-[#1e4d2b] text-white text-center text-sm" role="contentinfo">
        <p>A Resident&apos;s Guide to Middlesex Budgets</p>
        <p className="mt-1 text-white/90">
          Site created by Matt Rkiouak, 2025/2026 Budget Committee Member. Content from town reports, Middlesex Town employees, Select Board &amp; volunteers.
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
      <MobileNav />
    </div>
  );
}
