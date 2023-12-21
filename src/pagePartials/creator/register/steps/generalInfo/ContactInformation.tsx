import React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { Control, Controller } from 'react-hook-form'

import { CONTACT_METHODS } from '../../schema/CreatorRegisterSchema'
import { DropdownSelect } from '@/src/components/form/formFields/DropdownSelect'
import { TextField } from '@/src/components/form/formFields/TextField'

type Props = {
  formControl: Control<any>
}

export default function ContactInformation({ formControl }: Props) {
  const { t } = useTranslation()

  const renderContactInformationForm = () => {
    return (
      <>
        <Typography variant="dAppTitle1">{t('creator.register.form.aboutData.title')}</Typography>
        <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
          <Stack flex="1" gap={2}>
            <Controller
              control={formControl}
              name={'register.website'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.aboutData.website')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
          <Stack flex="1" gap={2}>
            <Controller
              control={formControl}
              name={'register.email'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.aboutData.email')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
        </Box>
      </>
    )
  }

  const renderSocialInformationForm = () => {
    return (
      <>
        <Typography variant="dAppTitle1">{t('creator.register.form.socialData.title')}</Typography>
        <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
          <Stack flex="1" gap={2}>
            <Controller
              control={formControl}
              name={'register.twitter'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.twitter')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={formControl}
              name={'register.discord'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.discord')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={formControl}
              name={'register.linkedin'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.linkedin')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
          <Stack flex="1" gap={2}>
            <Controller
              control={formControl}
              name={'register.github'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.github')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={formControl}
              name={'register.telegram'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.telegram')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
        </Box>
        <Controller
          control={formControl}
          name={'register.preferContactMethod'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box alignItems="center" display="flex" gap={1} justifyContent="center">
              <Typography>
                {t('creator.register.form.termsConditions.preferContactMethod')}
              </Typography>
              <DropdownSelect
                error={error}
                label={''}
                onChange={onChange}
                options={[...CONTACT_METHODS]}
                sx={{ width: 'fit-content' }}
                value={value || 'email'}
              />
            </Box>
          )}
        />
      </>
    )
  }

  const renderContactInformationForm = () => {
    return (
      <>
        <Typography variant="dAppTitle1">{t('creator.register.form.aboutData.title')}</Typography>
        <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
          <Stack flex="1" gap={2}>
            <Controller
              control={control}
              name={'website'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.aboutData.website')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
          <Stack flex="1" gap={2}>
            <Controller
              control={control}
              name={'email'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.aboutData.email')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
        </Box>
      </>
    )
  }

  const renderSocialInformationForm = () => {
    return (
      <>
        <Typography variant="dAppTitle1">{t('creator.register.form.socialData.title')}</Typography>
        <Box display="flex" flexDirection="row" gap={5} justifyContent="space-between">
          <Stack flex="1" gap={2}>
            <Controller
              control={control}
              name={'twitter'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.twitter')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name={'discord'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.discord')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name={'linkedin'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.linkedin')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
          <Stack flex="1" gap={2}>
            <Controller
              control={control}
              name={'github'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.github')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            <Controller
              control={control}
              name={'telegram'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  error={error}
                  label={t('creator.register.form.socialData.telegram')}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Stack>
        </Box>
        <Controller
          control={control}
          name={'preferContactMethod'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Box alignItems="center" display="flex" gap={1} justifyContent="center">
              <Typography>
                {t('creator.register.form.termsConditions.preferContactMethod')}
              </Typography>
              <DropdownSelect
                error={error}
                label={''}
                onChange={onChange}
                options={[...CONTACT_METHODS]}
                sx={{ width: 'fit-content' }}
                value={value || 'email'}
              />
            </Box>
          )}
        />
      </>
    )
  }

  return (
    <Stack gap={2}>
      <Box>{renderContactInformationForm()}</Box>
      <Box>{renderSocialInformationForm()}</Box>
    </Stack>
  )
}
