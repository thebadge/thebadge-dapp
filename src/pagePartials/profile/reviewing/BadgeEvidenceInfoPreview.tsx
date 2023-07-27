import { useRouter } from 'next/navigation'
import React from 'react'

import { Box, Divider, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { ListingCriteriaPreview } from '@/src/pagePartials/badge/explorer/addons/ListingCriteriaPreview'
import TimeLeftDisplay from '@/src/pagePartials/badge/explorer/addons/TimeLeftDisplay'
import ViewEvidenceButton from '@/src/pagePartials/badge/explorer/addons/ViewEvidenceButton'
import EvidencesList from '@/src/pagePartials/badge/preview/addons/EvidencesList'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { Badge } from '@/types/generated/subgraph'

export default function BadgeReviewingInfoPreview({ badge }: { badge: Badge }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { challenge } = useCurateProvider()

  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badge?.id)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw 'There was an error fetching the badge evidence, try again in some minutes.'
  }

  return (
    <Stack gap={4} p={1}>
      {/* Badge Receiver Address + Raw evidence info */}

      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} />
        <TimeLeftDisplay reviewDueDate={badge?.badgeKlerosMetaData?.reviewDueDate} />
      </Box>

      {/* Badge Receiver Address */}
      <BadgeRequesterPreview ownerAddress={badge.account.id} />

      {/* Badge Evidence */}
      <Stack gap={2}>
        <Box alignContent="center" display="flex" flex={1} justifyContent="space-between" mb={2}>
          <Typography variant="body3">{`Requester ` + t('explorer.curate.evidences')}</Typography>
          <ViewEvidenceButton evidenceUrl={badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl} />
        </Box>
        <Divider color={colors.white} />
      </Stack>

      <Stack gap={2}>
        <Typography variant="body3">{`Last Activity`}</Typography>
        <EvidencesList badgeId={badge.id} />
        <Divider color={colors.white} />
      </Stack>

      <Box display="flex" flex="1" justifyContent="space-between">
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.white}
          onClick={() => router.push(`/badge/preview/${badge.id}`)}
        >
          {t('profile.badgesIAmReviewing.viewAll')}
        </ButtonV2>
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.white}
          onClick={() => challenge(badge?.id)}
          variant="outlined"
        >
          {t('profile.badgesIAmReviewing.addEvidence')}
        </ButtonV2>
      </Box>

      {/* Listing Criteria info */}
      <Stack gap={1} position="relative">
        <Typography fontSize={14} variant="body3">
          {t('explorer.curate.listingCriteria')}
        </Typography>
        <SafeSuspense>
          {/* TODO NEED TO BE UPDATED WITH REQUEST DATA */}
          <ListingCriteriaPreview badgeModelId={badge?.badgeModel.id} />
        </SafeSuspense>
        <Divider color={colors.white} />
      </Stack>
    </Stack>
  )
}
