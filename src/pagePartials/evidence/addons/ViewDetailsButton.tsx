'use client'
import React from 'react'

import { Button, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

const Container = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: `1px solid ${colors.greyBackground}`,
  margin: theme.spacing(2),
}))

export default function ViewDetailsButton({
  linkToSubmissionView,
}: {
  linkToSubmissionView: string
}) {
  return (
    <Container>
      <Typography sx={{ fontSize: '14px !important' }}>
        {'You can see more information about this dispute on TheBadge App'}
      </Typography>
      <Button
        color="blue"
        href={linkToSubmissionView}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          width: 'fit-content',
          fontSize: '16px !important',
        }}
        target="_blank"
        variant="text"
      >
        {'View details on TheBadge App'}
      </Button>
    </Container>
  )
}
