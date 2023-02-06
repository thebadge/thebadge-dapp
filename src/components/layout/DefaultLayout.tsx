import { Box, Container, styled, useTheme } from '@mui/material'
import { PaletteColorOptions } from '@mui/material/styles/createPalette'
import Headroom from 'react-headroom'
import { BackgroundGradient } from 'thebadge-ui-library'

import Header from '@/src/components/header/Header'
import { MainMenu } from '@/src/components/navigation/MainMenu'
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
  left: theme.spacing(6),
  top: theme.spacing(12),
}))

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const theme = useTheme()
  const { mode } = useColorMode()

  return (
    <>
      <Content>
        <Headroom
          style={{
            transition: 'all .5s cubic-bezier(0.83, 0, 0.17, 1)',
            background: '#000000',
          }}
        >
          <Container sx={{ flex: 1 }}>
            <Header />
          </Container>
        </Headroom>
        <BackgroundGradient
          gradient={theme.palette?.backgroundGradient[mode as keyof PaletteColorOptions]}
        />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <NavigationRoom>
            <MainMenu />
          </NavigationRoom>
          <Container maxWidth={'md'} sx={{ margin: theme.spacing(10, 'auto') }}>
            {children}
          </Container>
        </Box>
      </Content>
    </>
  )
}
