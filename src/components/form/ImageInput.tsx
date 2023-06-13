import React, { useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  AvatarProps,
  Box,
  Container,
  IconButton,
  Avatar as MUIAvatar,
  Stack,
  Tooltip,
  Typography,
  alpha,
  styled,
} from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { FieldError } from 'react-hook-form'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import UploadIllustration from '../assets/UploadIllustration'
import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { ImageSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'

const Wrapper = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'error',
})<{ error?: boolean }>(({ error, theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  marginTop: theme.spacing(2),
  width: '100%',
  gridColumn: 'span 1 / 4',
  borderBottom: `1px solid ${error ? theme.palette.error.main : colors.white}`,
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  top: 8,
  right: 8,
  p: '1px',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.48),
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[900], 0.72),
  },
}))

const ImageDisplayer = styled(MUIAvatar, {
  shouldForwardProp: (propName) => propName !== 'isDragging',
})<
  AvatarProps & {
    isDragging?: boolean
  }
>(({ isDragging, theme }) => ({
  width: 300,
  height: 250,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  borderWidth: 1,
  backgroundColor: colors.transparent,
  borderColor: isDragging ? colors.green : colors.white,
  borderStyle: 'dashed',
  '& .blockies-avatar': {
    height: '100% !important',
    width: '100% !important',
  },
}))
type ImageInputProps = {
  error?: FieldError
  label?: string
  onChange: (image: ImageType | null) => void
  placeholder?: string
  value: ImageType | undefined
}
export function ImageInput({ error, label, onChange, placeholder, value }: ImageInputProps) {
  const [images, setImages] = useState<ImageListType>(value ? [value] : [])
  const maxNumber = 1

  const handleChange = (imageList: ImageListType) => {
    // data for submit
    if (imageList[0]) {
      onChange(imageList[0])
    } else {
      onChange(null)
    }
    setImages(imageList)
  }

  return (
    <Wrapper error={!!error}>
      <FormField
        formControl={
          <Container maxWidth="md" sx={{ display: 'flex', mt: 2, width: '100%' }}>
            <ImageUploading
              dataURLKey="base64File"
              maxNumber={maxNumber}
              onChange={handleChange}
              value={images}
            >
              {({
                dragProps,
                errors,
                imageList,
                isDragging,
                onImageRemove,
                onImageUpdate,
                onImageUpload,
              }) => (
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{ flex: 1, flexWrap: 'wrap', alignContent: 'center' }}
                >
                  {imageList.length === 0 && (
                    <ImageDisplayer
                      isDragging={isDragging}
                      {...dragProps}
                      onClick={onImageUpload}
                      sx={{ cursor: 'pointer' }}
                    >
                      <Stack
                        sx={{
                          flex: 1,
                          flexWrap: 'wrap',
                          gap: 2,
                          alignContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <UploadIllustration sx={{ width: 150 }} />

                        <Typography
                          sx={{ color: 'text.secondary', textAlign: 'center' }}
                          variant="subtitle2"
                        >
                          Drop files here or click
                          <Typography
                            component="span"
                            sx={{
                              mx: 0.5,
                              color: 'primary.main',
                              textDecoration: 'underline',
                            }}
                            variant="subtitle2"
                          >
                            browse
                          </Typography>
                          thorough your machine
                        </Typography>
                      </Stack>
                    </ImageDisplayer>
                  )}
                  {imageList.map((image, index) => (
                    <Box
                      className="image-item"
                      key={index}
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <ImageDisplayer
                        isDragging={isDragging}
                        onClick={() => onImageUpdate(index)}
                        {...dragProps}
                      >
                        <img alt="" src={image['base64File']} width="250" />
                        <StyledIconButton onClick={() => onImageRemove(index)} size="small">
                          <CloseIcon width={16} />
                        </StyledIconButton>
                      </ImageDisplayer>
                    </Box>
                  ))}
                  {errors && (
                    <div>
                      {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
                      {errors.acceptType && <span>Your selected file type is not allow</span>}
                      {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
                      {errors.resolution && (
                        <span>Selected file is not match your desired resolution</span>
                      )}
                    </div>
                  )}
                </Box>
              )}
            </ImageUploading>
          </Container>
        }
        label={
          <Typography color="text.disabled">
            {label}
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Typography>
        }
        labelPosition="top-left"
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
    </Wrapper>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function ImageInputWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof ImageSchema>>()
  const { label, placeholder } = useDescription()

  return (
    <ImageInput
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={(value: ImageType | null) => {
        if (value) {
          // We change the structure a little bit to have it ready to push to the backend
          field.onChange({
            mimeType: value.file?.type,
            base64File: value.base64File,
          })
        } else field.onChange(null)
      }}
      placeholder={placeholder}
      value={field.value}
    />
  )
}
