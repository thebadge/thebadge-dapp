import React from 'react'

import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { ListingCriteriaPreview } from '@/src/pagePartials/badge/explorer/addons/ListingCriteriaPreview'
import TimeLeftDisplay from '@/src/pagePartials/badge/explorer/addons/TimeLeftDisplay'
import ViewEvidenceButton from '@/src/pagePartials/badge/explorer/addons/ViewEvidenceButton'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { getEvidenceValue } from '@/src/utils/kleros/getEvidenceValue'
import { BadgeStatus } from '@/types/generated/subgraph'
import { MetadataColumn } from '@/types/kleros/types'
import { WCAddress } from '@/types/utils'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function BadgeEvidenceInfoPreview({ badgeId }: { badgeId: string }) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { challenge } = useCurateProvider()
  const badgeById = useBadgeById(badgeId)
  const badge = badgeById.data
  if (!badge) {
    throw 'There was not possible to get the needed data. Try again in some minutes.'
  }

  const { data: isClaimable } = useIsClaimable(badge.id)

  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badge?.id)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence
  const showTimeLeft = badge.status !== BadgeStatus.Approved

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw t('badge.curate.modal.errorEvidenceDisplay')
  }

  const getTooltipText = () => {
    if (address === badge.account.id) {
      return t('badge.curate.modal.ownBadgeChallenge')
    }
    if (isClaimable) {
      return t('badge.curate.modal.notClaimedBadge')
    }
    return ''
  }

  return (
    <Stack gap={4} p={1}>
      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} mintTxHash={badge.createdTxHash} />
        {showTimeLeft && (
          <TimeLeftDisplay reviewDueDate={badge?.badgeKlerosMetaData?.reviewDueDate} />
        )}
      </Box>

      {/* Badge Receiver Address */}
      <BadgeRequesterPreview ownerAddress={badge.account.id as WCAddress} />

      {/* Badge Evidence */}
      <Stack gap={2}>
        {/* Title + Raw */}

        <Box alignContent="center" display="flex" flex={1} justifyContent="space-between" mb={2}>
          <Typography variant="body3">{t('explorer.curate.evidences')}</Typography>
          <ViewEvidenceButton evidenceUrl={badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl} />
        </Box>

        {/* Evidence Items */}
        {badgeEvidence?.columns.map((column: MetadataColumn) => {
          return (
            <Stack key={column.label + column.description}>
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
            </Stack>
          )
        })}
      </Stack>

      {/* Listing Criteria info */}
      <Stack gap={1} position="relative">
        <Typography variant="body3">{t('explorer.curate.listingCriteria')}</Typography>
        <SafeSuspense>
          <ListingCriteriaPreview badgeModelId={badge?.badgeModel.id} />
        </SafeSuspense>
        <Divider color={colors.white} />
      </Stack>

      <Tooltip arrow title={getTooltipText()}>
        <Stack ml="auto">
          <ButtonV2
            backgroundColor={colors.redError}
            disabled={isClaimable}
            fontColor={colors.white}
            onClick={() => challenge(badge?.id)}
            sx={{ ml: 'auto' }}
            variant="contained"
          >
            {t('explorer.curate.challenge')}
          </ButtonV2>
        </Stack>
      </Tooltip>
    </Stack>
  )
}
