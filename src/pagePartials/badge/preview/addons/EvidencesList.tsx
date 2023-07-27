import * as React from 'react'

import { Timeline } from '@mui/lab'
import { Box } from '@mui/material'

import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import EvidenceItem from '@/src/pagePartials/badge/preview/addons/EvidenceItem'
import { KlerosBadgeRequest } from '@/types/generated/subgraph'

export default function EvidencesList({
  badgeId,
  showLastActivity = false,
}: {
  badgeId: string
  showLastActivity?: boolean
}) {
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId)

  const activeRequest = badgeKlerosMetadata.data?.requests[
    badgeKlerosMetadata.data?.requests.length - 1
  ] as KlerosBadgeRequest

  const numOfItemsToShow = showLastActivity ? 3 : activeRequest.evidences.length

  return (
    <Box
      sx={{
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none',
        },
      }}
    >
      <Timeline>
        {activeRequest.evidences.slice(-numOfItemsToShow).map((item, index) => (
          <EvidenceItem
            isLast={index === activeRequest.evidences.length * 3 - 1}
            item={item}
            key={item.id + index}
          />
        ))}
      </Timeline>
    </Box>
  )
}
