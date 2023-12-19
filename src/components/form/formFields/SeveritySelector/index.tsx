import { useState } from 'react'
import * as React from 'react'

import { Box, FormControlLabel, Skeleton, Stack, Switch, Typography, styled } from '@mui/material'
import { useDescription, useTsController } from '@ts-react/form'
import useTranslation from 'next-translate/useTranslation'
import { FieldError } from 'react-hook-form'
import { z } from 'zod'

import SeveritySelectorAdvanceView from '@/src/components/form/formFields/SeveritySelector/AdvanceView'
import SimpleView from '@/src/components/form/formFields/SeveritySelector/SimpleView'
import { SeverityTypeSchema } from '@/src/components/form/helpers/customSchemas'
import { convertToFieldError } from '@/src/components/form/helpers/validators'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useSizeSM } from '@/src/hooks/useSize'
import { Severity } from '@/types/utils'

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))

const Label = styled(Typography)(({ theme }) => ({
  maxWidth: '175px',
  [theme.breakpoints.down('sm')]: {
    maxWidth: 'none',
  },
}))

type SeveritySelectorProps = {
  error?: FieldError & { amountOfJurors?: FieldError; challengeBounty?: FieldError }
  label?: string
  onChange: (value: any) => void
  placeholder?: string
  value: z.infer<typeof SeverityTypeSchema>
}

export function SeveritySelector({
  error,
  label,
  onChange,
  placeholder,
  value,
}: SeveritySelectorProps) {
  const { t } = useTranslation()
  const isMobile = useSizeSM()
  // default is false (advanced settings disabled)
  const [enableAdvance, setAdvanceMode] = useState<boolean>(false)
  const [optionSelectedAuxIndex, setOptionSelectedAuxIndex] = useState<number>(1)

  function toggleAdvanceMode(enable: boolean) {
    setAdvanceMode(enable)
    if (!enable) {
      setOptionSelectedAuxIndex(Severity.Normal)
    }
  }

  return (
    <>
      <Container>
        <Stack>
          <Label variant="bodySmall">Select the rigorousness of your badge model challenge</Label>
          <FormControlLabel
            componentsProps={{
              typography: {
                variant: 'bodySmall',
              },
            }}
            control={
              <Switch
                checked={enableAdvance}
                disabled={isMobile}
                onChange={() => toggleAdvanceMode(!enableAdvance)}
              />
            }
            label={t('severity.advance') + (isMobile ? t('severity.onlyOnDesktop') : '')}
          />
        </Stack>
        <SimpleView
          error={error}
          label={label}
          onChange={onChange}
          onOptionSelectedChange={(aux) => setOptionSelectedAuxIndex(aux)}
          optionSelected={optionSelectedAuxIndex}
          placeholder={placeholder}
        />
      </Container>
      {enableAdvance && (
        <SafeSuspense
          fallback={<Skeleton animation="wave" height="100%" variant="rounded" width={150} />}
        >
          <SeveritySelectorAdvanceView
            onChange={onChange}
            onOptionSelectedChange={(aux) => setOptionSelectedAuxIndex(aux)}
            optionSelected={optionSelectedAuxIndex}
            value={value}
          />
        </SafeSuspense>
      )}
    </>
  )
}

/**
 * Component wrapped to be used with @ts-react/form
 *
 */
export default function SeveritySelectorWithTSForm() {
  const { error, field } = useTsController<z.infer<typeof SeverityTypeSchema>>()
  const { label, placeholder } = useDescription()

  function onChange(value: z.infer<typeof SeverityTypeSchema>) {
    field.onChange(value)
  }

  return (
    <SeveritySelector
      error={error ? convertToFieldError(error) : undefined}
      label={label}
      onChange={onChange}
      placeholder={placeholder}
      value={field.value as z.infer<typeof SeverityTypeSchema>}
    />
  )
}
