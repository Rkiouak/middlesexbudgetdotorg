"use client";

export default function PdfExportButton() {
  return (
    <a
      href="/Middlesex-Budget-Analysis-2027.pdf"
      download="Middlesex-Budget-Analysis-2027.pdf"
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e4d2b] text-white text-sm font-medium rounded hover:bg-[#2d724a] transition-colors"
      aria-label="Download page as PDF"
    >
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Download PDF
    </a>
  );
}
