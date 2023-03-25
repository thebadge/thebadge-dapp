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
    propName !== 'gridColumns' && propName !== 'gridStructure' && propName !== 'rowHeight',
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
  draggable = false,
  gridStructure,
  rowHeight = 75,
}: {
  children: ReactNode
  gridStructure?: DataGrid[]
  rowHeight?: number
  draggable?: boolean
}) {
  const theme = useTheme()
  const childrenFromTypes = useMemo(() => getFormsFieldsTypes(children), [children])
  let prevXValue = -1
  let prevYValue = 1
  return (
    <ResponsiveGridLayout
      autoSize={true}
      breakpoints={{
        xl: theme.breakpoints.values.xl,
        lg: theme.breakpoints.values.lg,
        md: theme.breakpoints.values.md,
        sm: theme.breakpoints.values.sm,
      }}
      className="layout"
      cols={{ xl: 8, lg: 8, md: 8, sm: 8 }}
      compactType={null}
      isBounded={true}
      isDraggable={true}
      margin={[0, 0]}
      rowHeight={rowHeight}
    >
      {
        // children is a prop that passed to the component, second arg is a callback
        // Children.toArray prevent the need to iterate over undefined values or
        // nested array of children
        Children.map(Children.toArray(children), (child, index) => {
          let dataGridValue
          let xValue
          let yValue
          if (gridStructure && gridStructure.length > 0) {
            dataGridValue = gridStructure[index]
            xValue = dataGridValue.x
            yValue = dataGridValue.y
          } else {
            // If a gridStructure was not provided, we get the formType of the
            // child, and we attach the dataGrid prop to it
            dataGridValue = getDataGridFromMapping(
              childrenFromTypes[index],
              mappingDataGridForComponents,
              draggable,
            )
            // Trying to prevent collision in a naive way
            xValue = dataGridValue.x > prevXValue ? dataGridValue.x : prevXValue
            yValue = dataGridValue.y

            // If xValue overpass the max x-axis length, we need to increase the yValue
            if (xValue + dataGridValue.w > 8) {
              xValue = 0
              yValue = prevYValue
              prevYValue = prevYValue + dataGridValue.h
            }
            prevXValue = xValue + dataGridValue.w + 0.5
          }

          return (
            <GridFormItem
              data-grid={{ ...dataGridValue, x: xValue, y: yValue }}
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
