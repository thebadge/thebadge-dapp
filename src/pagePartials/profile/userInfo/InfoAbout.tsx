import Link from 'next/link'
import React from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import { Box, Stack, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { Controller, useFormContext } from 'react-hook-form'

import TBEditableTypography from '@/src/components/common/TBEditableTypography'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { EditProfileSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { WCAddress } from '@/types/utils'

type Props = {
  address: WCAddress
  readView: boolean
}

const TextFieldContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(1),
  paddingRight: theme.spacing(2),
}))

export default function InfoAbout({ address, readView }: Props) {
  const { address: connectedWalletAddress } = useWeb3Connection()
  const { data } = useUserById(address)
  const userMetadata = useUserMetadata(address || connectedWalletAddress, data?.metadataUri || '')

  const { control } = useFormContext<EditProfileSchemaType>()

  return (
    <Stack flex="5" gap={2} overflow="auto">
      <Typography color={colors.white} textAlign="left" variant="dAppHeadline2">
        About
      </Typography>
      <Controller
        control={control}
        name={'description'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TBEditableTypography
            disabled={readView}
            error={error}
            onChange={onChange}
            placeholder={'Description'}
            variant="subtitle1"
          >
            {value}
          </TBEditableTypography>
        )}
      />
      <Box display="flex">
        <Stack flex="1" gap={1} height="100%" justifyContent="space-evenly" overflow="auto">
          {(userMetadata?.website || !readView) && (
            <TextFieldContainer>
              <LanguageOutlinedIcon sx={{ mr: 1 }} />
              <Controller
                control={control}
                name={'website'}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TBEditableTypography
                    disabled={readView}
                    error={error}
                    onChange={onChange}
                    placeholder={'Website'}
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
          {(userMetadata?.email || !readView) && (
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
                    {value && readView ? (
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
        </Stack>
      </Box>
    </Stack>
  )
}
