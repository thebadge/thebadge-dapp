import { useRouter } from 'next/navigation'
import React from 'react'

import { Alert, Box, Divider, Skeleton, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import { ListingCriteriaPreview } from '@/src/pagePartials/badge/explorer/addons/ListingCriteriaPreview'
import ViewEvidenceButton from '@/src/pagePartials/badge/explorer/addons/ViewEvidenceButton'
import EvidencesList from '@/src/pagePartials/badge/preview/addons/EvidencesList'
import DisputeDisplay from '@/src/pagePartials/profile/reviewing/addons/DisputeDisplay'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { generateBadgePreviewUrl } from '@/src/utils/navigation/generateUrl'
import { Badge, KlerosBadgeRequest, KlerosRequestType } from '@/types/generated/subgraph'

export default function BadgeReviewingInfoPreview({ badge }: { badge: Badge }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { addMoreEvidence } = useCurateProvider()

  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badge?.id)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence

  const activeRequest = badgeKlerosMetadata.data?.requests[
    badgeKlerosMetadata.data?.requests.length - 1
  ] as KlerosBadgeRequest

  const isRegistration = activeRequest.type === KlerosRequestType.Registration

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw 'There was an error fetching the badge evidence, try again in some minutes.'
  }

  return (
    <Stack gap={4} p={1}>
      {/* Badge Receiver Address + Raw evidence info */}

      <Alert severity="info">
        {isRegistration
          ? t('profile.normalProfile.badgesIAmReviewing.submissionChallenge')
          : t('profile.normalProfile.badgesIAmReviewing.removalChallenge')}
      </Alert>

      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} />
        {activeRequest.disputeID ? (
          <DisputeDisplay disputeId={activeRequest.disputeID} />
        ) : (
          <Skeleton height={28} variant="rounded" width={120} />
        )}
      </Box>

      {/* Badge Evidence */}
      <Stack gap={2}>
        <Box alignContent="center" display="flex" flex={1} justifyContent="space-between" mb={2}>
          <Typography variant="body3">{`Requester ` + t('explorer.curate.evidences')}</Typography>
          <ViewEvidenceButton evidenceUrl={badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl} />
        </Box>
        <Divider color={colors.white} />
      </Stack>

      <Stack gap={2}>
        <EvidencesList badgeId={badge.id} showLastActivity />
        <Divider color={colors.white} />
      </Stack>

      <Box display="flex" flex="1" justifyContent="space-between">
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.white}
          onClick={() => router.push(generateBadgePreviewUrl(badge.id))}
        >
          {t('profile.normalProfile.badgesIAmReviewing.viewAll')}
        </ButtonV2>
        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.white}
          onClick={() => addMoreEvidence(badge?.id)}
          variant="outlined"
        >
          {t('profile.normalProfile.badgesIAmReviewing.addEvidence')}
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
