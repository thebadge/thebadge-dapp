import React, { Children, ReactNode, useMemo } from 'react'

import { Box, styled, useTheme } from '@mui/material'
import { Responsive, WidthProvider } from 'react-grid-layout'

import { getDataGridFromMapping, getFormsFieldsTypes } from './GridFormContainer.utilts'
import { DataGrid } from './type'
import { GridFormItem } from '@/src/components/form/customForms/GridFormItem'
import { mappingDataGridForComponents } from '@/src/components/form/customForms/dataGridToComponents'

const ResponsiveGridLayout = WidthProvider(Responsive)

export const GridFormContainer = styled(Box, {
  shouldForwardProp: (propName: string) =>
    propName !== 'gridColumns' && propName !== 'gridStructure',
})<{ gridColumns?: number; gridStructure?: DataGrid[] }>(({ gridColumns = 3, theme }) => ({
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
  const theme = useTheme()
  const childrenFromTypes = useMemo(() => getFormsFieldsTypes(children), [children])
  let prevXValue = -1
  return (
    <ResponsiveGridLayout
      breakpoints={{
        xl: theme.breakpoints.values.xl,
        lg: theme.breakpoints.values.lg,
        md: theme.breakpoints.values.md,
        sm: theme.breakpoints.values.sm,
      }}
      className="layout"
      cols={{ xl: 8, lg: 8, md: 8, sm: 6 }}
      compactType={null}
      isBounded={true}
      isDraggable={true}
      rowHeight={75}
    >
      {
        // children is a prop that passed to the component, second arg is a callback
        // Children.toArray prevent the need to iterate over undefined values or
        // nested array of children
        Children.map(Children.toArray(children), (child, index) => {
          let dataGridValue
          let xValue
          if (gridStructure && gridStructure.length > 0) {
            dataGridValue = gridStructure[index]
            xValue = dataGridValue.x
          } else {
            // If a gridStructure was not provided, we get the formType of the
            // child, and we attach the dataGrid prop to it
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

export default ResponsiveGridFromContainer
