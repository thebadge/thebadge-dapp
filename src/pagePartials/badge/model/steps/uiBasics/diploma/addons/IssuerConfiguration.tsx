import React, { useEffect } from 'react'

import { Stack, Typography } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import { AvatarInput } from '@/src/components/form/formFields/AvatarInput'
import { CheckBox } from '@/src/components/form/formFields/CheckBox'
import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { IssuerConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CreateThirdPartyModelSchema'
import SectionContainer from '@/src/pagePartials/badge/model/steps/uiBasics/addons/SectionContainer'
import { CreatorMetadata } from '@/types/badges/Creator'

export default function IssuerConfiguration() {
  const { control, setValue, watch } = useFormContext<IssuerConfigurationSchemaType>()
  const { data } = useCurrentUser()

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(data?.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  const customIssuerEnabled = watch('customIssuerEnabled')
  const issuerAvatarWatched = watch('issuerAvatar')

  useEffect(() => {
    // Automatically set the value when the footer is enabled, not editable right now
    if (creatorMetadata?.logo?.s3Url && !issuerAvatarWatched) {
      setValue('issuerAvatar', {
        base64File: creatorMetadata?.logo?.s3Url,
        ipfsUrl: creatorMetadata?.logo?.ipfsUrl,
        mimeType: 'image/jpg',
      })
    }
  }, [creatorMetadata?.logo?.ipfsUrl, creatorMetadata?.logo?.s3Url, issuerAvatarWatched, setValue])

  return (
    <>
      <SectionContainer>
        <Stack>
          <Controller
            control={control}
            name={'customIssuerEnabled'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CheckBox
                error={error}
                label="Do you want to customize the issuer data?"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Stack>
      </SectionContainer>
      {customIssuerEnabled && (
        <SectionContainer>
          <Stack flex="1" gap={4} justifyContent="center">
            <Stack>
              <Typography variant="bodySmall">Issuer Avatar</Typography>
              <Controller
                control={control}
                name={'issuerAvatar'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <AvatarInput
                    error={error}
                    onChange={(value: ImageType | null) => {
                      if (value) {
                        // We change the structure a little bit to have it ready to push to the backend
                        onChange({
                          mimeType: value.file?.type,
                          base64File: value.base64File,
                        })
                      } else onChange(null)
                    }}
                    value={value}
                  />
                )}
              />
            </Stack>
          </Stack>
        </SectionContainer>
      )}
    </>
  )
}
