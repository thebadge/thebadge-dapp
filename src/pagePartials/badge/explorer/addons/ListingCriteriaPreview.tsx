import React from 'react'

import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { Box, IconButton } from '@mui/material'

import PDFViewer from '@/src/components/common/PDFViewer'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'

export function ListingCriteriaPreview({ badgeModelId }: { badgeModelId: string }) {
  const badgeModelKlerosData = useRegistrationBadgeModelKlerosMetadata(badgeModelId)
  const badgeModelKlerosMetadata = badgeModelKlerosData.data?.badgeModelKlerosRegistrationMetadata
  const badgeCriteriaUrl = badgeModelKlerosData.data?.badgeRegistrationCriteria
  if (!badgeModelKlerosMetadata) {
    throw 'There was an error with the metadata. Try again in some minutes.'
  }

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
