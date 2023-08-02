import * as React from 'react'

import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import useS3Metadata from '@/src/hooks/useS3Metadata'
import { formatTimestamp } from '@/src/utils/dateUtils'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { EvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { Evidence } from '@/types/generated/subgraph'

type EvidenceItemProps = {
  item: Evidence
  isLast?: boolean
  isRegistrationEvidence?: boolean
}

export default function EvidenceItem({ isLast, isRegistrationEvidence, item }: EvidenceItemProps) {
  const { t } = useTranslation()

  const { sender, timestamp, uri } = item
  const res = useS3Metadata<{ content: EvidenceMetadata; s3Url: string }>(uri)
  const evidence = res.data?.content

  function handleClick() {
    if (isRegistrationEvidence) window.open(res.data?.s3Url, '_blank')
    else {
      window.open(evidence?.fileURI, '_blank')
    }
  }

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={'info'} />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent
        sx={{
          gap: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Paper elevation={4} sx={{ p: 1 }}>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <Typography variant="body1">
              {isRegistrationEvidence ? t('badge.viewBadge.evidence.submission') : evidence?.title}
            </Typography>
            {(isRegistrationEvidence || evidence?.fileURI) && (
              <IconButton onClick={handleClick}>
                <FilePresentOutlinedIcon sx={{ width: '18px', height: '18px' }} />
              </IconButton>
            )}
          </Box>
          <Typography
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              lineBreak: 'anywhere',
            }}
            variant="subtitle2"
          >
            {evidence?.description}
          </Typography>
        </Paper>
        <Box display="flex">
          <Typography variant="subtitle2">
            {t('badge.viewBadge.evidence.submission', {
              at: formatTimestamp(timestamp),
              submitter: truncateStringInTheMiddle(sender, 8, 6),
            })}
          </Typography>
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}
