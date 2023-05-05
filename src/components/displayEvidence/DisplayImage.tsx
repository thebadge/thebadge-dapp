import React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  AvatarProps,
  Box,
  Divider,
  Avatar as MUIAvatar,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { FormField } from '@/src/components/form/helpers/FormField'

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}))

const ImageDisplayer = styled(MUIAvatar)<AvatarProps>(({ theme }) => ({
  width: 200,
  height: 200,
  marginTop: theme.spacing(1),
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
    <Wrapper>
      <FormField
        formControl={
          <Box alignItems="flex-end" display="flex" justifyContent="space-between" width="100%">
            <ImageDisplayer src={value} />

            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Box>
        }
        label={<Typography>{label}</Typography>}
        labelPosition={'top-left'}
      />
      <Divider color={colors.white} sx={{ mt: -1 }} />
    </Wrapper>
  )
}
