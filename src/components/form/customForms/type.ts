import { ReactNode, RefObject } from 'react'

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
    })
  | (BasicCustomFormProps & {
      layout: 'gridResponsive'
      gridStructure: DataGrid[]
      draggable?: boolean
      rowHeight?: number
    })

export type FormLayoutType = 'flex' | 'grid' | 'gridResponsive'
export type DataGrid = { i: string; x: number; y: number; w: number; h: number; static?: boolean }

export type DataGridMapping = [DataGrid, ReactComponentWithRequiredProps<any>]
