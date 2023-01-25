import React, { useCallback, useEffect, useState } from 'react'

import { Box } from '@mui/material'
import { useTsController } from '@ts-react/form'
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CustomFormFromSchema } from '@/src/components/form/CustomForm'
import { TextFieldStatus } from '@/src/components/form/TextField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'
import { KlerosFieldTypeSchema } from '@/src/components/form/helpers/customSchemas'
import FormFieldItem from '@/src/components/form/klerosDynamicFormField/FormFieldItem'
import { KLEROS_LIST_TYPES, KLEROS_LIST_TYPES_KEYS, MetadataColumn } from '@/src/utils/kleros/types'

export const KlerosFormFieldSchema = z.object({
  name: z.string().describe('Name // Field name that the user will be when they create the badge.'),
  description: z
    .string()
    .describe('Description // Field description that explains what the field data is'),
  type: KlerosFieldTypeSchema.describe('Field Type // Type of the required data'),
})

export default function KlerosDynamicFieldsCreator() {
  const { error, field } = useTsController<MetadataColumn[]>()

  // Need to type the useForm call accordingly
  const form = useForm<z.infer<typeof KlerosFormFieldSchema>>()
  const { reset } = form

  const [fields, setFields] = useState<MetadataColumn[]>([])

  useEffect(() => {
    // Its may not be the best way, but it's the easiest. Let's go back to it later on.
    field.onChange(fields)
    // eslint-disable-next-line
  }, [fields])

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    setFields((prevFields: MetadataColumn[]) =>
      update(prevFields, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevFields[dragIndex] as MetadataColumn],
        ],
      }),
    )
  }, [])

  const removeField = useCallback((removeIndex: number) => {
    setFields((prevFields: MetadataColumn[]) =>
      update(prevFields, {
        $splice: [[removeIndex, 1]],
      }),
    )
  }, [])

  const renderFieldItem = useCallback((field: MetadataColumn, index: number) => {
    return (
      <FormFieldItem
        field={{ ...field, index }}
        index={index}
        key={field.label + index}
        moveItem={moveField}
        removeItem={() => removeField(index)}
      />
    )
    // eslint-disable-next-line
  }, [])

  function addFieldsHandler(data: MetadataColumn) {
    setFields((prev) => [...prev, data])
  }

  function submitHandler(data: z.infer<typeof KlerosFormFieldSchema>) {
    addFieldsHandler({
      description: data.description,
      label: data.name,
      type: data.type as unknown as KLEROS_LIST_TYPES,
      isIdentifier: false,
    })
    reset() // Clean the form data
  }

  return (
    <Box>
      <Box>
        <CustomFormFromSchema
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
          {fields.map((field, index) => renderFieldItem(field, index))}
        </DndProvider>
      </Box>
    </Box>
  )
}
