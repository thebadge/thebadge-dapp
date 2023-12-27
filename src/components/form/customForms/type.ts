import { ReactNode, RefObject } from 'react'

import { Theme } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { SxProps } from '@mui/system'
import { OverridableStringUnion } from '@mui/types'
import { ReactComponentWithRequiredProps } from '@ts-react/form/src/createSchemaForm'

type CustomFormButtonType = {
  label?: string
  disabled?: boolean
  ref?: RefObject<any>
}

type BasicCustomFormProps = {
  children: ReactNode
  onSubmit: VoidFunction
  onBack?: VoidFunction
  layout?: FormLayoutType
  submitButton: CustomFormButtonType
  backButton?: CustomFormButtonType
  containerSx?: SxProps<Theme>
  buttonsSx?: SxProps<Theme>
  displayFormInputs?: boolean
  alternativeChildren?: ReactNode
}

export type CustomFormProps =
  | (BasicCustomFormProps & {
      layout?: 'flex' | 'grid'
      gridStructure?: never
      draggable?: never
      rowHeight?: never
      color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides
      >
    })
  | (BasicCustomFormProps & {
      layout: 'gridResponsive'
      gridStructure: DataGrid[]
      draggable?: boolean
      rowHeight?: number
      color?: OverridableStringUnion<
        'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
        ButtonPropsColorOverrides
      >
    })

export type FormLayoutType = 'flex' | 'grid' | 'gridResponsive'
export type DataGrid = { i: string; x: number; y: number; w: number; h: number; static?: boolean }

export type DataGridMapping = [DataGrid, ReactComponentWithRequiredProps<any>]
