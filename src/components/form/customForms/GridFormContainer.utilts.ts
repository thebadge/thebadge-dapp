import React, { Children } from 'react'

import { mappingDataGridForComponents } from '@/src/components/form/customForms/dataGridToComponents'
import { DataGridMapping } from '@/src/components/form/customForms/type'

const availableFormFields = mappingDataGridForComponents.map((e) => e[1])

const isOneFormTypeOfAvailableFormFields = (c: React.ReactElement) =>
  availableFormFields.find((formField) => formField === getElemType(c))

export function getDataGridFromMapping(compType: any, mapping: DataGridMapping[]) {
  for (const mappingElement of mapping) {
    if (compType === mappingElement[1]) return mappingElement[0]
  }
  return { i: 'Default', x: 0, y: 0, w: 2, h: 1 }
}

export function getFormsFieldsTypes(children: React.ReactNode): any[] {
  return Children.toArray(children).map((child) => {
    return isOneFormTypeOfAvailableFormFields(child as React.ReactElement)
      ? getElemType(child)
      : getChildrenType((child as React.ReactElement).props.children)
  })
}

function getChildrenType(node: React.ReactNode) {
  if (node === null) return 'null'
  // getFormsFieldsTypes from child it will always end on one because of the
  // structure that @/ts-from generated children has. With that said, this
  // function MUST NOT be used in another context
  if (Array.isArray(node)) return getFormsFieldsTypes(node)[0]
  if (typeof node === 'object') return getElemType(node)
  return 'string'
}

function getElemType(elem: any) {
  if (typeof elem === 'string') return 'string'
  if (elem === null) return 'null'
  return elem.type
}
