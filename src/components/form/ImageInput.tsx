import React from 'react'

import { Box, Checkbox as MUICheckbox } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { z } from 'zod'

import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormField } from '@/src/components/form/helpers/FormField'
import { ImageSchema } from '@/src/components/form/helpers/customSchemas'

export function ImageInput() {
  const { error, field } = useTsController<z.infer<typeof ImageSchema>>()
  const { label } = useDescription()
  const [images, setImages] = React.useState<ImageListType | null>(null)
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
    <FormField
      formControl={
        <Box sx={{ display: 'flex', background: 'rgba(0,0,0,0.4)', width: '50vw' }}>
          <ImageUploading
            dataURLKey="data_url"
            maxNumber={maxNumber}
            onChange={onChange}
            value={images ?? []}
          >
            {({
              dragProps,
              errors,
              imageList,
              isDragging,
              onImageRemove,
              onImageRemoveAll,
              onImageUpdate,
              onImageUpload,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <button
                  onClick={onImageUpload}
                  style={isDragging ? { color: 'red' } : undefined}
                  {...dragProps}
                >
                  Click or Drop here
                </button>
                &nbsp;
                <button onClick={onImageRemoveAll}>Remove all images</button>
                {imageList.map((image, index) => (
                  <div className="image-item" key={index}>
                    <img alt="" src={image['data_url']} width="100" />
                    <div className="image-item__btn-wrapper">
                      <button onClick={() => onImageUpdate(index)}>Update</button>
                      <button onClick={() => onImageRemove(index)}>Remove</button>
                    </div>
                  </div>
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
              </div>
            )}
          </ImageUploading>
        </Box>
      }
      label={label}
      status={error ? TextFieldStatus.error : TextFieldStatus.success}
      statusText={error?.errorMessage}
    />
  )
}
