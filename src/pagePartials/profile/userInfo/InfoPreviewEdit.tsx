import Link from 'next/link'
import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { LinkedIn } from '@mui/icons-material'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, IconButton, Skeleton, Stack, styled } from '@mui/material'
import { IconDiscord } from '@thebadge/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'

import TBEditableTypography from '@/src/components/common/TBEditableTypography'
import TBUserAvatar from '@/src/components/common/TBUserAvatar'
import { AvatarInput } from '@/src/components/form/formFields/AvatarInput'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import useTransaction from '@/src/hooks/useTransaction'
import {
  CreatorRegisterSchemaType,
  EditProfileSchema,
  EditProfileSchemaType,
} from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import { CreatorMetadata } from '@/types/badges/Creator'
import { TheBadgeUsers__factory } from '@/types/generated/typechain'

const TextFieldContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  paddingRight: theme.spacing(2),
}))

type Props = {
  address: `0x${string}`
}

export default function InfoPreviewEdit({ address }: Props) {
  const { sendTx } = useTransaction()
  const { address: connectedWalletAddress } = useWeb3Connection()

  const isLoggedInUser = connectedWalletAddress === address

  const [readView, setReadView] = useState(true)

  const theBadgeUsers = useContractInstance(TheBadgeUsers__factory, 'TheBadgeUsers')

  const { data } = useUserById(address)

  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(data?.metadataUri || '')
  const creatorMetadata = resCreatorMetadata.data?.content

  const { control, handleSubmit, reset } = useForm<EditProfileSchemaType>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      ...creatorMetadata,
      // As we just have an url, we need to mock the logo object to match the criterias
      logo: { base64File: creatorMetadata?.logo?.s3Url, mimeType: 'image/jpeg' },
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  function onClose() {
    reset()
    setReadView(true)
  }

  function onEdit() {
    setReadView(false)
  }

  async function onSubmit(data: EditProfileSchemaType) {
    if (!address || !creatorMetadata) {
      throw Error('Web3 address not provided')
    }

    try {
      const transaction = await sendTx(async () => {
        setReadView(true)
        // Use NextJs dynamic import to reduce the bundle size
        const { createAndUploadCreatorMetadata } = await import(
          '@/src/utils/creator/registerHelpers'
        )

        // If data has the base64File, the user had uploaded a new logo
        const logoHasChange = !!data.logo.base64File

        // Use previous data as default, and override with new values
        const upsertCreatorData = {
          ...creatorMetadata,
          ...data,
          ...(!logoHasChange && { logo: creatorMetadata?.logo?.ipfs }),
        } as CreatorRegisterSchemaType

        const userMetadataIPFSHash = await createAndUploadCreatorMetadata(
          upsertCreatorData,
          logoHasChange,
        )

        return theBadgeUsers.updateProfile(userMetadataIPFSHash)
      })

      if (transaction) {
        await transaction.wait()
      }
    } catch (e) {
      setReadView(false)
      // Do nothing
    }
  }

  function shortenLinkedinString(inputString: string, maxLength: number): string {
    if (!inputString || inputString.length <= maxLength) {
      return inputString
    } else {
      const prefixToRemove = 'https://www.linkedin.com/'
      const replacedUrl = inputString
        .replace(new RegExp('^' + prefixToRemove), '')
        .slice(0, maxLength)
      return replacedUrl.slice(0, maxLength)
    }
  }

  return (
    <>
      {readView && (
        <Stack my={0.5}>
          <SafeSuspense
            fallback={<Skeleton variant="circular" width={creatorMetadata ? 171 : 90} />}
          >
            <TBUserAvatar size={creatorMetadata ? 171 : 90} src={creatorMetadata?.logo?.s3Url} />
          </SafeSuspense>
        </Stack>
      )}
      {!readView && (
        <Controller
          control={control}
          name={'logo'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <AvatarInput
              error={error}
              label="Change Photo"
              labelPosition="hover"
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
      )}

      <Stack flex="5" gap={2} justifyContent="space-between" overflow="auto">
        <Stack gap={1} pr={2}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TBEditableTypography
                disabled={readView}
                error={error}
                onChange={onChange}
                variant="dAppHeadline2"
              >
                {value}
              </TBEditableTypography>
            )}
          />
          <Address address={address} truncate={false} />
        </Stack>

        <Box display="flex">
          <Stack flex="1" gap={1} height="100%" justifyContent="space-evenly" overflow="auto">
            {(creatorMetadata?.email || !readView) && (
              <TextFieldContainer>
                <EmailOutlinedIcon sx={{ mr: 1 }} />
                <Controller
                  control={control}
                  name={'email'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TBEditableTypography
                      disabled={readView}
                      error={error}
                      onChange={onChange}
                      placeholder={'Email'}
                      variant="dAppTitle2"
                    >
                      {value ? (
                        <Link href={`mailto:${value}`} target={'_blank'}>
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </TBEditableTypography>
                  )}
                />
              </TextFieldContainer>
            )}
            {(creatorMetadata?.twitter || !readView) && (
              <TextFieldContainer>
                <TwitterIcon sx={{ mr: 1 }} />
                <Controller
                  control={control}
                  name={'twitter'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TBEditableTypography
                      disabled={readView}
                      error={error}
                      onChange={onChange}
                      placeholder={'Twitter'}
                      variant="dAppTitle2"
                    >
                      {value ? (
                        <Link href={value} target={'_blank'}>
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </TBEditableTypography>
                  )}
                />
              </TextFieldContainer>
            )}
            {(creatorMetadata?.discord || !readView) && (
              <TextFieldContainer>
                <IconDiscord sx={{ mr: 1 }} />
                <Controller
                  control={control}
                  name={'discord'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TBEditableTypography
                      disabled={readView}
                      error={error}
                      onChange={onChange}
                      placeholder={'Discord'}
                      variant="dAppTitle2"
                    >
                      {value ? (
                        <Link href={value} target={'_blank'}>
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </TBEditableTypography>
                  )}
                />
              </TextFieldContainer>
            )}
            {(creatorMetadata?.linkedin || !readView) && (
              <TextFieldContainer>
                <LinkedIn sx={{ mr: 1 }} />
                <Controller
                  control={control}
                  name={'linkedin'}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TBEditableTypography
                      disabled={readView}
                      error={error}
                      onChange={onChange}
                      placeholder={'Company Url'}
                      variant="dAppTitle2"
                    >
                      {value ? (
                        <Link href={value} target={'_blank'}>
                          {shortenLinkedinString(value || '', 20)}
                        </Link>
                      ) : (
                        value
                      )}
                    </TBEditableTypography>
                  )}
                />
              </TextFieldContainer>
            )}
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
                <TBEditableTypography
                  disabled={readView}
                  error={error}
                  multiline
                  onChange={onChange}
                  variant="body4"
                >
                  {value}
                </TBEditableTypography>
              )}
            />
          </Stack>
        </Box>
      </Stack>

      {!readView && (
        <>
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
      )}
      {isLoggedInUser && readView && (
        <IconButton onClick={onEdit} sx={{ position: 'absolute', right: 24, top: 24 }}>
          <CreateOutlinedIcon />
        </IconButton>
      )}
    </>
  )
}
