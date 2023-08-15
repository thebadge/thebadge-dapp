import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Divider, Stack } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { Controller, useForm } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'
import { z } from 'zod'

import { FileInput } from '@/src/components/form/FileInput'
import { TextArea } from '@/src/components/form/TextArea'
import { TextField } from '@/src/components/form/TextField'
import { LongTextSchema, OptionalFileSchema } from '@/src/components/form/helpers/customSchemas'

export const EvidenceSchema = z.object({
  title: z.string(),
  description: LongTextSchema,
  attachment: OptionalFileSchema,
})

type EvidenceFormProps = {
  type: 'challenge' | 'addEvidence'
  onSubmit: (data: z.infer<typeof EvidenceSchema>) => Promise<void>
  showCostComponent?: React.ReactNode
}

export default function EvidenceForm({ onSubmit, showCostComponent, type }: EvidenceFormProps) {
  const { t } = useTranslation()

  const { control, formState, handleSubmit } = useForm<z.infer<typeof EvidenceSchema>>({
    resolver: zodResolver(EvidenceSchema),
  })

  console.log(formState)
  return (
    <Stack
      sx={{
        width: '100%',
      }}
    >
      <Controller
        control={control}
        name={'title'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            error={error}
            label={t(`badge.${type}.evidenceForm.title`)}
            onChange={onChange}
            value={value}
          />
        )}
      />
      <Box display="flex" gap={3} mb={4}>
        <Box display="flex" flex={1} sx={{ '& > *': { flex: 1 } }}>
          <Controller
            control={control}
            name={'description'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextArea
                error={error}
                label={t(`badge.${type}.evidenceForm.description`)}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Box>
        <Box display="flex" flex={1} mb={2}>
          <Controller
            control={control}
            name={'attachment'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FileInput
                error={error}
                label={t(`badge.${type}.evidenceForm.attachment`)}
                onChange={(value: ImageType | null) => {
                  if (value) {
                    // We change the structure a little bit to have it ready to push to the backend
                    onChange({
                      mimeType: value.file?.type,
                      base64File: value.data_url,
                    })
                  } else onChange(null)
                }}
                value={value}
              />
            )}
          />
        </Box>
      </Box>

      {showCostComponent}
      <Divider color={colors.white} sx={{ mt: showCostComponent ? 8 : 1 }} />
      <Box display="flex" mt={4}>
        <Button
          color="error"
          onClick={handleSubmit(onSubmit, (a) => console.log(a))}
          sx={{ borderRadius: 3, ml: 'auto' }}
          variant="contained"
        >
          {t(`badge.${type}.evidenceForm.submit`)}
        </Button>
      </Box>
    </Stack>
  )
}
