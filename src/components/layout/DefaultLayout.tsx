import { Box, Container, styled } from '@mui/material'
import { PaletteColorOptions } from '@mui/material/styles/createPalette'
import Headroom from 'react-headroom'
import { BackgroundGradient } from 'thebadge-ui-library'

import Header from '@/src/components/header/Header'
import { MainMenu } from '@/src/components/navigation/MainMenu'
import { useColorMode } from '@/src/providers/themeProvider'
import { getTheme } from '@/src/theme/theme'

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
  display: 'flex',
  flexDirection: 'row',
  paddingTop: '5%',
  [theme.breakpoints.up('xl')]: {
    paddingTop: '10%',
  },
}))

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { mode } = useColorMode()
  const theme = getTheme(mode)
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
        <Box sx={{ flex: 1 }}>
          <NavigationRoom>
            <MainMenu />
            <Container maxWidth={'md'}>{children}</Container>
          </NavigationRoom>
        </Box>
      </Content>
    </>
  )
}
