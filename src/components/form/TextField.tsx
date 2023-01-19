import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material'

export enum TextFieldStatus {
  error = 'error',
  success = 'success',
}

interface TextFieldCSSProps {
  status?: TextFieldStatus | undefined
}

type TextFieldProps = MUITextFieldProps & TextFieldCSSProps

export default function TextField(props: TextFieldProps) {
  return <MUITextField {...props} />
}
