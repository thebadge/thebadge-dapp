import { Box, Container, styled } from '@mui/material'
import Headroom from 'react-headroom'

import Header from '@/src/components/header/Header'
import { MainMenu } from '@/src/components/navigation/MainMenu'

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
  padding: '5%',
  [theme.breakpoints.up('xl')]: {
    padding: '10%',
  },
}))

export const MainLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Container sx={{ flex: 1 }}>
        <Content>
          <Headroom
            style={{
              transition: 'all .5s cubic-bezier(0.83, 0, 0.17, 1)',
            }}
          >
            <Header />
          </Headroom>
          <NavigationRoom>
            <MainMenu />
            <Container>{children}</Container>
          </NavigationRoom>
        </Content>
      </Container>
    </>
  )
}
