import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { ResizedBadgePreviewsList } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { badgesExampleList } from '@/src/pagePartials/home/SectionBoxes'

export default function BadgeListTypeList() {
  const gql = useSubgraph()
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
