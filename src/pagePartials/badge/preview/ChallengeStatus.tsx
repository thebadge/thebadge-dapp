import * as React from 'react'

import { Box, Button, Divider, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { Address } from '@/src/components/helpers/Address'
import ExternalLink from '@/src/components/helpers/ExternalLink'
import { KLEROS_COURT_URL } from '@/src/constants/common'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import EvidencesList from '@/src/pagePartials/badge/preview/addons/EvidencesList'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { KlerosBadgeRequest, KlerosRequestType } from '@/types/generated/subgraph'

const DisplayWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
}))

export default function ChallengeStatus() {
  const { t } = useTranslation()
  const { challenge } = useCurateProvider()

  const badgeId = useBadgeIdParam()
  if (!badgeId) {
    throw `No badgeId provided us URL query param`
  }

  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId)

  const activeRequest = badgeKlerosMetadata.data?.requests[
    badgeKlerosMetadata.data?.requests.length - 1
  ] as KlerosBadgeRequest
  const isRegistration = activeRequest.type === KlerosRequestType.Registration

  return (
    <Stack gap={3} mt={5}>
      <Divider color={colors.white} />
      <Box display="flex" justifyContent="space-between">
        <Typography color={'#FF4949'} variant="dAppTitle1">
          {t('badge.viewBadge.challengeStatus.title')}
        </Typography>
        <Button
          color="error"
          onClick={() => challenge(badgeId)}
          size="medium"
          sx={{ fontSize: '11px !important', borderRadius: 2 }}
          variant="outlined"
        >
          Add Evidence
        </Button>
      </Box>
      <Box display="flex" gap={4} justifyContent="space-between">
        <Stack flex="1" gap={3}>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.requestType')}
            </Typography>
            <Typography variant="dAppBody4">
              {isRegistration
                ? 'Badge submission has been challenged'
                : 'A removal request has been rise'}
            </Typography>
          </DisplayWrapper>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.disputeId')}
            </Typography>
            <ExternalLink
              href={`${KLEROS_COURT_URL}/cases/${activeRequest.disputeID}`}
              label={activeRequest.disputeID}
            />
          </DisplayWrapper>
        </Stack>
        <Stack flex="1" gap={3}>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.requester')}
            </Typography>
            <Address address={activeRequest.requester} />
          </DisplayWrapper>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.challenger')}
            </Typography>
            <Address address={activeRequest.challenger} />
          </DisplayWrapper>
        </Stack>
      </Box>
      <Divider color={colors.white} />
      <EvidencesList badgeId={badgeId} />
    </Stack>
  )
}
