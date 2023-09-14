import { Box, Container, styled, useTheme } from '@mui/material'
import { PaletteColorOptions } from '@mui/material/styles/createPalette'
import { BackgroundGradient } from '@thebadge/ui-library'
import Headroom from 'react-headroom'

import Header from '@/src/components/header/Header'
import { Footer } from '@/src/components/layout/Footer'
import MainMenu from '@/src/components/navigation/MainMenu'
import { useSizeSM } from '@/src/hooks/useSize'
import CurateContextProvider from '@/src/providers/curateProvider'
import { useColorMode } from '@/src/providers/themeProvider'

const HEADER_HEIGHT = 54
const FOOTER_HEIGHT = 280

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

const StyledBody = styled(Box)(() => ({
  display: 'flex',
  flex: 1,
  height: `calc(100svh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
  minHeight: `80svh`,
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
  const isMobile = useSizeSM()
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

          <StyledBody>
            {!isMobile && (
              <NavigationRoom>
                <MainMenu />
              </NavigationRoom>
            )}
            <Container
              maxWidth={'lg'}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                margin: theme.spacing(6, 'auto', 0),
              }}
            >
              {children}
            </Container>
          </StyledBody>
        </Content>
      </CurateContextProvider>
      <Footer />
    </>
  )
}
