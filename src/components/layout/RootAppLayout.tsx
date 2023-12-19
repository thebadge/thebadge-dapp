'use client'
import dynamic from 'next/dynamic'

import { Box, styled } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter' // or `v14-appRouter` if you are using Next.js v14
import { SWRConfig } from 'swr'

import Toast from '@/src/components/toast/Toast'
import { PreventActionIfOutOfService } from '@/src/pagePartials/errors/preventActionIfOutOfService'
import TransactionNotificationProvider from '@/src/providers/TransactionNotificationProvider'
import SectionReferencesProvider from '@/src/providers/referencesProvider'
import ThemeProvider from '@/src/providers/themeProvider'

const Web3ConnectionProvider = dynamic(() => import('@/src/providers/web3ConnectionProvider'), {
  ssr: false,
})

const InnerContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  flexShrink: 0,
  maxWidth: '100%',
  // width: theme.layout.maxWidth,
}))

export default function RootAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <SWRConfig
        value={{
          suspense: true,
          revalidateOnFocus: false,
        }}
      >
        <Web3ConnectionProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider>
              <SectionReferencesProvider>
                <TransactionNotificationProvider>
                  <PreventActionIfOutOfService>
                    <InnerContainer>{children}</InnerContainer>
                  </PreventActionIfOutOfService>
                </TransactionNotificationProvider>
              </SectionReferencesProvider>
              <Toast />
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Web3ConnectionProvider>
      </SWRConfig>
    </Box>
  )
}
