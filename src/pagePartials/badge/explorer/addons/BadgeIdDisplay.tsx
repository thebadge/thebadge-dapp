import React from 'react'

import { Box, Typography, alpha, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  borderRadius: theme.spacing(0, 1, 1, 0),
  border: `0.5px solid ${colors.green}`,
  background: alpha(colors.green, 0.1),
  padding: theme.spacing(0.5, 1),
}))

export default function BadgeIdDisplay({ id }: { id?: string }) {
  const { t } = useTranslation()

  return (
    <Container>
      <Typography fontSize={14} sx={{ color: colors.green }} variant="body4">
        {`${t('explorer.curate.badgeId')}`}
        <strong>{id}</strong>
      </Typography>
    </Container>
  )
}
