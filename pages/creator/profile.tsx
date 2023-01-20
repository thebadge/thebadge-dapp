import { useRouter } from 'next/navigation'
import { ReactElement } from 'react'

import { Typography } from '@mui/material'
import { ethers } from 'ethers'
import { colors } from 'thebadge-ui-library'

import { NextPageWithLayout } from '@/pages/_app'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { DefaultLayout } from '@/src/components/layout/BaseLayout'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

const Profile: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const creatorByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })
  const router = useRouter()

  if (!creatorByAddress.data?.emitter) {
    router.push('/creator/register')
    return null
  }

  return (
    <>
      <Typography color={colors.white} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography color={colors.white} variant="h3">
        This is your creator profile
      </Typography>

      <div>
        <div>Connected address is already an emitter</div>
        <div>Address: {creatorByAddress.data.emitter.id}</div>
        <div>Metadata: {creatorByAddress.data.emitter.metadata}</div>
      </div>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default withGenericSuspense(Profile)
