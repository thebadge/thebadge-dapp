import { ReactNode, RefObject } from 'react'

import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import { OverridableStringUnion } from '@mui/types'
import { ReactComponentWithRequiredProps } from '@ts-react/form/src/createSchemaForm'

type BasicCustomFormProps = {
  children: ReactNode
  onSubmit: () => void
  layout?: FormLayoutType
  buttonLabel?: string
  buttonDisabled?: boolean
  buttonRef?: RefObject<any>
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
