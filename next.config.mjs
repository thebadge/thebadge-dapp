import withBundleAnalyzer from '@next/bundle-analyzer';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}
const withBundleAnalyzerWrapper = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzerWrapper(
  defineNextConfig({
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
    transpilePackages: ['@mui/material', 'thebadge-ui-library', '@web3-onboard/*'],
    images: {
      unoptimized: true,
      domains: [
        "tokens.1inch.io",
        "ethereum-optimism.github.io",
        "assets.coingecko.com"
      ]
    }
  }),
);
