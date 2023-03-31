import { Box, alpha, styled } from '@mui/material'

export const MiniBadgePreviewContainer = styled(Box, {
  shouldForwardProp: (pN) => pN !== 'highlightColor',
})(({ highlightColor }: { highlightColor: string }) => ({
  position: 'relative',
  maxWidth: '250px',
  overflow: 'hidden',
  transition: 'all 2s',
  '&:hover': {
    background: alpha(highlightColor, 0.85),
    margin: '8px',
    borderRadius: '8px',
  },
}))
