import React, { useState } from 'react'

import { Box, Button, Container, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { colors } from 'thebadge-ui-library'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { ImageSchema } from '@/src/components/form/helpers/customSchemas'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '100%',
  gridColumn: 'span 1 / 4',
}))

export default function ImageInput() {
  const { error, field } = useTsController<z.infer<typeof ImageSchema>>()
  const { label } = useDescription()
  const [images, setImages] = useState<ImageListType>(field.value ? [field.value] : [])
  const maxNumber = 1

  const onChange = (imageList: ImageListType) => {
    // data for submit
    if (imageList[0]) {
      field.onChange(imageList[0])
    } else {
      field.onChange(null)
    }
    setImages(imageList)
  }

  return (
    <Wrapper>
      <FormField
        formControl={
          <Container
            maxWidth="md"
            sx={{ display: 'flex', background: 'rgba(0,0,0,0.4)', width: '100%' }}
          >
            <ImageUploading
              dataURLKey="data_url"
              maxNumber={maxNumber}
              onChange={onChange}
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
                // write your building UI
                <Box display="flex" flexDirection="column" sx={{ flex: 1 }}>
                  {imageList.length === 0 && (
                    <Button
                      onClick={onImageUpload}
                      sx={{
                        height: '50px',
                        borderWidth: 1,
                        borderColor: isDragging ? colors.green : colors.grey,
                        borderStyle: 'dashed',
                      }}
                      variant="text"
                      {...dragProps}
                    >
                      Click or Drop here
                    </Button>
                  )}
                  {imageList.map((image, index) => (
                    <Box
                      className="image-item"
                      key={index}
                      sx={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <img alt="" src={image['data_url']} width="200" />
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-evenly"
                        marginLeft={2}
                      >
                        <button onClick={() => onImageUpdate(index)}>Update</button>

                        <button onClick={() => onImageRemove(index)}>Remove</button>
                      </Box>
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
        label={label}
        status={error ? TextFieldStatus.error : TextFieldStatus.success}
        statusText={error?.errorMessage}
      />
    </Wrapper>
  )
}
