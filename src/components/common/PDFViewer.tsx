import { RefObject, useRef } from 'react'

import { Box, styled } from '@mui/material'

const PDF_VIEW_HEIGHT = '350px'
const StyledPDFContainer = styled(Box)(() => ({
  maxHeight: PDF_VIEW_HEIGHT,
  overflowY: 'auto',
  overflowX: 'clip',
}))

export default function PDFViewer({ url }: { url?: string }) {
  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

  if (!url) return null
  return (
    <StyledPDFContainer
      ref={containerRef}
      sx={{
        // we need to enforce the dimensions to ensure a proper display
        width: `calc(100% - ${16}px) !important`,
        //minHeight: '250px',
        '& object': {
          margin: 'auto',
        },
      }}
    >
      <object data={url} height="100%" type="application/pdf" width="100%">
        <p>Alternative text</p>
      </object>
    </StyledPDFContainer>
  )
}
