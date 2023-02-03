import React, { Children, ReactNode, useMemo } from 'react'

import { Box, styled } from '@mui/material'
import { Responsive, WidthProvider } from 'react-grid-layout'

import { DataGrid, DataGridMapping } from './type'
import { GridFormItem } from '@/src/components/form/customForms/GridFormItem'
import { mappingDataGridForComponents } from '@/src/components/form/customForms/dataGridToComponents'

const ResponsiveGridLayout = WidthProvider(Responsive)

export const GridFormContainer = styled(Box, {
  shouldForwardProp: (propName: string) => propName !== 'gridColumns',
})<{ gridColumns?: number }>(({ gridColumns = 3, theme }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
  gridAutoColumns: '1fr',
  gap: theme.spacing(2),
  gridAutoRows: 'minmax(7rem, auto)',
  placeContent: 'center center',
  margin: theme.spacing(2, 0),
  '& > *': {
    justifyContent: 'flex-end',
  },
}))

function ResponsiveGridFromContainer({
  children,
  gridStructure,
}: {
  children: ReactNode
  gridStructure?: DataGrid[]
}) {
  const childrenFromTypes = useMemo(() => getFormsFieldsTypes(children), [children])
  let prevXValue = -1
  return (
    <ResponsiveGridLayout
      breakpoints={{ xl: 1536, lg: 1200, md: 900, sm: 600, xs: 480, xxs: 0 }}
      className="layout"
      cols={{ xl: 8, lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
      compactType={null}
      isBounded={true}
      isDraggable={true}
      rowHeight={75}
    >
      {
        // children is a prop that passed to the component
        // second arg is a callback
        Children.map(Children.toArray(children), (child, index) => {
          let dataGridValue
          let xValue
          if (gridStructure) {
            dataGridValue = gridStructure[index]
            xValue = dataGridValue.x
          } else {
            // If a gridStructure was not provided, we get the formType of the child, and we attach the dataGrid prop to it
            dataGridValue = getDataGridFromMapping(
              childrenFromTypes[index],
              mappingDataGridForComponents,
            )
            // Trying to prevent collision in a naive way
            xValue = dataGridValue.x > prevXValue ? dataGridValue.x : prevXValue
            prevXValue = xValue + dataGridValue.w
          }

          return (
            <GridFormItem
              data-grid={{ ...dataGridValue, x: xValue }}
              key={`${dataGridValue.i}${(child as React.ReactElement).key}`}
            >
              {child}
            </GridFormItem>
          )
        })
      }
    </ResponsiveGridLayout>
  )
}

const availableFormFields = mappingDataGridForComponents.map((e) => e[1])

const isOneFormTypeOfAvailableFormFields = (c: React.ReactElement) =>
  availableFormFields.find((formField) => formField === getElemType(c))

function getFormsFieldsTypes(children: React.ReactNode): any[] {
  return Children.toArray(children).map((child) => {
    return isOneFormTypeOfAvailableFormFields(child as React.ReactElement)
      ? getElemType(child)
      : getChildrenType((child as React.ReactElement).props.children)
  })
}

function getChildrenType(node: React.ReactNode) {
  if (node === null) return 'null'
  // getFormsFieldsTypes from child it will always end on one
  if (Array.isArray(node)) return getFormsFieldsTypes(node)[0]
  if (typeof node === 'object') return getElemType(node)
  return 'string'
}

function getElemType(elem: any) {
  if (typeof elem === 'string') return 'string'
  if (elem === null) return 'null'
  return elem.type
}

function getDataGridFromMapping(compType: any, mapping: DataGridMapping[]) {
  for (const mappingElement of mapping) {
    if (compType === mappingElement[1]) return mappingElement[0]
  }
  return { i: 'Default', x: 0, y: 0, w: 2, h: 1 }
}

export default ResponsiveGridFromContainer
