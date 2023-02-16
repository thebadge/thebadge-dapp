import * as React from 'react'

import { Box, TextField as MUITextField, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import { z } from 'zod'

import { DescriptionTextSchema } from '@/src/components/form/helpers/customSchemas'
import { ENRICH_TEXT_VARIABLES } from '@/src/utils/enrichTextWithValues'

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  rowGap: theme.spacing(1),
  gridColumn: 'auto',
}))

const StyledTextField = styled(MUITextField)(({ theme }) => ({
  margin: theme.spacing(0),
}))

const VariableContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 0.75),
  marginRight: theme.spacing(0.5),
  borderRadius: theme.spacing(0.5),
  cursor: 'pointer',
}))

export default function DescriptionInputField() {
  const { error, field } = useTsController<z.infer<typeof DescriptionTextSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(e: any) {
    field.onChange(e.target.value)
  }

  function appendVariable(variable: string) {
    if (field.value) {
      field.onChange(field.value + ` ${variable} `)
    } else {
      field.onChange(`${variable} `)
    }
  }

  return (
    <Wrapper>
      <Typography>{label}</Typography>
      <Typography fontWeight={300} sx={{ fontSize: '12px !important' }}>
        Personalize the description with any of this variables:
      </Typography>
      <Box display="flex">
        {ENRICH_TEXT_VARIABLES.map((it) => (
          <VariableContainer key={it}>
            <Typography
              color="blue"
              fontWeight="bold"
              onClick={() => appendVariable(it)}
              sx={{ fontSize: '12px !important' }}
              variant="body2"
            >
              {it}
            </Typography>
          </VariableContainer>
        ))}
      </Box>
      <StyledTextField
        color="secondary"
        error={!!error}
        helperText={error?.errorMessage || ' '}
        multiline
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        sx={{ textTransform: 'capitalize' }}
        value={field.value ? field.value : ''}
        variant={'standard'}
      />
    </Wrapper>
  )
}
