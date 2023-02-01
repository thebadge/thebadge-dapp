import { ReactNode, RefObject } from 'react'

export type CustomFormProps = {
  children: ReactNode
  onSubmit: () => void
  useGridLayout?: boolean
  gridColumns?: number
  buttonLabel?: string
  buttonDisabled?: boolean
  buttonRef?: RefObject<any>
}
