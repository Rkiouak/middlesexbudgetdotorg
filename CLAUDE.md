# A Resident's Guide to Middlesex Budgets

## Project Overview

A Next.js website providing budget transparency for the Town of Middlesex, Vermont. Displays historical budget data (FY2011-FY2027), interactive charts, analysis, and community posts about town finances.

**Live URL:** https://middlesexbudget.org

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts (waterfall, line charts)
- **Markdown:** react-markdown with remark-gfm
- **Deployment:** Google Cloud Run with Cloud Build CI/CD
- **CDN/LB:** Google Cloud Global Load Balancer

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
│   ├── data/*.csv            # Budget CSV files (FY2011-FY2027)
│   └── middlesex-header.png  # Town header image
├── Dockerfile                # Multi-stage build for Cloud Run
├── Makefile                  # Build and deploy automation
└── next.config.ts            # Standalone output for containerization
```

## Key Components

**BudgetAnalysis.tsx:** Renders markdown with custom heading components that add anchor IDs for TOC navigation. Uses `slugify()` to generate IDs from heading text.

**DataDownloads.tsx:** Sidebar with three sections:
- Contents (TOC with anchor links) - shown on main page only
- Community Posts (links to post pages)
- Budget Data (CSV download links)
- Home link shown on posts pages only (`showToc={false}`)

**Layout:** Both pages use flex layout with sticky sidebar (hidden on mobile).

## GCP Deployment Architecture

### Infrastructure
- **Project:** `clojure-gen-blog`
- **Region:** `us-central1`
- **Static IP:** `34.54.22.113`
- **URL Map:** `rkiouak-lb`
- **HTTPS Proxy:** `rkiouak-lb-target-proxy-4`

### Cloud Run Service
- **Service name:** `middlesex-budget`
- **Image:** `us-central1-docker.pkg.dev/clojure-gen-blog/cloud-run/middlesex-budget:latest`
- **Config:** 512Mi memory, 1 CPU, 0-1 instances, port 3000

### Load Balancer Components
- **Backend Service:** `middlesex-budget-backend` (EXTERNAL_MANAGED)
- **Serverless NEG:** `middlesex-budget-neg`
- **SSL Certificate:** `middlesex-cert` (Google-managed for middlesexbudget.org)
- **Path Matcher:** `middlesex-budget-matcher` in URL map

### DNS
A record: `middlesexbudget.org` → `34.54.22.113`

## Build & Deploy

```bash
# Full build and deploy
make all

# Individual steps
make build          # Build container via Cloud Build
make deploy         # Deploy to Cloud Run
make clean-revisions # Remove old revisions
```

### Makefile Targets
- `push`: Push commits to origin/main (triggers CI/CD)
- `build`: Runs `gcloud builds submit` to build and push container
- `deploy`: Deploys to Cloud Run with `--max-instances 1`
- `clean-revisions`: Removes non-serving revisions
- `all`: Pushes to main (CI/CD handles build and deploy)

## Content Updates

**Budget Analysis:** Edit `content/comprehensive_analysis.md`

**Community Posts:** Edit `lib/data.ts` - add to `posts` array with:
- `id`: URL slug
- `authorId`: Reference to authors array
- `title`, `type`, `date`, `content`
- `link`: Optional external link (e.g., Front Porch Forum)

**CSV Data:** Add files to `public/data/` and update YEARS array in `DataDownloads.tsx`

## Design Notes

- **Colors:** Forest green `#1e4d2b` (header, footer, accents)
- **Header:** Town seal with `object-contain object-left` on dark green background
- **Typography:** Gray text hierarchy (800/600/500/400)
- **Tables:** Gray header backgrounds, small text
