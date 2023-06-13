import React, { useState } from 'react'

import { Collapse, FormControlLabel, FormHelperText, Switch } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { DeltaStatic } from 'quill'
import { Controller, useFormContext } from 'react-hook-form'
import { TransitionGroup } from 'react-transition-group'
import { Editor } from 'thebadge-ui-library'

import PDFRequirementInput from '@/src/pagePartials/badge/model/steps/strategy/PDFRequirementInput'

export default function RequirementInput() {
  const { t } = useTranslation()
  const { control } = useFormContext()

  const [enableTextEditor, setEnableTextEditor] = useState(false)

  function toggleTextEditor() {
    setEnableTextEditor((prev) => !prev)
  }

  return (
    <>
      <FormControlLabel
        control={<Switch checked={enableTextEditor} onChange={toggleTextEditor} />}
        label={'Enable text editor'}
        sx={{ ml: 'auto' }}
      />
      <TransitionGroup>
        {!enableTextEditor && (
          <Collapse key={'criteriaFileUri'}>
            <Controller
              control={control}
              name={'criteriaFileUri'}
              render={({ field: { name, onChange, value }, fieldState: { error } }) => (
                <PDFRequirementInput error={error} onChange={onChange} value={value} />
              )}
            />
          </Collapse>
        )}
        {enableTextEditor && (
          <Collapse key={'criteriaDeltaText'}>
            <Controller
              control={control}
              name={'criteriaDeltaText'}
              render={({ field: { name, onChange, value }, fieldState: { error } }) => (
                <Editor
                  error={!!error}
                  helperText={
                    !!error && (
                      <FormHelperText error={!!error} sx={{ px: 2 }}>
                        {error?.message}
                      </FormHelperText>
                    )
                  }
                  id={name}
                  onChange={(value: string, delta: DeltaStatic) =>
                    onChange({ string: value, delta })
                  }
                  placeholder={'Write your acceptance criteria'}
                  value={value ? value.string : ''}
                />
              )}
            />
          </Collapse>
        )}
      </TransitionGroup>
    </>
  )
}
