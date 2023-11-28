import React, { useRef } from 'react'

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import PanToolIcon from '@mui/icons-material/PanTool'
import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { Identifier, XYCoord } from 'dnd-core'
import { useDrag, useDrop } from 'react-dnd'
import { z } from 'zod'

import BooleanFieldPlaceholder from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/addons/BooleanFieldPlaceholder'
import FilePlaceholder from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/addons/FilePlaceholder'
import ImagePlaceholder from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/addons/ImagePlaceholder'
import TextAreaPlaceholder from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/addons/TextAreaPlaceholder'
import TextFieldPlaceholder from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/addons/TextFieldPlaceholder'
import { KlerosFormFieldSchema } from '@/src/components/form/helpers/customSchemas'
import { KLEROS_LIST_TYPES } from '@/types/kleros/types'

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

const BorderedBox = styled(Box)(({ theme }) => ({
  borderBottom: '0.5px solid white',
  columnGap: theme.spacing(2),
  mb: theme.spacing(2),
  display: 'flex',
  cursor: 'grab',
}))

const DraggableContainer = styled(Box, {
  shouldForwardProp: (propName) => propName !== 'isDragging' && propName !== 'isOver',
})<{
  isDragging: boolean
  isOver: boolean
}>(({ isDragging, isOver, theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),

  backgroundColor: 'transparent',
  ...(isDragging ? { opacity: 0.1 } : {}),
  ...(isOver
    ? {
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderRadius: theme.spacing(1),
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

  function renderItemType() {
    switch (field.type) {
      case KLEROS_LIST_TYPES.GTCR_ADDRESS:
      case KLEROS_LIST_TYPES.ADDRESS:
      case KLEROS_LIST_TYPES.RICH_ADDRESS:
      case KLEROS_LIST_TYPES.TEXT:
      case KLEROS_LIST_TYPES.NUMBER:
      case KLEROS_LIST_TYPES.TWITTER_USER_ID:
      case KLEROS_LIST_TYPES.LINK:
        return <TextFieldPlaceholder description={field.description} label={field.label} />
      case KLEROS_LIST_TYPES.BOOLEAN:
        return <BooleanFieldPlaceholder description={field.description} label={field.label} />
      case KLEROS_LIST_TYPES.LONG_TEXT:
        return <TextAreaPlaceholder description={field.description} label={field.label} />
      case KLEROS_LIST_TYPES.FILE: {
        return <FilePlaceholder description={field.description} label={field.label} />
      }
      case KLEROS_LIST_TYPES.IMAGE:
        return <ImagePlaceholder description={field.description} label={field.label} />
      default:
        return <Typography variant="labelMedium">Error: Unhandled Type {field.type}</Typography>
    }
  }

  return (
    <DraggableContainer
      data-handler-id={handlerId}
      isDragging={isDragging}
      isOver={isOver}
      ref={ref}
    >
      <BorderedBox>
        <Stack gap={2}>
          <PanToolIcon sx={{ mx: 'auto' }} />
          <IconButton
            onClick={removeItem}
            sx={{ ml: 'auto', cursor: 'pointer', justifyContent: 'center', display: 'flex' }}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Stack>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'space-evenly' }}>
          {renderItemType()}
        </Box>
      </BorderedBox>
    </DraggableContainer>
  )
}
