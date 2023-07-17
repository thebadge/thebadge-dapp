import React from 'react'

import { Box, Divider, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import { ListingCriteriaPreview } from '@/src/pagePartials/badge/explorer/ListingCriteriaPreview'
import { useCurateProvider } from '@/src/providers/curateProvider'
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
    <Stack gap={4}>
      {/* Badge Receiver Address + Raw evidence info */}

      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <Stack gap={1}>
          <Typography fontSize={14} variant="body4">
            {t('explorer.curate.curationList')}
          </Typography>
          <Address address={badge?.badgeModel.badgeModelKleros?.tcrList} />
        </Stack>
        <Box alignItems="flex-end" display="flex">
          <Typography fontSize={14} variant="body4">
            {`${t('explorer.curate.badgeId')} ${badge?.id}`}
          </Typography>
        </Box>
      </Box>

      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <Stack gap={1}>
          <Typography fontSize={14} variant="body4">
            {t('explorer.curate.requester')}
          </Typography>
          <Address address={badge?.account.id} isUserAddress />
        </Stack>
        <Box alignItems="flex-end" display="flex">
          <Typography fontSize={14} sx={{ textDecoration: 'underline !important' }} variant="body4">
            <a
              href={badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t('explorer.curate.viewEvidence')}
            </a>
          </Typography>
        </Box>
      </Box>

      {/* Badge Evidence */}
      <Stack gap={2}>
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
        <Typography fontSize={14} variant="body3">
          {t('explorer.curate.listingCriteria')}
        </Typography>
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
    </Stack>
  )
}
