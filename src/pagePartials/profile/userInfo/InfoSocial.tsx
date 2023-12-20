import Link from 'next/link'
import React from 'react'

import { LinkedIn } from '@mui/icons-material'
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'
import TwitterIcon from '@mui/icons-material/Twitter'
import { Box, Stack, Typography, styled } from '@mui/material'
import { IconDiscord, IconGithub, colors } from '@thebadge/ui-library'
import { Controller, useFormContext } from 'react-hook-form'

import TBEditableTypography from '@/src/components/common/TBEditableTypography'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { EditProfileSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { shortenLinkedinString } from '@/src/utils/strings'
import { WCAddress } from '@/types/utils'

const TextFieldContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  paddingRight: theme.spacing(2),
}))

type Props = {
  address: WCAddress
  readView: boolean
}

export default function InfoSocial({ address, readView }: Props) {
  const { address: connectedWalletAddress } = useWeb3Connection()
  const { data } = useUserById(address)
  const userMetadata = useUserMetadata(address || connectedWalletAddress, data?.metadataUri || '')

  const { control } = useFormContext<EditProfileSchemaType>()

  return (
    <Stack flex="5" gap={2} justifyContent="space-between" overflow="auto">
      <Typography color={colors.white} textAlign="left" variant="dAppHeadline2">
        Social
      </Typography>
      <Box display="flex">
        <Stack flex="1" gap={1} height="100%" justifyContent="space-evenly" overflow="auto">
          {(userMetadata?.twitter || !readView) && (
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
                    {value && readView ? (
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
          {(userMetadata?.discord || !readView) && (
            <TextFieldContainer>
              <IconDiscord sx={{ mr: 1 }} />
              <Controller
                control={control}
                name={'discord'}
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <TBEditableTypography
                      disabled={readView}
                      error={error}
                      onChange={onChange}
                      placeholder={'Discord'}
                      variant="dAppTitle2"
                    >
                      {value && readView ? (
                        <Link href={value} target={'_blank'}>
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </TBEditableTypography>
                  )
                }}
              />
            </TextFieldContainer>
          )}
          {(userMetadata?.linkedin || !readView) && (
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
                    {value && readView ? (
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
          {(userMetadata?.github || !readView) && (
            <TextFieldContainer>
              <Box display="flex" sx={{ marginRight: '8.5px' }}>
                <IconGithub />
              </Box>
              <Controller
                control={control}
                name={'github'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TBEditableTypography
                    disabled={readView}
                    error={error}
                    onChange={onChange}
                    placeholder={'Github'}
                    variant="dAppTitle2"
                  >
                    {value && readView ? (
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
          {(userMetadata?.telegram || !readView) && (
            <TextFieldContainer>
              <SendOutlinedIcon sx={{ mr: 1 }} />
              <Controller
                control={control}
                name={'telegram'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TBEditableTypography
                    disabled={readView}
                    error={error}
                    onChange={onChange}
                    placeholder={'Telegram'}
                    variant="dAppTitle2"
                  >
                    {value && readView ? (
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
      </Box>
    </Stack>
  )
}
