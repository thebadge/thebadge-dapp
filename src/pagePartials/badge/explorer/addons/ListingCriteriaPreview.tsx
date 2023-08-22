import React from 'react'

import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, IconButton } from '@mui/material'

import PDFViewer from '@/src/components/common/PDFViewer'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeType'

export function ListingCriteriaPreview({ badgeTypeId }: { badgeTypeId: string }) {
  const badgeTypeData = useBadgeModel(badgeTypeId)
  const badgeTypeMetadata = badgeTypeData.data?.badgeTypeMetadata

  if (!badgeTypeMetadata) {
    throw 'There was an error with the metadata. Try again in some minutes.'
  }

  const badgeCriteriaUrl =
    's3Url' in badgeTypeMetadata.fileURI ? badgeTypeMetadata?.fileURI.s3Url : ''

  return (
    <>
      <Box sx={{ position: 'absolute', right: 0, top: -8 }}>
        <IconButton onClick={() => window.open(`${badgeCriteriaUrl}`, '_ blank')}>
          <OpenInNewOutlinedIcon />
        </IconButton>
      </Box>
      <PDFViewer url={badgeCriteriaUrl} />
    </>
  )
}
