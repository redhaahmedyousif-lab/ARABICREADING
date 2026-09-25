import type { NextConfig } from "next";

// Static export for GitHub Pages, enabled only in the deploy workflow
// (see .github/workflows/deploy-pages.yml). Local dev/build are unaffected.
const isPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = isPagesBuild
  ? {
      output: "export",
      // Project sites are served from /<repo>/, e.g. /ARABICREADING
      basePath: process.env.PAGES_BASE_PATH ?? "",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
