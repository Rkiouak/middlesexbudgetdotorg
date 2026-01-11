import { readFileSync } from "fs";
import { join } from "path";
import Hero from "@/components/Hero";
import CommunityPosts from "@/components/CommunityPosts";
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
                Budget Transparency Portal
              </h1>
              <p className="text-sm text-gray-700 mt-1">
                Fiscal Year 2011 - 2024 Budget Data and Analysis
              </p>
            </div>
          </div>
          <CommunityPosts />
          <BudgetAnalysis content={analysisContent} />
        </main>
      </div>
      <footer className="py-6 px-4 bg-[#1e4d2b] text-white text-center text-sm" role="contentinfo">
        <p>Town of Middlesex, Vermont</p>
        <p className="mt-1 text-white/90">
          Created by Matt Rkiouak with input from the Middlesex Budget Committee and other volunteers
        </p>
      </footer>
      <MobileNav />
    </div>
  );
}
