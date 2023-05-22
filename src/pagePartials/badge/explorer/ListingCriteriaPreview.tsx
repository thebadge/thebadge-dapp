import React from 'react'

import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, IconButton } from '@mui/material'

import PDFViewer from '@/src/components/common/PDFViewer'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'

export function ListingCriteriaPreview({ badgeModelId }: { badgeModelId: string }) {
  const badgeModelKlerosData = useRegistrationBadgeModelKlerosMetadata(badgeModelId)
  const badgeModelKlerosMetadata = badgeModelKlerosData.data?.badgeModelKlerosRegistrationMetadata

  if (!badgeModelKlerosMetadata) {
    throw 'There was an error with the metadata. Try again in some minutes.'
  }

  const badgeCriteriaUrl =
    's3Url' in badgeModelKlerosMetadata.fileURI ? badgeModelKlerosMetadata?.fileURI.s3Url : ''

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
