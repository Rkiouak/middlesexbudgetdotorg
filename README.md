# A Resident's Guide to Middlesex Budgets

A Next.js website providing budget transparency for the Town of Middlesex, Vermont. Displays 16 years of historical budget data (FY2011-FY2027), interactive charts, analysis, and community posts about town finances.

**Live site:** https://middlesexbudget.org

## Features

- **FY2027 Proposed Budget Analysis** - Waterfall charts comparing budget options (Town Administrator vs Office Expansion)
- **Historical Budget Data** - Downloadable CSV files for FY2011-FY2027
- **Interactive Charts** - Budget vs inflation comparisons, income growth trends, department breakdowns
- **Resident Income Analysis** - Middlesex vs Washington County income comparisons
- **Community Posts** - Budget-related discussions and explanations
- **Town Report PDFs** - Direct links to official town reports

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Markdown:** react-markdown with remark-gfm
- **Deployment:** Google Cloud Run with Cloud Build CI/CD

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The site runs at http://localhost:3000

## Project Structure

```
website/
├── app/
│   ├── page.tsx                    # Main page
│   ├── layout.tsx                  # Root layout with analytics
│   └── posts/[id]/page.tsx         # Individual post pages
├── components/
│   ├── Hero.tsx                    # Header with town branding
│   ├── DataDownloads.tsx           # Sidebar navigation
│   ├── BudgetAnalysis.tsx          # Markdown analysis renderer
│   ├── ProposedBudgetWaterfall.tsx # FY2026→FY2027 comparison
│   ├── BudgetOptionsComparison.tsx # Town Admin vs Office Expansion
│   ├── BudgetWaterfallChart.tsx    # Historical waterfall chart
│   ├── InflationComparisonChart.tsx # Budget vs inflation indices
│   └── IncomeGrowthChart.tsx       # Resident income trends
├── content/
│   └── comprehensive_analysis.md   # Main analysis content
├── lib/
│   └── data.ts                     # Posts and authors data
├── public/
│   └── data/*.csv                  # Budget CSV files
├── Dockerfile                      # Multi-stage build
└── Makefile                        # Deploy automation
```

## Content Updates

**Budget Analysis:** Edit `content/comprehensive_analysis.md`

**Community Posts:** Edit `lib/data.ts` - add to `posts` array:
```typescript
{
  id: "post-slug",
  authorId: "author-id",
  title: "Post Title",
  type: "Discussion",
  date: "2026-01-15",
  content: "Markdown content...",
  link: "https://optional-external-link.com"
}
```

**CSV Data:** Add files to `public/data/` and update `YEARS` array in `components/DataDownloads.tsx`

## Deployment

Pushing to `main` triggers automatic deployment via Cloud Build.

```bash
# Push changes to deploy
make all
```

Manual deployment commands:
```bash
make build          # Build container via Cloud Build
make deploy         # Deploy to Cloud Run
make clean-revisions # Remove old revisions
```

## Data Sources

- **Budget Data:** Town of Middlesex Annual Reports (FY2011-FY2026)
- **FY2027 Proposed:** Select Board working documents
- **Income Data:** U.S. Census Bureau ACS 5-Year Estimates, FRED
- **Inflation Indices:** BLS CPI-U, ECI, PPI; FHWA NHCCI

## License

**Code:** [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE)

This means you can freely use, modify, and distribute the code, but:
- You must keep it open source (no closed-source derivatives)
- You must provide attribution
- If you run a modified version as a network service, you must release your source code

**Content:** Created by Matt Rkiouak, 2025/2026 Budget Committee Member. Content may not be sold or misrepresented.
