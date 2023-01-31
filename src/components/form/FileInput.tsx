import React, { useState } from 'react'

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { Box, Button, Container, Typography, styled } from '@mui/material'
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
          <Container
            maxWidth="md"
            sx={{ display: 'flex', background: 'rgba(0,0,0,0.4)', width: '100%' }}
          >
            <ImageUploading
              acceptType={['pdf']}
              allowNonImageType={true}
              dataURLKey="data_url"
              maxNumber={maxNumber}
              onChange={onChange}
              value={files}
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
                      className="pdf-item"
                      key={index}
                      sx={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <Box alignItems="center" display="flex" flexDirection="row">
                        <PictureAsPdfIcon sx={{ mr: 1 }} />
                        <Typography>{image.file?.name}</Typography>
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-evenly"
                        marginLeft={2}
                      >
                        <Button
                          color="info"
                          onClick={() => onImageUpdate(index)}
                          variant="outlined"
                        >
                          Update
                        </Button>

                        <Button
                          color="error"
                          onClick={() => onImageRemove(index)}
                          variant="outlined"
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  {errors && (
                    <div>
                      {errors.maxNumber && <span>Number of selected files exceed maxNumber</span>}
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
