import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export generates files in 'out/' directory
  // Deploy to GCS bucket with: gsutil -m rsync -r out/ gs://your-bucket/
};

export default nextConfig;
