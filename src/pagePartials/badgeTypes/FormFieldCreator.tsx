import { useCallback } from 'react'

import { Box } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CustomFormFromSchema } from '@/src/components/form/CustomForm'
import { FieldTypeSchema } from '@/src/components/form/helpers/customSchemas'
import FormFieldItem from '@/src/pagePartials/badgeTypes/FormFieldItem'
import { KLEROS_LIST_TYPES, KLEROS_LIST_TYPES_KEYS, MetadataColumn } from '@/src/utils/kleros/types'

type FormFieldSelectorProps = {
  fields: MetadataColumn[]
  addField: (field: MetadataColumn) => void
  moveField: (dragIndex: number, hoverIndex: number) => void
  removeField: (removeIndex: number) => void
}

const FormFieldSchema = z.object({
  name: z.string().describe('Name // Field name that the user will be when they create the badge.'),
  description: z
    .string()
    .describe('Description // Field description that explains what the field data is'),
  type: FieldTypeSchema.describe('Field Type // Type of the required data'),
})

export default function FormFieldCreator({
  addField,
  fields,
  moveField,
  removeField,
}: FormFieldSelectorProps) {
  // Need to type the useForm call accordingly
  const form = useForm<z.infer<typeof FormFieldSchema>>()
  const { reset } = form

  function submitHandler(data: z.infer<typeof FormFieldSchema>) {
    if (addField) {
      addField({
        description: data.description,
        label: data.name,
        type: data.type as unknown as KLEROS_LIST_TYPES,
        isIdentifier: false,
      })
      reset() // Clean the form data
    }
  }

  const renderFieldItem = useCallback((field: MetadataColumn, index: number) => {
    return field ? (
      <FormFieldItem
        field={{ ...field, index }}
        index={index}
        key={field.label + index}
        moveItem={moveField}
        removeItem={() => removeField(index)}
      />
    ) : (
      <Box>empty field</Box>
    )
    // eslint-disable-next-line
  }, [])

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
              schema: FieldTypeSchema,
            },
          }}
          schema={FormFieldSchema}
        />
      </Box>
      <Box>
        <DndProvider backend={HTML5Backend}>
          {fields.map((field, index) => renderFieldItem(field, index))}
        </DndProvider>
      </Box>
    </Box>
  )
}
