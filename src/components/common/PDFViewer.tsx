import { RefObject, useEffect, useRef, useState } from 'react'

import { Box, styled } from '@mui/material'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { Document, Page, pdfjs } from 'react-pdf'

import workerSrc from '@/pdf-worker'
import { Loading } from '@/src/components/loading/Loading'

// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const PDF_VIEW_HEIGHT = '350px'
const StyledPageContainer = styled(Box)(() => ({
  maxHeight: PDF_VIEW_HEIGHT,
  overflowY: 'auto',
  overflowX: 'clip',
}))

export default function PDFViewer({ url }: { url?: string }) {
  const [numPages, setNumPages] = useState<number>(0)

  useEffect(() => {
    console.log('Has Change', url)
    setNumPages(0)
  }, [url])

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
    setNumPages(numPages)
  }

  const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

  const containerWidth = containerRef.current?.getBoundingClientRect().width || 450

  // Render method for the initial loading state of the PDF
  const renderOnLoading = () => {
    return (
      <Box
        alignItems={'center'}
        display={'flex'}
        flex={1}
        height={PDF_VIEW_HEIGHT}
        justifyContent={'center'}
      >
        <Loading color={'green'} />
      </Box>
    )
  }

  if (!url) return null
  return (
    <Box
      ref={containerRef}
      sx={{
        '& .react-pdf__Page__canvas': {
          margin: 'auto',
          // we need to enforce the dimensions to ensure a proper display
          width: `calc(100% - ${16}px) !important`,
          height: `calc(100% - ${16}px) !important`,
        },
      }}
    >
      <Document file={{ url }} loading={renderOnLoading} onLoadSuccess={onDocumentLoadSuccess}>
        <StyledPageContainer>
          {Array.from({ length: numPages }).map((el, index) => {
            return (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={containerWidth}
              />
            )
          })}
        </StyledPageContainer>
      </Document>
    </Box>
  )
}
