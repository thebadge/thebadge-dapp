import * as React from 'react'

import { Stack, Tooltip, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

const HintContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flex: '1',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  alignItems: 'flex-start',
  textAlign: 'left',
  margin: 'auto',
  cursor: 'help',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5, 0, 0.5, 0),
  },
}))

export function TSFormFieldHint({ description, label }: { label?: string; description?: string }) {
  const { t } = useTranslation()
  return (
    <Tooltip arrow placement="right" title={t('badge.model.mint.formHelpText')}>
      <HintContainer>
        <Typography fontWeight="700" variant="subtitle1">
          {label}
        </Typography>
        <Typography sx={{ wordBreak: 'break-word' }} variant="body4">
          {description}
        </Typography>
      </HintContainer>
    </Tooltip>
  )
}
