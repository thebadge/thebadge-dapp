import { Box, alpha, styled } from '@mui/material'

export const MiniBadgePreviewContainer = styled(Box, {
  shouldForwardProp: (pN) => pN !== 'highlightColor',
})(({ highlightColor }: { highlightColor: string }) => ({
  position: 'relative',
  maxWidth: '250px',
  overflow: 'hidden',
  transition: 'all .5s cubic-bezier(0.83, 0, 0.17, 1)',
  '&:hover': {
    background: alpha(highlightColor, 0.35),
    margin: '4px',
    borderRadius: '8px',
  },
}))
