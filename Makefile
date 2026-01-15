.PHONY: build deploy all clean-revisions

PROJECT := clojure-gen-blog
REGION := us-central1
SERVICE := middlesex-budget
IMAGE := us-central1-docker.pkg.dev/$(PROJECT)/cloud-run/$(SERVICE):latest

build:
	gcloud builds submit --tag $(IMAGE) --project=$(PROJECT)

deploy:
	gcloud run deploy $(SERVICE) \
		--image $(IMAGE) \
		--platform managed \
		--region $(REGION) \
		--allow-unauthenticated \
		--memory 512Mi \
		--cpu 1 \
		--min-instances 0 \
		--max-instances 1 \
		--port 3000 \
		--project=$(PROJECT)

clean-revisions:
	@echo "Cleaning up old revisions (keeping only serving revision)..."
	@gcloud run revisions list --service=$(SERVICE) --region=$(REGION) --project=$(PROJECT) \
		--format="value(name)" --filter="status.conditions.status:False" | \
		xargs -r -I {} gcloud run revisions delete {} --region=$(REGION) --project=$(PROJECT) --quiet

push:
	git push origin main

all: push
