import { Box, Container, styled } from '@mui/material'
import Headroom from 'react-headroom'

import { BackgroundGradient } from '@/src/components/layout/BackgroundGradient'
import Header from '@/src/components/layout/Header'

const Content = styled(Box)(({ theme }) => ({
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

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div>
      <BackgroundGradient />
      <Container>
        <Content>
          <Headroom
            style={{
              transition: 'all .5s cubic-bezier(0.83, 0, 0.17, 1)',
            }}
          >
            <Header />
          </Headroom>
          {children}
        </Content>
      </Container>
    </div>
  )
}
