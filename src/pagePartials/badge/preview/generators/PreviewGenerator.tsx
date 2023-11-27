import { useCallback, useEffect, useRef } from 'react'
import * as React from 'react'

import { Box } from '@mui/material'
import { UseFormSetValue } from 'react-hook-form'

import { convertPreviewToImage } from '@/src/pagePartials/badge/mint/utils'

type PreviewGeneratorProps = {
  setValue: UseFormSetValue<any>
  children?: React.ReactNode
}

export const PreviewGenerator = ({ children, setValue }: PreviewGeneratorProps) => {
  const badgePreviewRef = useRef<HTMLDivElement>()

  const generatePreviewImage = useCallback(
    async (badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>) => {
      const previewImage = await convertPreviewToImage(badgePreviewRef)
      setValue('previewImage', previewImage)
    },
    [setValue],
  )

  useEffect(() => {
    if (badgePreviewRef.current) {
      generatePreviewImage(badgePreviewRef)
    }
  }, [badgePreviewRef, generatePreviewImage])

  return <Box ref={badgePreviewRef}>{children}</Box>
}
