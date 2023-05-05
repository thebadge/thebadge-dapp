import { Box, styled } from '@mui/material'

export const InfoPreviewContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  background:
    'linear-gradient(92.46deg, rgba(183, 74, 214, 0.111) 7.64%, rgba(242, 242, 242, 0.111) 96.18%)',
  boxShadow: '0px 0px 8px rgba(255, 255, 255, 0.3)',
  borderRadius: '16px 16px 0px 0px',
  padding: theme.spacing(4),
  gap: theme.spacing(5),
  marginBottom: theme.spacing(6),
}))
