import * as React from 'react'

import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab'
import { Typography } from '@mui/material'

import { Address } from '@/src/components/helpers/Address'
import { Evidence } from '@/types/generated/subgraph'

type EvidenceItemProps = {
  item: Evidence
  isLast: boolean
}

export default function EvidenceItem({ isLast, item }: EvidenceItemProps) {
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
