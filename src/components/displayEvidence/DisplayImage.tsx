import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { AvatarProps, Avatar as MUIAvatar, Tooltip, Typography, styled } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { FormField } from '@/src/components/form/helpers/FormField'

const ImageDisplayer = styled(MUIAvatar)<AvatarProps>(({ theme }) => ({
  width: 200,
  height: 200,
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(2),
  borderWidth: 1,
  backgroundColor: colors.transparent,
}))

type DisplayImageProps = {
  label?: string
  placeholder?: string
  value: string | undefined
}
export function DisplayImage({ label, placeholder, value }: DisplayImageProps) {
  return (
    <FormField
      formControl={<ImageDisplayer src={value} />}
      label={
        <Typography>
          {label}
          {placeholder && (
            <Tooltip title={placeholder}>
              <InfoOutlinedIcon sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>
      }
    />
  )
}
