import { Typography } from '@mui/material'

import { DisplayAddress } from '@/src/components/displayEvidence/DisplayAddress'
import { DisplayBoolean } from '@/src/components/displayEvidence/DisplayBoolean'
import { DisplayFile } from '@/src/components/displayEvidence/DisplayFile'
import { DisplayImage } from '@/src/components/displayEvidence/DisplayImage'
import { DisplayLink } from '@/src/components/displayEvidence/DisplayLink'
import { DisplayLongText } from '@/src/components/displayEvidence/DisplayLongText'
import { DisplayText } from '@/src/components/displayEvidence/DisplayText'
import { KLEROS_LIST_TYPES, MetadataColumn } from '@/types/kleros/types'

export default function DisplayEvidenceField({
  columnItem,
  value,
}: {
  columnItem: MetadataColumn
  value: any
}) {
  switch (columnItem.type) {
    case KLEROS_LIST_TYPES.GTCR_ADDRESS:
    case KLEROS_LIST_TYPES.ADDRESS:
    case KLEROS_LIST_TYPES.RICH_ADDRESS:
      return (
        <DisplayAddress
          label={columnItem.label}
          placeholder={columnItem.description}
          value={value as `0x${string}`}
        />
      )
    case KLEROS_LIST_TYPES.TEXT:
    case KLEROS_LIST_TYPES.NUMBER:
    case KLEROS_LIST_TYPES.TWITTER_USER_ID:
      return (
        <DisplayText label={columnItem.label} placeholder={columnItem.description} value={value} />
      )
    case KLEROS_LIST_TYPES.BOOLEAN:
      return (
        <DisplayBoolean
          label={columnItem.label}
          placeholder={columnItem.description}
          value={value}
        />
      )
    case KLEROS_LIST_TYPES.LONG_TEXT:
      return (
        <DisplayLongText
          label={columnItem.label}
          placeholder={columnItem.description}
          value={value}
        />
      )
    case KLEROS_LIST_TYPES.FILE: {
      return (
        <DisplayFile label={columnItem.label} placeholder={columnItem.description} value={value} />
      )
    }
    case KLEROS_LIST_TYPES.IMAGE:
      return (
        <DisplayImage label={columnItem.label} placeholder={columnItem.description} value={value} />
      )
    case KLEROS_LIST_TYPES.LINK:
      return (
        <DisplayLink label={columnItem.label} placeholder={columnItem.description} value={value} />
      )
    default:
      return (
        <Typography variant="subtitle2">
          Error: Unhandled Type {columnItem.type} for data {value}
        </Typography>
      )
  }
}
