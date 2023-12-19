import React from 'react'

import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import { Box, Typography } from '@mui/material'

export default function EmptyListMessage({ error }: { error: boolean }) {
  return (
    <Box
      display="flex"
      gap={2}
      mt={2}
      sx={{ border: `1px solid ${error ? 'red' : 'grey'}`, borderRadius: 1, p: 2 }}
    >
      <TipsAndUpdatesOutlinedIcon color={error ? 'error' : 'info'} />
      <Typography color={error ? 'text.primary' : 'text.disabled'} variant="titleSmall">
        In order to request the needed information to the user, you need to provide some fields, so
        please add at least one.
      </Typography>
    </Box>
  )
}
