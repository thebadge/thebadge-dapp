import React, { useRef } from 'react'

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import GridViewIcon from '@mui/icons-material/GridView'
import { Box, Typography, styled } from '@mui/material'
import { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'
import { z } from 'zod'

import { KlerosFormFieldSchema } from '@/src/components/form/helpers/customSchemas'

type FormFieldItemProps = {
  index: number
  field: z.infer<typeof KlerosFormFieldSchema> & { index: number }
  moveItem: (dragIndex: number, hoverIndex: number) => void
  removeItem: () => void
}

type DragItem = {
  index: number
  id: string
  type: string
}

const Container = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'isDragging' && propName !== 'isOver',
})<{
  isDragging: boolean
  isOver: boolean
}>(({ isDragging, isOver, theme }) => ({
  marginBottom: theme.spacing(4),
  borderBottom: '0.5px solid white',
  columnGap: theme.spacing(2),
  display: 'flex',
  cursor: 'grab',
  backgroundColor: 'transparent',
  ...(isDragging
    ? {
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: theme.palette.grey['500'],
        opacity: 0.6,
      }
    : {}),
  ...(isOver
    ? {
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: theme.palette.green.main,
      }
    : {}),
}))

export default function FormFieldItem({ field, index, moveItem, removeItem }: FormFieldItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId, isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; isOver: boolean }
  >({
    accept: 'MetadataColumnField',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      }
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Safe ward
      if (dragIndex === undefined || hoverIndex === undefined) {
        return
      }
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'MetadataColumnField',
      item: field,
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [],
  )

  drag(drop(ref))

  function truncate(str: string, n = 10) {
    return str.length > n ? str.slice(0, n - 1) + '...' : str
  }

  return (
    <Container data-handler-id={handlerId} isDragging={isDragging} isOver={isOver} ref={ref}>
      <GridViewIcon />
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-evenly', mb: 3 }}>
        <Typography sx={{ flex: 1 }} variant="subtitle1">
          {truncate(field.label)}
        </Typography>

        <Typography sx={{ flex: 2 }} variant="subtitle1">
          {truncate(field.description, 25)}
        </Typography>

        <Typography sx={{ flex: 1, textTransform: 'capitalize' }} variant="subtitle1">
          {field.type}
        </Typography>
      </Box>
      <Box
        onClick={removeItem}
        sx={{ ml: 'auto', cursor: 'pointer', justifyContent: 'center', display: 'flex' }}
      >
        <DeleteOutlineOutlinedIcon />
      </Box>
    </Container>
  )
}
