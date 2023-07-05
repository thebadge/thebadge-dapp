import React, { useCallback, useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, IconButton, Tooltip, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { colors } from '@thebadge/ui-library'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { FileSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

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

type FileInputProps = {
  error?: FieldError
  label?: string
  onChange: (image: ImageType | null) => void
  placeholder?: string
  value: ImageType | undefined
}

/**
 * File Input use the same library that ImageInput does, but it has custom
 * config on accepted files
 * @constructor
 */
export function FileInput({ error, label, onChange, placeholder, value }: FileInputProps) {
  const [files, setFiles] = useState<ImageListType>(value ? [value] : [])
  const maxNumber = 1

  const handleOnChange = useCallback(
    (imageList: ImageListType) => {
      // data for submit
      if (imageList[0]) {
        onChange(imageList[0])
      } else {
        onChange(null)
      }
      setFiles(imageList)
    },
    [onChange],
  )

  return (
    <Wrapper>
      <FormField
        formControl={
          <ImageUploading
            acceptType={['pdf']}
            allowNonImageType={true}
            dataURLKey="data_url"
            maxNumber={maxNumber}
            onChange={handleOnChange}
            value={files}
          >
            {({
              dragProps,
              errors,
              imageList,
              isDragging,
              onImageRemoveAll,
              onImageUpdate,
              onImageUpload,
            }) => (
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
                    <FileDrop {...dragProps} error={!!error || !!errors}>
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
                      <IconButton
                        aria-label="upload file"
                        color="secondary"
                        component="label"
                        onClick={() => onImageRemoveAll()}
                      >
                        <DeleteForeverIcon color="white" />
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
        label={
          <Typography sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
            {label}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        }
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
    </Wrapper>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 */
export default function FileInputWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof FileSchema>>()
  const { label, placeholder } = useDescription()

  return (
    <FileInput
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={(value: ImageType | null) => {
        if (value) {
          // We change the structure a little bit to have it ready to push to the backend
          field.onChange({
            mimeType: value.file?.type,
            base64File: value.data_url,
          })
        } else field.onChange(null)
      }}
      placeholder={placeholder}
      value={field.value ? { dataURL: field.value.base64File, file: undefined } : undefined}
    />
  )
}
