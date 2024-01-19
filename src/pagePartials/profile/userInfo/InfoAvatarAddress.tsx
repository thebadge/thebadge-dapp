import React from 'react'

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import { Box, IconButton, Skeleton, Stack } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'

import TBEditableTypography from '@/src/components/common/TBEditableTypography'
import TBUserAvatar from '@/src/components/common/TBUserAvatar'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useSizeSM } from '@/src/hooks/useSize'
import useUserMetadata from '@/src/hooks/useUserMetadata'
import { EditProfileSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { useWeb3Connection } from '@/src/providers/web3/web3ConnectionProvider'
import { WCAddress } from '@/types/utils'

type Props = {
  address: WCAddress
  readView: boolean
  onEdit: () => void
  onSubmit: () => void
  onClose: () => void
}

export default function InfoAvatarAddress({ address, onClose, onEdit, onSubmit, readView }: Props) {
  const isMobile = useSizeSM()
  const { address: connectedWalletAddress } = useWeb3Connection()
  const { data } = useUserById(address)
  const userMetadata = useUserMetadata(address || connectedWalletAddress, data?.metadataUri || '')
  const isLoggedInUser = connectedWalletAddress === address

  const { control } = useFormContext<EditProfileSchemaType>()
  if (isMobile) {
    return (
      <Box alignItems="center" display="flex" flex="1" flexDirection="column">
        <Stack my={0.5}>
          <SafeSuspense fallback={<Skeleton variant="circular" width={userMetadata ? 171 : 90} />}>
            <TBUserAvatar
              address={address}
              size={isMobile ? 60 : 120}
              src={userMetadata.logo.base64File}
            />
          </SafeSuspense>
        </Stack>
        <Stack>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TBEditableTypography
                disabled={readView}
                error={error}
                onChange={onChange}
                placeholder={'Display Name'}
                variant="dAppHeadline2"
              >
                {value}
              </TBEditableTypography>
            )}
          />
          <Address address={address} truncate={true} />
        </Stack>
        {!readView && (
          <>
            <IconButton onClick={onSubmit} sx={{ position: 'absolute', right: 24, top: 24 }}>
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
      </Box>
    )
  }

  return (
    <>
      <Stack my={0.5}>
        <SafeSuspense fallback={<Skeleton variant="circular" width={userMetadata ? 171 : 90} />}>
          <TBUserAvatar
            address={address}
            size={isMobile ? 60 : 120}
            src={userMetadata.logo.base64File}
          />
        </SafeSuspense>
      </Stack>
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
                placeholder={'Display Name'}
                variant="dAppHeadline2"
              >
                {value}
              </TBEditableTypography>
            )}
          />
          <Address address={address} truncate={false} />
        </Stack>
      </Stack>

      {!readView && (
        <>
          <IconButton onClick={onSubmit} sx={{ position: 'absolute', right: 24, top: 24 }}>
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
