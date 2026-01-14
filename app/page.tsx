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
              <h1 className="text-xl md:text-2xl text-gray-800 font-semibold">
                A Resident&apos;s Guide to Middlesex Budgets
              </h1>
              <p className="text-sm text-gray-700 mt-1">
                Fiscal Year 2011 - 2027 Budget Data and Analysis
              </p>
            </div>
          </div>
          <CommunityPosts />

          {/* Proposed FY2027 Budget Section */}
          <section id="proposed-fy2027-budget" className="py-6 px-4 border-b-2 border-gray-200 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl text-gray-800 font-semibold">
                Proposed FY2027 Budget
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Pre-Town Meeting provisional budget under consideration by the Select Board
              </p>
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
