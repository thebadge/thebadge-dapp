import React, { useCallback } from 'react'

import { Box, styled } from '@mui/material'
import { useTsController } from '@ts-react/form'
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/CustomForm'
import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'
import {
  KlerosDynamicFields,
  KlerosFieldTypeSchema,
  KlerosFormFieldSchema,
} from '@/src/components/form/helpers/customSchemas'
import FormFieldItem from '@/src/components/form/klerosDynamicFormField/FormFieldItem'
import { KLEROS_LIST_TYPES, KLEROS_LIST_TYPES_KEYS } from '@/types/kleros/types'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  width: '100%',
  gridColumn: '1 / 4',
}))

export default function KlerosDynamicFieldsCreator() {
  const { error, field } = useTsController<z.infer<typeof KlerosDynamicFields>>()

  // Need to type the useForm call accordingly
  const form = useForm<z.infer<typeof KlerosFormFieldSchema>>()
  const { reset } = form

  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (field.value) {
        field.onChange(
          update(field.value, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, field.value[dragIndex]],
            ],
          }),
        )
      }
    },
    [field],
  )

  const removeField = useCallback(
    (removeIndex: number) => {
      field.onChange(
        update(field.value, {
          $splice: [[removeIndex, 1]],
        }),
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [field],
  )

  const renderFieldItem = useCallback(
    (field: z.infer<typeof KlerosFormFieldSchema>, index: number) => {
      return (
        <FormFieldItem
          field={{ ...field, index }}
          index={index}
          key={field.label + index}
          moveItem={moveField}
          removeItem={() => removeField(index)}
        />
      )
    },
    [moveField, removeField],
  )

  function submitHandler(data: z.infer<typeof KlerosFormFieldSchema>) {
    field.onChange([
      ...(field.value ? field.value : []),
      {
        description: data.description,
        label: data.label,
        type: data.type as unknown as KLEROS_LIST_TYPES,
      },
    ])
    reset() // Reset fields data
  }

  return (
    <Wrapper>
      <Box>
        <CustomFormFromSchemaWithoutSubmit
          form={form}
          formProps={{
            buttonLabel: '+ Add Field',
          }}
          onSubmit={submitHandler}
          props={{
            type: {
              options: [...KLEROS_LIST_TYPES_KEYS],
              schema: KlerosFieldTypeSchema,
            },
          }}
          schema={KlerosFormFieldSchema}
        />
      </Box>
      {error && <FormStatus status={TextFieldStatus.error}>{error.errorMessage}</FormStatus>}
      <Box>
        <DndProvider backend={HTML5Backend}>
          {field?.value?.map((field, index) => renderFieldItem(field, index))}
        </DndProvider>
      </Box>
    </Wrapper>
  )
}
