.PHONY: build deploy all clean generate-pdf dev

PROJECT := clojure-gen-blog
BUCKET := gs://middlesex-budget-site

# Build static site (output in 'out/' directory)
build:
	npm run build

# Deploy static files to GCS bucket
deploy: build
	gsutil -m rsync -r -d out/ $(BUCKET)
	gsutil web set -m index.html -e 404.html $(BUCKET)
	@echo "Deployed to $(BUCKET)"

# Generate PDF from running dev server (run 'npm run dev' first in another terminal)
generate-pdf:
	node scripts/generate-pdf.mjs

# Start dev server
dev:
	npm run dev

# Clean build artifacts
clean:
	rm -rf out/ .next/

# Full deploy: generate PDF, build, and deploy
all: generate-pdf deploy

push:
	git push origin main
