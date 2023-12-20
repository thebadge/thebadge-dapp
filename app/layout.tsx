import { Metadata } from 'next'

import { Mulish } from 'next/font/google'

import { APP_URL } from '@/src/constants/common'

import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import 'node_modules/@thebadge/ui-library/dist/index.css'
import 'sanitize.css'
import 'src/theme/global.css'
import 'src/theme/icon-animation.css'

const mulishFont = Mulish({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap', // 👈 The documentation seems to be wrong. 'swap' is not the default value, so we need to specify it
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={mulishFont.className}>
        {/*<RootAppLayout>{}</RootAppLayout>*/}
        {children}
      </body>
    </html>
  )
}

/**
 * Read more on https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const title = 'The Badge dApp - Decentralized certifications tokenized as NFTs'
  const description =
    'The Badge is a decentralized certification platform powered by Ethereum. It provides users with the opportunity to tokenize any piece of information from the real world in the form of badges. These badges are verified and validated by the community, which decides what should be accepted and what should not be.'
  const twitterHandle = '@thebadgexyz'

  return {
    title: {
      template: '%s | TheBadge',
      default: title, // a default is required when creating a template
    },
    description,
    openGraph: {
      description,
      url: APP_URL,
      type: 'website',
      images: [
        {
          url: `${APP_URL}/shareable/the_badge_banner.webp`,
          width: 1404,
          height: 459,
          type: 'image/webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: twitterHandle,
      images: [`${APP_URL}/shareable/the_badge_banner.webp`],
    },
    icons: {
      icon: [
        { rel: 'icon', url: '/favicon/favicon.svg' },
        { rel: 'icon', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
        { rel: 'icon', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
      ],
      shortcut: '/favicon/favicon.svg',
      apple: [
        { url: '/favicon/apple-touch-icon.png' },
        { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/favicon/safari-pinned-tab.svg',
        },
      ],
    },
    manifest: '/favicon/site.webmanifest',
  }
}
