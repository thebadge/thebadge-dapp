import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import { useWeb3ConnectedApp, useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Address: React.FC = () => {
  const { address } = useWeb3ConnectedApp()

  return address ? (
    <Typography color={colors.white} variant="title1">
      {address}
    </Typography>
  ) : null
}

const Home: NextPageWithLayout = () => {
  const { isAppConnected } = useWeb3Connection()

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>
      {isAppConnected && <Address />}
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Home
