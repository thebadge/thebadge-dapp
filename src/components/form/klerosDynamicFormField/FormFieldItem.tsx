import { useRef } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { Box, Stack, Typography, styled } from '@mui/material'
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
  marginBottom: theme.spacing(2),
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

  return (
    <Container data-handler-id={handlerId} isDragging={isDragging} isOver={isOver} ref={ref}>
      <DragIndicatorIcon />
      <Stack>
        <Typography component={'div'} variant="title4">
          Label
        </Typography>
        {field.label}
      </Stack>
      <Stack>
        <Typography component={'div'} variant="title4">
          Description
        </Typography>
        {field.description}
      </Stack>
      <Stack>
        <Typography component={'div'} variant="title4">
          Type
        </Typography>
        {field.type}
      </Stack>
      <Box
        onClick={removeItem}
        sx={{ ml: 'auto', cursor: 'pointer', justifyContent: 'center', display: 'flex' }}
      >
        <DeleteForeverIcon />
      </Box>
    </Container>
  )
}
