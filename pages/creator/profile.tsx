import { useRouter } from 'next/navigation'
import { ReactElement } from 'react'

import { Button, Typography } from '@mui/material'
import { ethers } from 'ethers'
import { z } from 'zod'

import { NextPageWithLayout } from '@/pages/_app'
import { RegisterCuratorSchema } from '@/pages/creator/register'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { DefaultLayout } from '@/src/components/layout/DefaultLayout'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

type CreatorMetadata = z.infer<typeof RegisterCuratorSchema>

const Profile: NextPageWithLayout = () => {
  const { address, appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const creatorByAddress = gql.useEmitter({ id: address || ethers.constants.AddressZero })
  const router = useRouter()
  const { data: creatorMetadata } = useS3Metadata<CreatorMetadata>(
    creatorByAddress.data?.emitter?.metadata || '',
  )

  if (!creatorByAddress.data?.emitter) {
    router.push('/creator/register')
    return null
  }

  if (!creatorMetadata) {
    throw Error('There was an error trying to fetch creator metadata')
  }

  return (
    <>
      <Typography component={'h3'} variant="h3">
        Welcome to THE BADGE!
      </Typography>

      <Typography component={'h5'} variant="h5">
        This is your creator profile
      </Typography>

      <div>
        {/* TODO: fix este bardo con los divs  */}
        <div>
          <>Name: {creatorMetadata.name}</>
        </div>
        <div>
          <>Description: {creatorMetadata.description}</>
        </div>
        <div>
          <>Website: {creatorMetadata.website}</>
        </div>
        <div>
          <>Twitter: {creatorMetadata.twitter}</>
        </div>
        <div>
          <>Discord: {creatorMetadata.discord}</>
        </div>
        <div>
          <>Email: {creatorMetadata.email}</>
        </div>

        <img alt="logo" src={(creatorMetadata.logo as any).s3Url} />
      </div>

      <div>
        <Button disabled>Verify my account</Button>
        (coming soon)
      </div>
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default withGenericSuspense(Profile)
