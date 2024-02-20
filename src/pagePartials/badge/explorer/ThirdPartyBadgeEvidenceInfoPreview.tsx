import React, { useEffect, useState } from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { Box, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { DisplayText } from '@/src/components/displayEvidence/DisplayText'
import { notify } from '@/src/components/toast/Toast'
import { getChainIdByName } from '@/src/config/web3'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import useDecryptEmail from '@/src/hooks/theBadge/useDecryptEmail'
import useSendClaimNotificationEmail from '@/src/hooks/theBadge/useSendClaimNotificationEmail'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { ReplacementKeys, labelForReplacementKey } from '@/src/utils/enrichTextWithValues'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')
import { ToastStates } from '@/types/toast'
import { WCAddress } from '@/types/utils'

export default function ThirdPartyBadgeEvidenceInfoPreview({ badgeId }: { badgeId: string }) {
  const { t } = useTranslation()
  const badgeById = useBadgeById(badgeId)
  const badge = badgeById.data
  if (!badge) {
    throw 'There was not possible to get the needed data. Try again in some minutes.'
  }

  const { data: isClaimable } = useIsClaimable(badge.id)
  const { appChainId, isAppConnected } = useWeb3Connection()
  const { sendClaimNotificationEmail } = useSendClaimNotificationEmail()
  const submitDecryptEmail = useDecryptEmail()
  const [disableButtons, setDisableButtons] = useState(false)
  const [emailDecrypted, setEmailDecrypted] = useState<string | null>(null)

  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(badge.id)

  useEffect(() => {
    setEmailDecrypted(null)
  }, [badge.id])

  const values = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  const handleAction = async (actionFunction: any, errorMessage: string) => {
    try {
      setDisableButtons(true)
      const response = await actionFunction()

      if (!response || response.error) {
        throw new Error(response?.message)
      }

      notify({
        id: badge.createdTxHash,
        type: ToastStates.info,
        message: response.message,
        position: 'top-right',
      })
    } catch (error) {
      console.warn('Action error:', error)
      notify({
        id: badge.createdTxHash,
        type: ToastStates.infoFailed,
        message: errorMessage,
        position: 'top-right',
      })
    } finally {
      setDisableButtons(false)
    }
  }

  const sendClaimEmail = async () => {
    const actionFunction = async () =>
      sendClaimNotificationEmail(badge.createdTxHash, {
        networkId: getChainIdByName(badge.networkName).toString() || appChainId.toString(),
        badgeModelId: Number(badge.badgeModel.id),
      })

    await handleAction(actionFunction, 'Re-sending email failed!')
  }

  const viewEncryptedEmail = async () => {
    const actionFunction = async () => {
      const { error, message, result } = await submitDecryptEmail({
        networkId: appChainId.toString(),
        mintTxHash: badge.createdTxHash,
        badgeModelId: Number(badge.badgeModel.id),
      })

      if (error) {
        throw new Error(message)
      }

      setEmailDecrypted(result ? result.email : null)
      return { message }
    }

    await handleAction(actionFunction, 'Decrypting email failed!')
  }

  return (
    <Stack gap={5} p={1}>
      <Box alignContent="center" display="flex" justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} mintTxHash={badge.createdTxHash} />
        {isClaimable ? (
          <Typography color={colors.redError} mb={1} textTransform="uppercase">
            {t('badge.unclaimed')}
          </Typography>
        ) : (
          <Typography color={colors.green} mb={1} textTransform="uppercase">
            {t('badge.claimed')}
          </Typography>
        )}
      </Box>

      <Stack px={1}>
        {Object.keys(values).map((key) => {
          if (key === 'encryptedPayload') return
          const value = values[key as ReplacementKeys]
          if (!value) return
          return (
            <DisplayText
              key={key}
              label={labelForReplacementKey(key as ReplacementKeys)}
              value={value as string}
            />
          )
        })}
      </Stack>

      {/* Badge Receiver Address */}
      {isClaimable && isAppConnected ? (
        <Stack alignContent="center" display="flex" flex={1} justifyContent="space-between">
          <Typography color={colors.redError} mb={4}>
            {t('badge.thirdPartyBadgeUnclaimedText')}
          </Typography>
          <Typography mb={4} variant="dAppTitle2">
            <EmailOutlinedIcon sx={{ mr: 1 }} />
            {emailDecrypted ? emailDecrypted : t('badge.resendEmailText')}
          </Typography>
          <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
            <ButtonV2
              backgroundColor={colors.blue}
              disabled={disableButtons}
              onClick={() => viewEncryptedEmail()}
              sx={{ ml: 'auto' }}
              variant="contained"
            >
              {t('badge.viewEmailButton')}
            </ButtonV2>
            <ButtonV2
              backgroundColor={colors.green}
              disabled={disableButtons}
              onClick={() => sendClaimEmail()}
              sx={{ ml: 'auto' }}
              variant="contained"
            >
              {t('badge.resendEmailButton')}
            </ButtonV2>
          </Box>
        </Stack>
      ) : (
        <BadgeRequesterPreview ownerAddress={badge.account.id as WCAddress} />
      )}
    </Stack>
  )
}
