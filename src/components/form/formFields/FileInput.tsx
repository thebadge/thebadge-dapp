import React, { useCallback, useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, IconButton, Stack, Tooltip, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { FieldError } from 'react-hook-form'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'

import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'

const Wrapper = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'error',
})<{ error?: boolean }>(({ error, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '100%',
  gridColumn: 'span 1 / 4',
  borderBottom: `1px solid ${error ? theme.palette.error.main : colors.white}`,
}))

const FileDrop = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'isDragging' && propName !== 'error',
})<{
  isDragging?: boolean
  error?: boolean
}>(() => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '50px',
}))

type FileInputProps = {
  error?: FieldError
  label?: string
  onChange: (image: ImageType | null) => void
  placeholder?: string
  value: ImageType | undefined
  downloadableTemplate?: React.ReactNode
}

/**
 * File Input use the same library that ImageInput does, but it has custom
 * config on accepted files
 * @constructor
 */
export function FileInput({
  downloadableTemplate,
  error,
  label,
  onChange,
  placeholder,
  value,
}: FileInputProps) {
  const { t } = useTranslation()
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
    <Wrapper error={!!error}>
      <FormField
        formControl={
          <Stack sx={{ width: '100%', gap: 1, p: 0 }}>
            {/* Custom element where we can define a template example for the expected file */}
            {downloadableTemplate ? downloadableTemplate : null}
            <ImageUploading
              acceptType={['pdf']}
              allowNonImageType={true}
              dataURLKey="base64File"
              maxNumber={maxNumber}
              onChange={handleOnChange}
              value={files}
            >
              {({ dragProps, errors, imageList, isDragging, onImageRemoveAll, onImageUpload }) => (
                <Stack flex="1">
                  {imageList.length === 0 && (
                    <FileDrop
                      error={!!error}
                      isDragging={isDragging}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <Typography color="text.disabled">Upload file</Typography>
                      <IconButton aria-label="upload file" color="secondary" component="label">
                        <FileUploadOutlinedIcon color="white" />
                      </IconButton>
                    </FileDrop>
                  )}
                  {imageList.map((image, index) => (
                    <FileDrop key={index} {...dragProps} error={!!error || !!errors}>
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '330px',
                        }}
                      >
                        <PictureAsPdfIcon sx={{ mr: 1 }} />
                        {image.file?.name}
                      </Typography>
                      <IconButton
                        aria-label="upload file"
                        color="secondary"
                        component="label"
                        onClick={() => onImageRemoveAll()}
                      >
                        <DeleteForeverIcon color="white" />
                      </IconButton>
                    </FileDrop>
                  ))}
                  {errors && (
                    <div>
                      {errors.acceptType && <span>{t('errors.fileType')}</span>}
                      {errors.maxFileSize && <span>{t('errors.fileMaxSize')}</span>}
                    </div>
                  )}
                </Stack>
              )}
            </ImageUploading>
          </Stack>
        }
        label={
          <Typography sx={{ textTransform: 'capitalize', color: 'text.disabled' }}>
            {label}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        }
        labelPosition={'top-left'}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
    </Wrapper>
  )
}
