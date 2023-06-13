import React from 'react'

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { Button, Typography } from '@mui/material'
import { FieldError } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { FileInput } from '@/src/components/form/FileInput'

export default function PDFRequirementInput({
  error,
  onChange,
  value,
}: {
  value: ImageType | undefined
  onChange: (image: ImageType | null) => void
  error?: FieldError
}) {
  return (
    <FileInput
      downloadableTemplate={
        <Button
          sx={{ borderRadius: 2, gap: 1, color: '#FFF', mr: 'auto', width: 'fit-content' }}
          variant="outlined"
        >
          <Typography variant="dAppBody4">Download Template</Typography>
          <FileDownloadOutlinedIcon sx={{ width: '0.75em', height: '0.75em' }} />
        </Button>
      }
      error={error}
      label={'PDF with the requirements to mint a badge'}
      onChange={(value: ImageType | null) => {
        if (value) {
          // We change the structure a little bit to have it ready to push to the backend
          onChange({
            mimeType: value.file?.type,
            base64File: value.base64File,
          })
        } else onChange(null)
      }}
      value={value}
    />
  )
}
