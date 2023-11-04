import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@mui/lab'
import { Box, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { OpenloginUserInfo } from '@toruslabs/openlogin/src/interfaces'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import TBModal from '@/src/components/common/TBModal'
import { TextField } from '@/src/components/form/formFields/TextField'
import useTransaction from '@/src/hooks/useTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SupportedRelayMethods } from '@/types/relayedTx'

type ZKModalProps = {
  open: boolean
  onClose: () => void
  badgeId: string
  badgeModelId: string
}

const ZKAleoSchema = z.object({
  address: z.string(),
})

export default function ZKModal({ badgeId, badgeModelId, onClose, open }: ZKModalProps) {
  return (
    <TBModal closeButtonAriaLabel="Close curate modal" onClose={onClose} open={open}>
      {open && <ZKModalContent badgeId={badgeId} badgeModelId={badgeModelId} onClose={onClose} />}
    </TBModal>
  )
}

function ZKModalContent({
  badgeModelId,
  onClose,
}: {
  badgeId: string
  badgeModelId: string
  onClose: () => void
}) {
  const { address, appChainId, wallet, web3Provider } = useWeb3Connection()
  const { sendRelayTx } = useTransaction()

  const [submitting, setSubmitting] = useState(false)
  const { control, handleSubmit } = useForm<z.infer<typeof ZKAleoSchema>>({
    resolver: zodResolver(ZKAleoSchema),
  })

  const onSubmit = async (data: z.infer<typeof ZKAleoSchema>) => {
    try {
      // Start transaction to show the loading state
      if (address && wallet) {
        console.log('making tx', wallet)
        const transaction = async () => {
          // Get wallet public key
          //wallet.provider.request({
          //  method: 'eth_getEncryptionPublicKey',
          //})
          // Create message to sign
          const messageToSign = JSON.stringify({
            aleoAddress: data.address,
            badgeModelId,
          })
          console.log('signMessage')
          const signature = await web3Provider?.getSigner().signMessage(messageToSign)

          if (!signature) {
            throw new Error('User rejected the signing of the message')
          }

          console.log('sendRelayTx')
          // Send to backend
          await sendRelayTx({
            data: messageToSign,
            from: address,
            chainId: appChainId.toString(),
            method: SupportedRelayMethods.MINT_ALEO,
            signature,
            userAccount: {
              address,
              // Forced for now
              userSocialInfo: {
                email: 'dummy@noreply.com',
              },
            },
            isSocialLogin: false,
            appPubKey: 'publicKey',
          })

          return
        }
        if (transaction) {
          await transaction()
          onClose()
        }
      }
    } catch (e) {
      console.error(e)
      // Do nothing
    }
  }

  const submitHandler = async () => {
    setSubmitting(true)
    console.log('submitHandler')
    await handleSubmit(onSubmit, (e) => console.warn('Form errors', e))()
    setSubmitting(false)
  }

  return (
    <Stack
      sx={{
        alignItems: 'center',
        width: '100%',
        gap: 6,
      }}
    >
      <Stack gap={2}>
        <Typography
          color={colors.green}
          id="modal-modal-title"
          textAlign="center"
          variant="headlineLarge"
        >
          ZK Badge on ALEO
        </Typography>

        <Typography color={colors.white} variant="titleSmall">
          This badge will be a copy of their original Ethereum Badge based on Aleo ZK technology.
        </Typography>
      </Stack>

      <Stack gap={2} width="100%">
        <Controller
          control={control}
          name={'address'}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField error={error} label="Aleo Address" onChange={onChange} value={value} />
          )}
        />

        <Box display="flex" mt={4}>
          <LoadingButton
            color="blue"
            loading={submitting}
            onClick={submitHandler}
            sx={{ borderRadius: 2, margin: 'auto', textTransform: 'none' }}
            variant="contained"
          >
            Submit request
          </LoadingButton>
        </Box>
      </Stack>
    </Stack>
  )
}
