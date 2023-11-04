import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingButton } from '@mui/lab'
import { Box, Link, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { BadgeAnimatedLogo } from '@/src/components/assets/animated/BadgeAnimatedLogo'
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
  const [txHash, setTxHash] = useState('')

  return (
    <TBModal closeButtonAriaLabel="Close curate modal" onClose={onClose} open={open}>
      {open && !txHash && (
        <ZKModalContent
          badgeId={badgeId}
          badgeModelId={badgeModelId}
          onClose={onClose}
          onFinish={setTxHash}
        />
      )}
      {open && txHash && <ZModalSucceed />}
    </TBModal>
  )
}

function ZKModalContent({
  badgeModelId,
  onClose,
  onFinish,
}: {
  badgeId: string
  badgeModelId: string
  onClose: () => void
  onFinish: (txHash: string) => void
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
          const aleoTxHash = await sendRelayTx({
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

          onFinish(aleoTxHash)

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

        <Typography color={colors.white} textAlign="center" variant="titleSmall">
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

function ZModalSucceed({ txHash }) {
  function aleoExplorerUrl(txHash: string) {
    return `https://explorer.aleo.org/transaction/${txHash}?tab=overview`
  }

  return (
    <Stack
      sx={{
        alignItems: 'center',
        width: '100%',
        gap: 6,
      }}
    >
      <Stack gap={4}>
        <Stack alignContent="center" gap={2}>
          <Typography
            color={colors.green}
            id="modal-modal-title"
            textAlign="center"
            variant="headlineLarge"
          >
            ZK Badge on ALEO
          </Typography>

          <Typography color={colors.white} textAlign="center" variant="titleSmall">
            Your ZK Badge is ready on Aleo. Check the following link to Aleo explorer to see the
            transaction details
          </Typography>

          <Box m="auto">
            <BadgeAnimatedLogo />
          </Box>
        </Stack>

        <Link
          color="primary"
          href={aleoExplorerUrl(txHash)}
          sx={{ cursor: 'pointer', width: 'fit-content', margin: 'auto' }}
          target="_blank"
          underline="hover"
        >
          Go to Aleo Explorer
        </Link>
      </Stack>
    </Stack>
  )
}
