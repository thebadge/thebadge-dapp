import React, { useCallback } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { useTsController } from '@ts-react/form'
import update from 'immutability-helper'
import useTranslation from 'next-translate/useTranslation'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Controller, FieldError, useForm } from 'react-hook-form'
import { z } from 'zod'

import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import FormFieldItem from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/FormFieldItem'
import EmptyListMessage from '@/src/components/form/formFields/KlerosDynamicFormCreatorField/addons/EmptyListMessage'
import { TextArea } from '@/src/components/form/formFields/TextArea'
import { TextField } from '@/src/components/form/formFields/TextField'
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
  const { t } = useTranslation()

  const isEmpty = !props?.value || props?.value?.length === 0
  console.log(props.value)
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
          <Stack flex="1">
            <Typography variant="labelMedium">{t('badge.model.create.formField.name')}</Typography>
            <Controller
              control={control}
              name={'label'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  ghostLabel="How do you want to name this field?"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
          <Stack flex="1">
            <Typography variant="labelMedium">{t('badge.model.create.formField.type')}</Typography>
            <Controller
              control={control}
              name={'type'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <DropdownSelect<typeof value>
                  error={error}
                  onChange={onChange}
                  options={[
                    t('badge.model.create.formField.selectType'),
                    ...KLEROS_LIST_TYPES_KEYS,
                  ]}
                  value={value || ' '}
                />
              )}
            />
          </Stack>
        </Box>
        <Controller
          control={control}
          name={'description'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextArea
              error={error}
              label={t('badge.model.create.formField.description')}
              onChange={onChange}
              placeholder="In a nutshell, describe the requested evidence's key features"
              value={value}
            />
          )}
        />
        <Button
          onClick={handleSubmit(submitHandler, (e) => console.log(e))}
          sx={{ borderRadius: 3, ml: 'auto', fontSize: '12px !important', minHeight: '30px' }}
          variant="contained"
        >
          {t('badge.model.create.formField.addField')}
        </Button>
      </Stack>
      {isEmpty && <EmptyListMessage error={!!error} />}

      <Box mt={2}>
        <Typography variant="titleMedium">Check how your form would look like</Typography>

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
