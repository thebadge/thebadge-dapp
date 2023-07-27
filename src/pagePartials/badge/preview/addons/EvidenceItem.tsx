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

import { Address } from '@/src/components/helpers/Address'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { formatTimestamp } from '@/src/utils/dateUtils'
import { EvidenceMetadata } from '@/types/badges/BadgeMetadata'
import { Evidence } from '@/types/generated/subgraph'

type EvidenceItemProps = {
  item: Evidence
  isLast: boolean
}

export default function EvidenceItem({ isLast, item }: EvidenceItemProps) {
  const { id, sender, timestamp, uri } = item
  const res = useS3Metadata<{ content: EvidenceMetadata }>(uri)
  const evidence = res.data?.content

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
            <Typography variant="body1">{evidence?.title} </Typography>
            <IconButton>
              <FilePresentOutlinedIcon sx={{ width: '18px', height: '18px' }} />
            </IconButton>
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
            {evidence?.description}
          </Typography>
        </Paper>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle2">
            {`Submitted ` + formatTimestamp(timestamp) + ` by `} <Address address={sender} />
          </Typography>
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}
