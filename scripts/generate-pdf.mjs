#!/usr/bin/env node

/**
 * Generate PDF of the budget analysis page at build time.
 * Run with: node scripts/generate-pdf.mjs
 * Requires: npm run dev to be running on localhost:3000
 */

import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../public/Middlesex-Budget-Analysis-2027.pdf");

async function generatePdf() {
  console.log("Launching browser...");

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  });

  const page = await browser.newPage();

  // Set viewport for consistent rendering
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 2,
  });

  console.log("Navigating to page...");

  // Navigate to the local dev server
  const url = process.env.PDF_SOURCE_URL || "http://localhost:3000";
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  // Wait for charts to render
  console.log("Waiting for charts to render...");
  await page.waitForSelector("[role='img']", { timeout: 10000 }).catch(() => {
    console.log("No chart elements found, continuing...");
  });

  // Additional wait for any animations
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Hide elements we don't want in PDF
  await page.addStyleTag({
    content: `
      /* Hide sidebar, mobile nav, skip link, PDF button */
      .skip-link,
      [class*="w-48"][class*="flex-shrink-0"],
      [class*="fixed"][class*="bottom-0"],
      button[aria-label="Download page as PDF"] {
        display: none !important;
      }

      /* Ensure main content takes full width */
      main {
        margin-left: 0 !important;
      }

      /* Better page breaks */
      section {
        page-break-inside: avoid;
      }

      /* Ensure charts don't get cut off */
      [role="img"] {
        page-break-inside: avoid;
      }
    `,
  });

  console.log("Generating PDF...");

  // Generate PDF
  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "15mm",
      right: "15mm",
      bottom: "15mm",
      left: "15mm",
    },
  });

  await browser.close();

  // Ensure public directory exists
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

  // Write PDF to public directory
  writeFileSync(OUTPUT_PATH, pdf);

  console.log(`PDF generated: ${OUTPUT_PATH}`);
  console.log(`File size: ${(pdf.length / 1024).toFixed(1)} KB`);
}

generatePdf().catch((error) => {
  console.error("Error generating PDF:", error);
  process.exit(1);
});
