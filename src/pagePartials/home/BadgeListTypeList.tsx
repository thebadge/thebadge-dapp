import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { ResizedBadgePreviewsList } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { badgesExampleList } from '@/src/pagePartials/home/SectionBoxes'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function BadgeListTypeList() {
  const { appChainId } = useWeb3Connection()
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeTypes = gql.useBadgeTypes()
  const router = useRouter()

  const badgesList = useMemo(() => {
    const badges = badgeTypes.data?.badgeTypes.map((badgeType) => {
      return (
        <Box
          key={badgeType.id}
          onClick={() => router.push(`/badge/mint/${badgeType.id}`)}
          sx={{ height: '100%', display: 'flex' }}
        >
          <SafeSuspense>
            <BadgeTypeMetadata metadata={badgeType?.metadataURL} size="small" />
          </SafeSuspense>
        </Box>
      )
    })
    // TODO Remove badgesExampleList when we have more volumen to complete the list
    if (!badges) return badgesExampleList
    if (badges.length >= 5) {
      return badges
    }
    return [...badges, ...badgesExampleList].slice(0, 5)
  }, [badgeTypes.data?.badgeTypes, router])

  return (
    <ResizedBadgePreviewsList badges={badgesList} sx={{ padding: 0, scale: '0.9 !important' }} />
  )
}
