import { useMemo } from 'react'
import * as React from 'react'

import { Timeline } from '@mui/lab'
import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import EvidenceItem from '@/src/pagePartials/badge/preview/addons/EvidenceItem'
import { KlerosBadgeRequest, KlerosRequestType } from '@/types/generated/subgraph'

export default function EvidencesList({
  badgeId,
  showLastActivity = false,
}: {
  badgeId: string
  showLastActivity?: boolean
}) {
  const { t } = useTranslation()
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId)

  const activeRequest = badgeKlerosMetadata.data?.requests[
    badgeKlerosMetadata.data?.requests.length - 1
  ] as KlerosBadgeRequest

  const isRegistration = activeRequest.type === KlerosRequestType.Registration

  const evidencesToShow = useMemo(() => {
    const numOfItemsToShow = showLastActivity ? 3 : activeRequest.evidences.length

    if (!isRegistration || activeRequest.evidences.length > 3) {
      // if its registration, we  want to be sure that we don't show
      // the registration evidence as last activity
      return activeRequest.evidences.slice(-numOfItemsToShow)
    } else {
      return activeRequest.evidences.slice(1).slice(-numOfItemsToShow)
    }
  }, [activeRequest.evidences, isRegistration, showLastActivity])

  return (
    <Stack
      sx={{
        gap: 2,
        '& .MuiTimelineItem-missingOppositeContent:before': {
          display: 'none',
        },
      }}
    >
      <Typography variant="dAppTitle1">
        {showLastActivity
          ? t('badge.viewBadge.evidence.lastActivity')
          : t('badge.viewBadge.evidence.evidenceActivity')}
      </Typography>
      <Timeline>
        {isRegistration && (
          <EvidenceItem isRegistrationEvidence item={activeRequest.evidences[0]} />
        )}
        {evidencesToShow.map((item, index, array) => (
          <EvidenceItem isLast={index === array.length - 1} item={item} key={item.id + index} />
        ))}
      </Timeline>
    </Stack>
  )
}
