import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, IconButton, Stack, styled } from '@mui/material'
import { IconDiscord } from '@thebadge/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import TBEditableTypography from '@/src/components/common/TBEditableTypography'
import { AvatarInput } from '@/src/components/form/formFields/AvatarInput'
import { Address } from '@/src/components/helpers/Address'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import useTransaction from '@/src/hooks/useTransaction'
import {
  EditProfileSchema,
  EditProfileSchemaType,
} from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { CreatorMetadata } from '@/types/badges/Creator'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'

const TextFieldContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  paddingRight: theme.spacing(2),
}))

type Props = {
  address: string
  onClose: VoidFunction
}

export default function InfoPreviewEdit({ address, onClose }: Props) {
  const { sendTx } = useTransaction()
  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')

  const { data } = useUserById(address)

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(data?.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  const { control, handleSubmit } = useForm<EditProfileSchemaType>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      ...creatorMetadata,
      // As we just have an url, we need to mock the logo object to match the criterias
      logo: { base64File: creatorMetadata?.logo?.s3Url, mimeType: 'image/jpeg' },
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  async function onSubmit(data: EditProfileSchemaType) {
    if (!address) {
      throw Error('Web3 address not provided')
    }

    try {
      const transaction = await sendTx(async () => {
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadCreatorMetadata } = await import(
          '@/src/utils/creator/registerHelpers'
        )

        // Use previous data as default, and override with new values
        const userMetadataIPFSHash = await createAndUploadCreatorMetadata(creatorMetadata)

        return theBadgeUsers.updateUser(address, userMetadataIPFSHash)
      })

      if (transaction) {
        await transaction.wait()
      }
    } catch (e) {
      // Do nothing
    }
  }

  return (
    <>
      <Controller
        control={control}
        name={'logo'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AvatarInput
            error={error}
            label={'Edit Photo'}
            onChange={(value: ImageType | null) => {
              if (value) {
                // We change the structure a little bit to have it ready to push to the backend
                onChange({
                  mimeType: value.file?.type,
                  base64File: value.base64File,
                })
              } else onChange(null)
            }}
            size={170}
            value={value}
          />
        )}
      />
      <Stack flex="5" gap={2} justifyContent="space-between" overflow="auto">
        <Stack gap={1} pr={2}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TBEditableTypography error={error} onChange={onChange} variant="dAppHeadline2">
                {value}
              </TBEditableTypography>
            )}
          />
          <Address address={address} truncate={false} />
        </Stack>

        <Box display="flex">
          <Stack flex="1" gap={1} height="100%" justifyContent="space-evenly" overflow="auto">
            <TextFieldContainer>
              <EmailOutlinedIcon sx={{ mr: 1 }} />
              <Controller
                control={control}
                name={'email'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TBEditableTypography error={error} onChange={onChange} variant="dAppTitle2">
                    {value}
                  </TBEditableTypography>
                )}
              />
            </TextFieldContainer>
            <TextFieldContainer>
              <TwitterIcon sx={{ mr: 1 }} />
              <Controller
                control={control}
                name={'twitter'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TBEditableTypography error={error} onChange={onChange} variant="dAppTitle2">
                    {value}
                  </TBEditableTypography>
                )}
              />
            </TextFieldContainer>
            <TextFieldContainer>
              <IconDiscord sx={{ mr: 1 }} />
              <Controller
                control={control}
                name={'discord'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TBEditableTypography error={error} onChange={onChange} variant="dAppTitle2">
                    {value}
                  </TBEditableTypography>
                )}
              />
            </TextFieldContainer>
          </Stack>
          <Stack
            borderLeft="1px solid white"
            flex="1"
            height="100%"
            justifyContent="flex-end"
            overflow="auto"
            px={2}
          >
            <Controller
              control={control}
              name={'description'}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TBEditableTypography error={error} multiline onChange={onChange} variant="body4">
                  {value}
                </TBEditableTypography>
              )}
            />
          </Stack>
        </Box>
      </Stack>

      <IconButton
        onClick={handleSubmit(onSubmit)}
        sx={{ position: 'absolute', right: 24, top: 24 }}
      >
        <SaveOutlinedIcon />
      </IconButton>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 48, top: 24 }}>
        <CancelOutlinedIcon />
      </IconButton>
    </>
  )
}
