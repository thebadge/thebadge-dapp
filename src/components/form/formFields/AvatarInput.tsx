import React, { useCallback, useEffect, useRef, useState } from 'react'

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { AvatarProps, Box, IconButton, Avatar as MUIAvatar, Stack, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import Blockies from 'react-18-blockies'
import { FieldError } from 'react-hook-form'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'

import { TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { Label } from '@/src/components/form/helpers/Label'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  rowGap: theme.spacing(1),
  gridColumn: 2,
  gridRow: '1 / 3',
}))

const Avatar = styled(MUIAvatar, { shouldForwardProp: (propName) => propName !== 'isDragging' })<
  AvatarProps & {
    isDragging?: boolean
  }
>(({ isDragging }) => ({
  width: 150,
  height: 150,
  borderWidth: isDragging ? 1 : 0,
  borderColor: isDragging ? colors.green : 'transparent',
  borderStyle: 'dashed',
  '& .blockies-avatar': {
    height: '100% !important',
    width: '100% !important',
  },
}))

const LabelContainer = styled(Box, { shouldForwardProp: (pN) => pN !== 'labelPosition' })<{
  labelPosition: 'bottom' | 'hover'
}>(({ labelPosition, theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(2),
  ...(labelPosition === 'hover' && {
    position: 'absolute',
    margin: 0,
    top: '55%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    flexDirection: 'column',
  }),
}))

type AvatarInputProps = {
  error?: FieldError
  label?: string
  onChange: (image: ImageType | null) => void
  placeholder?: string
  value: ImageType | undefined
  size?: number
  labelPosition?: 'bottom' | 'hover'
}

export function AvatarInput({
  error,
  label,
  labelPosition = 'bottom',
  onChange,
  size,
  value,
}: AvatarInputProps) {
  const { address } = useWeb3Connection()

  const [images, setImages] = useState<ImageListType>(value ? [value] : [])
  const [isCustom, setIsCustom] = useState(false)
  const maxNumber = 1
  const avatarRef = useRef<any>()

  const handleOnChange = useCallback(
    (imageList: ImageListType) => {
      // data for submit
      if (imageList[0]) {
        onChange(imageList[0])
      } else {
        onChange(null)
      }
      setImages(imageList)
      setIsCustom(true)
    },
    [onChange],
  )

  useEffect(() => {
    if (!value) {
      const image = convertCanvasToImageType()
      onChange(image)
      setImages(image ? [image] : [])
      setIsCustom(false)
    }
  }, [avatarRef, onChange, value])

  function convertCanvasToImageType(): ImageType | null {
    const canvas = document.getElementsByClassName('blockies-avatar')[0] as HTMLCanvasElement
    if (!canvas) return null
    const canvasData = new Blob([canvas.toDataURL()], { type: 'image/png' })
    return {
      base64File: canvas.toDataURL(),
      file: new File([canvasData], 'profile.png', { type: 'image/png' }),
    }
  }

  const blockiesAvatar = (
    <Blockies className="blockies-avatar" scale={10} seed={address || 'default'} size={10} />
  )

  return (
    <Wrapper>
      <FormField
        formControl={
          <Stack maxWidth="md" sx={{ display: 'flex', width: '100%' }}>
            <ImageUploading
              dataURLKey="base64File"
              maxNumber={maxNumber}
              onChange={handleOnChange}
              value={images}
            >
              {({ dragProps, errors, imageList, isDragging, onImageRemove, onImageUpdate }) => (
                // First time we need to render the blockie, to be able to create
                // the file from the canvas
                <Box display="flex" flexDirection="column" sx={{ flex: 1 }}>
                  {imageList.length === 0 && (
                    <Avatar
                      isDragging={isDragging}
                      ref={avatarRef}
                      {...dragProps}
                      sx={{
                        width: size,
                        height: size,
                      }}
                    >
                      {blockiesAvatar}
                    </Avatar>
                  )}
                  {imageList.map((image, index) => (
                    <Box
                      className="image-item"
                      key={index}
                      sx={{
                        display: 'flex',
                        position: 'relative',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        isDragging={isDragging}
                        onClick={() => onImageUpdate(index)}
                        ref={avatarRef}
                        {...dragProps}
                        sx={{
                          width: size,
                          height: size,
                        }}
                      >
                        <img alt="" src={image['base64File']} width={size || '150'} />
                      </Avatar>
                      <LabelContainer labelPosition={labelPosition}>
                        <Label>{label}</Label>
                        <IconButton
                          aria-label="upload avatar"
                          color="secondary"
                          component="label"
                          onClick={() => onImageUpdate(index)}
                        >
                          <FileUploadOutlinedIcon color="white" />
                        </IconButton>

                        {isCustom && (
                          <IconButton
                            aria-label="use default avatar"
                            color="error"
                            component="label"
                            onClick={() => onImageRemove(index)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        )}
                      </LabelContainer>
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
          </Stack>
        }
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.message}
      />
    </Wrapper>
  )
}
