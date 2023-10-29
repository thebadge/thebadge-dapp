import React from 'react'

import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined'
import { Box, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
export default function ViewEvidenceButton({ evidenceUrl }: { evidenceUrl?: string }) {
  const { t } = useTranslation()

  return (
    <Box alignItems="flex-end" display="flex" mb="3px">
      <Typography fontSize={14} sx={{ '&:hover': { textDecoration: 'underline' } }} variant="body4">
        <a href={evidenceUrl} rel="noreferrer" target="_blank">
          {t('explorer.curate.viewEvidence')}
        </a>
      </Typography>
      <FilePresentOutlinedIcon sx={{ width: '18px', height: '18px' }} />
    </Box>
  )
}
