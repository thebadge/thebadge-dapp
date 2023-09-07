import { Box, TextField, Typography, alpha, styled } from '@mui/material'

export const CustomOptionPaper = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'color' && propName !== 'selected',
})<{
  color: string
  selected: boolean
}>(({ color, selected, theme }) => ({
  margin: theme.spacing(1),
  width: 165,
  height: 180,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-evenly',
  transition: 'all .3s cubic-bezier(0.65, 0, 0.35, 1)',
  borderWidth: '1px',
  borderStyle: 'solid',
  opacity: 0.5,
  borderRadius: theme.spacing(1),
  borderColor: alpha(color, 0.8),
  background: alpha(color, 0.2),
  '&:hover': {
    boxShadow: '0px 0px 8px 0px rgba(255, 255, 255, 0.50)',
    borderColor: color,
    opacity: 0.75,
  },
  ...(selected
    ? {
        // Important is used to override the lower opacity on hover effect
        opacity: '1 !important',
        boxShadow: '0px 0px 8px 0px rgba(255, 255, 255, 0.70)',
      }
    : {}),
}))

export const VerySmallTextField = styled(TextField, {
  shouldForwardProp: (propName) => propName !== 'fontColor',
})<{ fontColor: string }>(({ fontColor }) => ({
  width: '95%',
  marginLeft: 'auto',
  '& :before': {
    borderBottom: 'none !important',
  },
  '& .MuiInputBase-root': {
    fontSize: '12px !important',
  },
  '& .MuiInputBase-input': {
    color: fontColor,
    fontSize: '18px !important',
    fontWeight: 900,
    textAlign: 'center',
  },
  '& .MuiFormLabel-root': {
    fontSize: '12px !important',
  },
}))

export const ValueContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: '1',
}))

export const Value = styled(Typography)(() => ({
  fontSize: '18px !important',
  fontWeight: 900,
}))

export const Title = styled(Typography)(() => ({
  fontSize: '14px !important',
  textAlign: 'left',
}))

export const DisplayLabel = styled(Typography)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  minWidth: '25%',
  gap: theme.spacing(1),
  fontSize: '14px !important',
}))
