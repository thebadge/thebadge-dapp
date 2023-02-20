import React, { useState } from 'react'

import FileUploadIcon from '@mui/icons-material/FileUpload'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, IconButton, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { FileSchema } from '@/src/components/form/helpers/customSchemas'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '100%',
  gridColumn: 'span 1 / 4',
}))

const FileDrop = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'isDragging' && propName !== 'error',
})<{
  isDragging?: boolean
  error?: boolean
}>(({ error, isDragging, theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '50px',
  borderBottomWidth: 1,
  borderBottomColor: error ? theme.palette.error.main : isDragging ? colors.green : colors.grey,
  borderBottomStyle: 'solid',
  '&:hover': {
    borderBottomColor: colors.green,
  },
}))

/**
 * File Input use the same library that ImageInput does, but it has custom
 * config on accepted files
 * @constructor
 */
export default function FileInput() {
  const { error, field } = useTsController<z.infer<typeof FileSchema>>()
  const { label } = useDescription()
  const [files, setFiles] = useState<ImageListType>(field.value ? [field.value] : [])
  const maxNumber = 1

  const onChange = (fileList: ImageListType) => {
    // data for submit
    if (fileList[0]) {
      field.onChange(fileList[0])
    } else {
      field.onChange(null)
    }
    setFiles(fileList)
  }

  return (
    <Wrapper>
      <FormField
        formControl={
          <ImageUploading
            acceptType={['pdf']}
            allowNonImageType={true}
            dataURLKey="data_url"
            maxNumber={maxNumber}
            onChange={onChange}
            value={files}
          >
            {({ dragProps, errors, imageList, isDragging, onImageUpdate, onImageUpload }) => (
              // write your building UI
              <Box display="flex" flexDirection="column" sx={{ flex: 1 }}>
                {imageList.length === 0 && (
                  <FileDrop
                    error={!!error}
                    isDragging={isDragging}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    <Typography color="text.disabled">Click or Drop here</Typography>
                    <IconButton aria-label="upload file" color="secondary" component="label">
                      <FileUploadIcon color="white" />
                    </IconButton>
                  </FileDrop>
                )}
                {imageList.map((image, index) => (
                  <Box
                    className="pdf-item"
                    key={index}
                    sx={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <FileDrop onClick={onImageUpload} {...dragProps} error={!!error || !!errors}>
                      <PictureAsPdfIcon sx={{ mr: 1 }} />
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '330px',
                        }}
                      >
                        {image.file?.name}
                      </Typography>
                      <IconButton
                        aria-label="upload file"
                        color="secondary"
                        component="label"
                        onClick={() => onImageUpdate(index)}
                      >
                        <FileUploadIcon color="white" />
                      </IconButton>
                    </FileDrop>
                  </Box>
                ))}
                {errors && (
                  <div>
                    {errors.acceptType && <span>Your selected file type is not allow</span>}
                    {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
                  </div>
                )}
              </Box>
            )}
          </ImageUploading>
        }
        label={label}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.errorMessage}
      />
    </Wrapper>
  )
}
