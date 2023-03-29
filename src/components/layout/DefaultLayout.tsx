import { Box, Container, styled, useTheme } from '@mui/material'
import { PaletteColorOptions } from '@mui/material/styles/createPalette'
import Headroom from 'react-headroom'
import { BackgroundGradient } from 'thebadge-ui-library'

import Header from '@/src/components/header/Header'
import { Footer } from '@/src/components/layout/Footer'
import MainMenu from '@/src/components/navigation/MainMenu'
import CurateContextProvider from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'

const Content = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '& .headroom--scrolled': {
    // When header is sticky on scroll, we reduce the size of the padding and the logo
    '& #header-container': {
      paddingTop: theme.spacing(2),
      '& #logo-container': {
        scale: '0.8',
        transformOrigin: 'left center',
      },
    },
  },
}))

type DefaultLayoutProps = {
  children: React.ReactElement
}

const NavigationRoom = styled(Box)(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  left: theme.spacing(0.25),
  top: theme.spacing(0),
}))

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const theme = useTheme()
  const { mode } = useColorMode()

  return (
    <>
      <CurateContextProvider>
        <Content>
          <Headroom
            style={{
              transition: 'all .5s cubic-bezier(0.83, 0, 0.17, 1)',
              background: '#000000',
              zIndex: 999,
            }}
          >
            <Container sx={{ flex: 1 }}>
              <Header />
            </Container>
          </Headroom>
          <BackgroundGradient
            gradient={theme.palette?.backgroundGradient[mode as keyof PaletteColorOptions]}
          />
          <Box sx={{ display: 'flex', flex: 1, minHeight: '50rem' }}>
            <NavigationRoom>
              <MainMenu />
            </NavigationRoom>
            <Container maxWidth={'lg'} sx={{ margin: theme.spacing(6, 'auto', 12) }}>
              {children}
            </Container>
          </Box>
        </Content>
      </CurateContextProvider>
      <Footer />
    </>
  )
}
