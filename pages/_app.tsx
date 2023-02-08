import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

import createCache from '@emotion/cache'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { styled } from '@mui/material'
import { Box } from '@mui/material'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { SWRConfig } from 'swr'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { Footer } from '@/src/components/layout/Footer'
import Toast from '@/src/components/toast/Toast'
import { Head } from '@/src/pagePartials/index/Head'
import ThemeProvider from '@/src/providers/themeProvider'
import { NextPageWithLayout } from '@/types/next'

import 'node_modules/thebadge-ui-library/dist/index.css'
import 'sanitize.css'
import 'src/theme/global.css'
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'

const CookiesWarningProvider = dynamic(() => import('@/src/providers/cookiesWarningProvider'), {
  ssr: false,
})
const SectionReferencesProvider = dynamic(() => import('@/src/providers/referencesProvider'), {
  ssr: false,
})
const TransactionNotificationProvider = dynamic(
  () => import('@/src/providers/TransactionNotificationProvider'),
  {
    ssr: false,
  },
)
const Web3ConnectionProvider = dynamic(() => import('@/src/providers/web3ConnectionProvider'), {
  ssr: false,
})
const DefaultLayout = dynamic(() => import('@/src/components/layout/DefaultLayout'), {
  ssr: false,
})

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  emotionCache?: EmotionCache
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createCache({
  key: 'css',
  prepend: true,
}) as EmotionCache

export const InnerContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  flexShrink: 0,
  maxWidth: '100%',
  // width: theme.layout.maxWidth,
}))

const Container = styled(InnerContainer)`
  flex-grow: 1;
`

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout) {
  // Black magic explained here https://nextjs.org/docs/basic-features/layouts
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <>
      <GoogleAnalytics />
      <Head />
      <CacheProvider value={emotionCache}>
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <SWRConfig
            value={{
              suspense: true,
              revalidateOnFocus: false,
            }}
          >
            <Web3ConnectionProvider>
              <ThemeProvider>
                <SafeSuspense>
                  <SectionReferencesProvider>
                    <TransactionNotificationProvider>
                      <CookiesWarningProvider>
                        <Container>{getLayout(<Component {...pageProps} />)}</Container>
                        <Footer />
                      </CookiesWarningProvider>
                    </TransactionNotificationProvider>
                  </SectionReferencesProvider>
                </SafeSuspense>
                <Toast />
              </ThemeProvider>
            </Web3ConnectionProvider>
          </SWRConfig>
        </Box>
      </CacheProvider>
    </>
  )
}
