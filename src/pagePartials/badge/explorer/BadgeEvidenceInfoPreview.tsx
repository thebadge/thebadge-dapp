import React from 'react'

import { Box, Divider, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { constants } from 'ethers'
import { useTranslation } from 'next-export-i18n'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { ListingCriteriaPreview } from '@/src/pagePartials/badge/explorer/addons/ListingCriteriaPreview'
import TimeLeftDisplay from '@/src/pagePartials/badge/explorer/addons/TimeLeftDisplay'
import ViewEvidenceButton from '@/src/pagePartials/badge/explorer/addons/ViewEvidenceButton'
import { useCurateProvider } from '@/src/providers/curateProvider'
import isDev from '@/src/utils/isDev'
import { getEvidenceValue } from '@/src/utils/kleros/getEvidenceValue'
import { Badge } from '@/types/generated/subgraph'

export default function BadgeEvidenceInfoPreview({ badge }: { badge: Badge }) {
  const { t } = useTranslation()
  const { challenge } = useCurateProvider()

  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badge?.id)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw 'There was an error fetching the badge evidence, try again in some minutes.'
  }

  return (
    <Stack gap={4} p={1}>
      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} />
        <TimeLeftDisplay reviewDueDate={badge?.badgeKlerosMetaData?.reviewDueDate} />
      </Box>

      {/* Badge Receiver Address */}
      <BadgeRequesterPreview ownerAddress={badge.account.id} />

      {/* Badge Evidence */}
      <Stack gap={2}>
        {/* Title + Raw */}

        <Box alignContent="center" display="flex" flex={1} justifyContent="space-between" mb={2}>
          <Typography variant="body3">{t('explorer.curate.evidences')}</Typography>
          <ViewEvidenceButton evidenceUrl={badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl} />
        </Box>

        {/* Evidence Items */}

        {badgeEvidence?.columns.map((column) => {
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

      <Box display="flex" flex="1" justifyContent="space-between">
        <ButtonV2
          backgroundColor={colors.redError}
          fontColor={colors.white}
          onClick={() => challenge(badge?.id)}
          sx={{ ml: 'auto' }}
          variant="contained"
        >
          {t('explorer.curate.challenge')}
        </ButtonV2>
      </Box>
      {/* TCR Contract Address, available on develop */}

      {isDev && (
        <Box display="flex" gap={1}>
          <Typography fontSize={14} variant="body4">
            {t('explorer.curate.curationList')}
          </Typography>
          <Address address={badge?.badgeModel.badgeModelKleros?.tcrList || constants.AddressZero} />
        </Box>
      )}
    </Stack>
  )
}
