import { Head, Html, Main, NextScript } from 'next/document'

import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v13-pagesRouter'
import type { DocumentHeadTagsProps } from '@mui/material-nextjs/v13-pagesRouter'

import { APP_URL } from '@/src/constants/common'

export default function MyDocument(props: DocumentHeadTagsProps) {
  const title = 'The Badge dApp - Decentralized Certifications Platform'
  const description =
    'TheBadge is a decentralized certification platform that allows companies, institutions, and individuals to bring verified real-world certifications to the blockchain.'

  const twitterHandle = '@thebadgexyz'

  return (
    <Html lang="en">
      <Head>
        <meta content="website" property="og:type" />
        <meta content={description} name="description" />
        <meta content={title} property="og:title" />
        <meta content={`${APP_URL}`} property="og:url" />

        <meta content={`${APP_URL}/shareable/the_badge_banner.webp`} property="og:image" />
        <meta content="image/webp" property="og:image:type" />
        <meta content="1404" property="og:image:width" />
        <meta content="459" property="og:image:height" />

        <meta content={description} property="og:description" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content={title} name="twitter:site" />
        <meta content={twitterHandle} name="twitter:creator" />

        <meta content="summary_large_image" name="twitter:card" />
        <meta content={twitterHandle} name="twitter:site" />
        <meta content={`${APP_URL}/shareable/the_badge_banner.webp`} name="twitter:image" />

        <link href="/favicon/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/favicon/site.webmanifest" rel="manifest" />

        <link color="#333" href="/favicon/safari-pinned-tab.svg" rel="mask-icon" />
        <meta content="#333" name="msapplication-TileColor" />
        <meta content="#333" name="theme-color" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modals" />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = documentGetInitialProps
