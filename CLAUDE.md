# A Resident's Guide to Middlesex Budgets

## Project Overview

A Next.js website providing budget transparency for the Town of Middlesex, Vermont. Displays historical budget data (FY2011-FY2027), interactive charts, analysis, and community posts about town finances.

**Live URL:** https://middlesexbudget.org

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts (waterfall, line charts)
- **Markdown:** react-markdown with remark-gfm
- **Deployment:** Static export to GCS bucket
- **PDF:** Puppeteer (build-time generation)

## Project Structure

```
website/
├── app/
│   ├── page.tsx              # Main page - budget analysis + community posts
│   ├── layout.tsx            # Root layout with GA4 tracking (G-N1Y8ZH0VQT)
│   └── posts/[id]/page.tsx   # Individual post pages
├── components/
│   ├── Hero.tsx                    # Header with town branding
│   ├── DataDownloads.tsx           # Sidebar: TOC, posts links, CSV downloads
│   ├── BudgetAnalysis.tsx          # Renders markdown analysis with anchor IDs
│   ├── ProposedBudgetWaterfall.tsx # FY2026→FY2027 comparison chart
│   ├── BudgetOptionsComparison.tsx # Town Admin vs Office Expansion chart
│   ├── BudgetWaterfallChart.tsx    # Historical waterfall chart
│   ├── InflationComparisonChart.tsx # Budget vs inflation indices chart
│   ├── IncomeGrowthChart.tsx       # Resident income trends chart
│   ├── CommunityPosts.tsx          # Post listing on main page
│   └── PostCard.tsx                # Individual post preview card
├── content/
│   └── comprehensive_analysis.md  # Main budget analysis content
├── lib/
│   └── data.ts               # Posts and authors data
├── public/
│   ├── data/*.csv            # Budget CSV files (fy2013.csv-fy2027.csv, named by proposed FY)
│   ├── middlesex-header.png  # Town header image
│   └── *.pdf                 # Generated PDF (build-time)
├── scripts/
│   └── generate-pdf.mjs      # PDF generation script (requires dev server)
├── Makefile                  # Build and deploy automation
└── next.config.ts            # Static export configuration
```

## Key Components

**BudgetAnalysis.tsx:** Renders markdown with custom heading components that add anchor IDs for TOC navigation. Uses `slugify()` to generate IDs from heading text.

**DataDownloads.tsx:** Sidebar with three sections:
- Contents (TOC with anchor links) - shown on main page only
- Community Posts (links to post pages)
- Budget Data (CSV download links)
- Home link shown on posts pages only (`showToc={false}`)

**Layout:** Both pages use flex layout with sticky sidebar (hidden on mobile).

## GCP Deployment

### Static Hosting
- **Bucket:** `gs://middlesex-budget-site`
- **Output:** Static files in `out/` directory

### Build & Deploy

```bash
# Build static site
make build

# Deploy to GCS bucket
make deploy

# Generate PDF (requires dev server running)
make generate-pdf

# Full workflow: generate PDF, build, deploy
make all
```

### Makefile Targets
- `build`: Builds static site to `out/`
- `deploy`: Syncs `out/` to GCS bucket
- `generate-pdf`: Generates PDF from running dev server
- `dev`: Starts development server
- `clean`: Removes build artifacts
- `all`: Full deploy (generate-pdf + deploy)

## Content Updates

**Budget Analysis:** Edit `content/comprehensive_analysis.md`

**Community Posts:** Edit `lib/data.ts` - add to `posts` array with:
- `id`: URL slug
- `authorId`: Reference to authors array
- `title`, `type`, `date`, `content`
- `link`: Optional external link (e.g., Front Porch Forum)

**CSV Data:** Files in `public/data/` are named by proposed fiscal year (`fy2026.csv` contains FY2026 proposed budget from the 2024 Town Report). Update `FISCAL_YEARS` array in `DataDownloads.tsx` when adding new files.

## Design Notes

- **Colors:** Forest green `#1e4d2b` (header, footer, accents)
- **Header:** Town seal with `object-contain object-left` on dark green background
- **Typography:** Gray text hierarchy (800/600/500/400)
- **Tables:** Gray header backgrounds, small text
