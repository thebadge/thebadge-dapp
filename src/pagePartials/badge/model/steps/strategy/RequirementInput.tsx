import React, { useState } from 'react'

import { Collapse, FormHelperText, Typography } from '@mui/material'
import { Editor } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { DeltaStatic, Sources } from 'quill'
import { Controller, useFormContext } from 'react-hook-form'
import { UnprivilegedEditor } from 'react-quill'
import { TransitionGroup } from 'react-transition-group'

import { CreateModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateModelSchema'
import PDFRequirementInput from '@/src/pagePartials/badge/model/steps/strategy/PDFRequirementInput'
import { getCriteriaTemplate } from '@/src/pagePartials/badge/model/utils'

export default function RequirementInput() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateModelSchemaType>()

  const [enableTextEditor, setEnableTextEditor] = useState(false)

  function toggleTextEditor() {
    setEnableTextEditor((prev) => !prev)
  }

  return (
    <>
      <Typography color="text.disabled" variant="dAppTitle2">
        {t('acceptanceCriteria.create')}
      </Typography>
      <TransitionGroup>
        {!enableTextEditor && (
          <Collapse key={'criteria.criteriaFileUri'}>
            <Controller
              control={control}
              name={'criteria.criteriaFileUri'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PDFRequirementInput error={error} onChange={onChange} value={value} />
              )}
            />
            <Typography
              fontSize={'14px !important'}
              onClick={toggleTextEditor}
              sx={{ cursor: 'pointer' }}
              textAlign="center"
              variant="body4"
            >
              Switch back to <span style={{ textDecoration: 'underline' }}>text editor</span>.
            </Typography>
          </Collapse>
        )}
        {enableTextEditor && (
          <Collapse key={'criteriaDeltaText'}>
            <Controller
              control={control}
              name={'criteria.criteriaDeltaText'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Editor
                  error={!!error}
                  helperText={
                    !!error && (
                      <FormHelperText error={!!error} sx={{ px: 1 }}>
                        {error?.message}
                      </FormHelperText>
                    )
                  }
                  id={'criteriaDeltaText'}
                  onChange={(
                    value: string,
                    delta: DeltaStatic,
                    source: Sources,
                    editor: UnprivilegedEditor,
                  ) => onChange({ string: value, delta: editor.getContents() })}
                  placeholder={'Write your acceptance criteria'}
                  sx={{
                    '& .ql-editor ': {
                      overflowY: 'scroll',
                      resize: 'vertical',
                    },
                  }}
                  value={value ? value.string : getCriteriaTemplate()}
                />
              )}
            />
            <Typography
              fontSize={'14px !important'}
              onClick={toggleTextEditor}
              sx={{ cursor: 'pointer' }}
              textAlign="center"
              variant="body4"
            >
              Upload criteria as <span style={{ textDecoration: 'underline' }}>PDF</span>.
            </Typography>
          </Collapse>
        )}
      </TransitionGroup>
    </>
  )
}
