import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

import createCache from '@emotion/cache'
import { EmotionCache } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const cache = createCache({
      key: 'css',
      prepend: true,
    }) as EmotionCache
    const { extractCriticalToChunks } = createEmotionServer(cache)

    const startTime = Date.now()
    try {
      /**
       * Render the page as normal, but now that ApolloClient is initialized and the cache is full, each query will actually work.
       */
      const initialProps = await Document.getInitialProps(ctx)

      // This is important. It prevents emotion to render invalid HTML.
      // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
      const emotionStyles = extractCriticalToChunks(initialProps.html)
      const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
          dangerouslySetInnerHTML={{ __html: style.css }}
          data-emotion={`${style.key} ${style.ids.join(' ')}`}
          key={style.key}
        />
      ))

      console.info(`Render Time: ${Date.now() - startTime} milliseconds.`)

      return {
        ...initialProps,
        emotionStyleTags,
        styles: <>{initialProps.styles}</>,
      }
    } catch (error) {
      console.error(error)
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
      }
    }
  }

  render = () => {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon/favicon.svg" rel="icon" type="image/svg+xml" />
          <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/favicon/site.webmanifest" rel="manifest" />
          <link color="#333" href="/favicon/safari-pinned-tab.svg" rel="mask-icon" />
          <meta content="#333" name="msapplication-TileColor" />
          <meta content="#333" name="theme-color" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="modals" />
        </body>
      </Html>
    )
  }
}
