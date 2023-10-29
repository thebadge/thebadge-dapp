import withBundleAnalyzer from '@next/bundle-analyzer';
import mdx from '@next/mdx'
import remarkGfm from 'remark-gfm'
import nextTranslate from 'next-translate-plugin'

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
const withMDX = mdx({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})

export default withMDX(nextTranslate(withBundleAnalyzerWrapper(
  defineNextConfig({
    reactStrictMode: false,
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
    transpilePackages: ['@mui/material', '@thebadge/ui-library', '@web3-onboard/*'],
    images: {
      unoptimized: true,
      domains: [
        "tokens.1inch.io",
        "ethereum-optimism.github.io",
        "assets.coingecko.com"
      ]
    },
    webpack: (config, {isServer}) => {
      if (isServer) {
        config.resolve.alias.lokijs = false;
        config.resolve.alias.encoding = false;
        config.resolve.alias["pino-pretty"] = false;
        config.resolve.alias["@web3-onboard/react"] = false;
        config.resolve.alias['@thebadge/ui-library'] = false;
      }
      // load worker files as a urls by using Asset Modules
      // https://webpack.js.org/guides/asset-modules/
      config.module.rules.unshift({
        test: /pdf\.worker\.(min\.)?js/,
        type: "asset/resource",
        generator: {
          filename: "static/worker/[hash][ext][query]"
        }
      });
      return config;
    }
  }),
)));
