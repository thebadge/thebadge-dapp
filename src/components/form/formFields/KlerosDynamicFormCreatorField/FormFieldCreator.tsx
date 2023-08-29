import React, { useCallback } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { useTsController } from '@ts-react/form'
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import FormFieldItem from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/FormFieldItem'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField, TextFieldStatus } from '@/src/components/form/formFields/TextField'
import { FormStatus } from '@/src/components/form/helpers/FormStatus'
import {
  KlerosDynamicFields,
  KlerosFormFieldSchema,
} from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
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

type Props = {
  error?: FieldError
  onChange: (value: any) => void
  value: Array<z.infer<typeof KlerosFormFieldSchema>> | undefined
}

export function KlerosDynamicFieldsCreator({ error, ...props }: Props) {
  // Need to type the useForm call accordingly
  const form = useForm<z.infer<typeof KlerosFormFieldSchema>>({
    resolver: zodResolver(KlerosFormFieldSchema),
  })
  const { control, handleSubmit, reset } = form

  const moveField = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (props.value) {
        props.onChange(
          update(props.value, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, props.value[dragIndex]],
            ],
          }),
        )
      }
    },
    [props],
  )

  const removeField = useCallback(
    (removeIndex: number) => {
      props.onChange(
        update(props.value, {
          $splice: [[removeIndex, 1]],
        }),
      )
    },
    [props],
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
    props.onChange([
      ...(props.value ? props.value : []),
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
      <Stack gap={1}>
        <Box display="flex" flex="1" gap={3}>
          <Controller
            control={control}
            name={'label'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField error={error} label={'Field name'} onChange={onChange} value={value} />
            )}
          />
          <Controller
            control={control}
            name={'type'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DropdownSelect<typeof value>
                error={error}
                label={'Field Type'}
                onChange={onChange}
                options={['Select a type', ...KLEROS_LIST_TYPES_KEYS]}
                value={value || ' '}
              />
            )}
          />
        </Box>
        <Controller
          control={control}
          name={'description'}
          render={({ field: { name, onChange, value }, fieldState: { error } }) => (
            <TextArea error={error} label={name} onChange={onChange} value={value} />
          )}
        />
        <Button
          onClick={handleSubmit(submitHandler, (e) => console.log(e))}
          sx={{ borderRadius: 3, ml: 'auto', fontSize: '12px !important' }}
          variant="contained"
        >
          + Add Field
        </Button>
      </Stack>
      {error && <FormStatus status={TextFieldStatus.error}>{error.message}</FormStatus>}
      <Box mt={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 4, ml: 5, mr: 5 }}>
          <Typography sx={{ flex: 2 }} variant="subtitle1">
            Name
          </Typography>

          <Typography sx={{ flex: 3 }} variant="subtitle1">
            Description
          </Typography>

          <Typography sx={{ flex: 1 }} variant="subtitle1">
            Type
          </Typography>
        </Box>
        <Box sx={{ overflowY: 'auto' }}>
          <DndProvider backend={HTML5Backend}>
            {props?.value?.map((field, index) => renderFieldItem(field, index))}
          </DndProvider>
        </Box>
      </Box>
    </Wrapper>
  )
}

export default function KlerosDynamicFieldsCreatorTSForm() {
  const { error, field } = useTsController<z.infer<typeof KlerosDynamicFields>>()

  return (
    <KlerosDynamicFieldsCreator
      error={error ? convertToFieldError(error) : undefined}
      onChange={field.onChange}
      value={field.value}
    />
  )
}
