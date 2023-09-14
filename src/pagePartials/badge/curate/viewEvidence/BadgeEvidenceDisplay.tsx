import React from 'react'

import { Box } from '@mui/material'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import { getEvidenceValue } from '@/src/utils/kleros/getEvidenceValue'

export default function BadgeEvidenceDisplay({ badgeId }: { badgeId: string }) {
  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badgeId)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw 'There was an error fetching the badge evidence, try again in some minutes.'
  }

  return (
    <TBSwiper
      items={
        badgeEvidence?.columns.map((column, index) => (
          <Box
            key={'evidence-' + index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: 4,
              marginBottom: 4,
              width: '100%',
              '> *': {
                width: '90%',
                display: 'flex',
              },
            }}
          >
            <SafeSuspense>
              <DisplayEvidenceField
                columnItem={column}
                value={getEvidenceValue(
                  badgeEvidence?.values,
                  badgeEvidence?.columns,
                  column.label,
                  column.type,
                )}
              />
            </SafeSuspense>
          </Box>
        )) || []
      }
      maxSlidesPerView={1}
      spaceBetween={8}
    />
  )
}
