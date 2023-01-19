const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import("next").NextConfig} */
module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
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
