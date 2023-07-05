import * as React from 'react'

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Box, Button, Divider, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { Address } from '@/src/components/helpers/Address'
import ExternalLink from '@/src/components/helpers/ExternalLink'
import { KLEROS_COURT_URL } from '@/src/constants/common'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { Evidence, KlerosBadgeRequest } from '@/types/generated/subgraph'

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
          <Typography color={'#FF4949'} variant="dAppTitle5">
            {t('badge.viewBadge.challengeStatus.challenged')}
          </Typography>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.requestType')}
            </Typography>
            <Typography variant="dAppBody4">{activeRequest.type}</Typography>
          </DisplayWrapper>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.challenger')}
            </Typography>
            <Address address={activeRequest.challenger} />
          </DisplayWrapper>
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.requester')}
            </Typography>
            <Address address={activeRequest.requester} />
          </DisplayWrapper>
          {/*
          TODO: Add arbitrator to the SG
            activeRequest.arbitrator && (
            <DisplayWrapper>
              <Typography variant="dAppBody4">
                {t('badge.viewBadge.challengeStatus.arbitrator')}
              </Typography>
              <Address address={activeRequest.arbitrator} />
            </DisplayWrapper>
          )*/}
          <DisplayWrapper>
            <Typography variant="dAppBody4">
              {t('badge.viewBadge.challengeStatus.disputeId')}
            </Typography>
            <ExternalLink
              href={`${KLEROS_COURT_URL}/cases/${activeRequest.disputeId}`}
              label={activeRequest.disputeId}
            />
          </DisplayWrapper>
          <Divider color={colors.white} />
        </Stack>
        <Stack flex="1" gap={3}>
          <Typography color={'#FF4949'} variant="dAppTitle5">
            {t('badge.viewBadge.challengeStatus.badgeDetails')}
          </Typography>
          <Typography variant="dAppBody4">{t('badge.viewBadge.challengeStatus.user')}</Typography>
          <Typography variant="dAppBody4">{t('badge.viewBadge.challengeStatus.amount')}</Typography>
          <Typography variant="dAppBody4">
            {t('badge.viewBadge.challengeStatus.userAddress')}
          </Typography>
          <Typography variant="dAppBody4">{t('badge.viewBadge.challengeStatus.file')}</Typography>
          <Divider color={colors.white} sx={{ mt: 'auto' }} />
        </Stack>
      </Box>

      <Box
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {[...activeRequest.evidences, ...activeRequest.evidences, ...activeRequest.evidences].map(
            (item, index) => (
              /* TODO: Add all the evidence to the SG */
              <EvidenceItem
                isLast={index === activeRequest.evidences.length * 3 - 1}
                item={item}
                key={item.id + index}
              />
            ),
          )}
        </Timeline>
      </Box>
    </Stack>
  )
}

type EvidenceItemProps = {
  item: Evidence
  isLast: boolean
}
function EvidenceItem({ isLast, item }: EvidenceItemProps) {
  const { id, sender, uri } = item
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={'info'} />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{id}</Typography>
        <Address address={sender} />
        <Typography sx={{ color: 'text.secondary' }} variant="caption">
          {uri}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  )
}
