const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import("next").NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: process.env.IS_GH_ACTION === "true",
  },
  compiler: {
    styledComponents: true,
  },
  modularizeImports: {
    transpilePackages: ["@mui/material"]
  },
  images: {
    domains: [
      "tokens.1inch.io",
      "ethereum-optimism.github.io",
      "assets.coingecko.com"
    ]
  }
});
