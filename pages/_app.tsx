import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

import createCache from '@emotion/cache'
import { EmotionCache } from '@emotion/react'
import { styled } from '@mui/material'
import { Box } from '@mui/material'
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter' // or `v13-pages` if you are using Next.js v14
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { SWRConfig } from 'swr'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import Toast from '@/src/components/toast/Toast'
import { Head } from '@/src/pagePartials/index/Head'
import ThemeProvider from '@/src/providers/themeProvider'
import { NextPageWithLayout } from '@/types/next'

// Css
import '/node_modules/react-grid-layout/css/styles.css'
import '/node_modules/react-resizable/css/styles.css'
import 'node_modules/@thebadge/ui-library/dist/index.css'
import 'sanitize.css'
import 'src/theme/global.css'
import 'src/theme/icon-animation.css'

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

const DefaultLayout = dynamic(() => import('@/src/components/layout/DefaultLayout'), {
  ssr: false,
})
const Web3Modal = dynamic(() => import('@/src/providers/web3ConnectionProvider'), {
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
  emotionCache = clientSideEmotionCache,
  pageProps,
}: AppPropsWithLayout) {
  // Black magic explained here https://nextjs.org/docs/basic-features/layouts
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <>
      <GoogleAnalytics />
      <Head />
      <AppCacheProvider emotionCache={emotionCache}>
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <SWRConfig
            value={{
              suspense: true,
              revalidateOnFocus: false,
            }}
          >
            <ThemeProvider>
              <SafeSuspense>
                <Web3Modal>
                  <SectionReferencesProvider>
                    <TransactionNotificationProvider>
                      <CookiesWarningProvider>
                        <Container>{getLayout(<Component {...pageProps} />)}</Container>
                      </CookiesWarningProvider>
                    </TransactionNotificationProvider>
                  </SectionReferencesProvider>
                </Web3Modal>
              </SafeSuspense>
              <Toast />
            </ThemeProvider>
          </SWRConfig>
        </Box>
      </AppCacheProvider>
    </>
  )
}
