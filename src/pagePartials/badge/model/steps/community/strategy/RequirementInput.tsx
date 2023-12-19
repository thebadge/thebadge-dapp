import React, { useState } from 'react'

import { Box, Collapse, FormHelperText, Typography } from '@mui/material'
import { Editor } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'
import { DeltaStatic, Sources } from 'quill'
import { Controller, useFormContext } from 'react-hook-form'
import { UnprivilegedEditor } from 'react-quill'
import { TransitionGroup } from 'react-transition-group'

import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
import PDFRequirementInput from '@/src/pagePartials/badge/model/steps/community/strategy/PDFRequirementInput'
import { getCriteriaTemplate } from '@/src/pagePartials/badge/model/utils'

export default function RequirementInput() {
  const { t } = useTranslation()
  const { control } = useFormContext<CreateCommunityModelSchemaType>()

  const [enableTextEditor, setEnableTextEditor] = useState(true) // default is true

  function toggleTextEditor() {
    setEnableTextEditor((prev) => !prev)
  }

  return (
    <>
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
            <Box marginTop={2}>
              <Typography
                fontSize={'14px !important'}
                onClick={toggleTextEditor}
                sx={{ cursor: 'pointer' }}
                textAlign="center"
                variant="body4"
              >
                {t('acceptanceCriteria.switchBackTo')}{' '}
                <span style={{ textDecoration: 'underline' }}>
                  {t('acceptanceCriteria.textEditor')}
                </span>
              </Typography>
            </Box>
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
            <Box marginTop={2}>
              <Typography
                fontSize={'14px !important'}
                onClick={toggleTextEditor}
                sx={{ cursor: 'pointer' }}
                textAlign="center"
                variant="body4"
              >
                {t('acceptanceCriteria.uploadCriteriaAs')}{' '}
                <span style={{ textDecoration: 'underline' }}>{t('acceptanceCriteria.pdf')}</span>
              </Typography>
            </Box>
          </Collapse>
        )}
      </TransitionGroup>
    </>
  )
}
