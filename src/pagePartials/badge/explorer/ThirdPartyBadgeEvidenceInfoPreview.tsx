import React, { useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { notify } from '@/src/components/toast/Toast'
import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import useSendClaimEmail from '@/src/hooks/theBadge/useSendClaimEmail'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Badge } from '@/types/generated/subgraph'
import { ToastStates } from '@/types/toast'
import { WCAddress } from '@/types/utils'

export default function ThirdPartyBadgeEvidenceInfoPreview({ badge }: { badge: Badge }) {
  const { t } = useTranslation()
  const { data: isClaimable } = useIsClaimable(badge.id)
  const { appChainId, isAppConnected } = useWeb3Connection()
  const { submitSendClaimEmail } = useSendClaimEmail()
  const [disableButtons, setDisableButtons] = useState(false)

  const sendClaimEmail = async () => {
    try {
      setDisableButtons(true)
      const result = await submitSendClaimEmail({
        networkId: appChainId.toString(),
        mintTxHash: badge.createdTxHash,
        badgeModelId: Number(badge.badgeModel.id),
      })

      console.log(result)
    } catch (error) {
      console.warn('Sending email errored ', error)
      notify({
        id: badge.createdTxHash,
        type: ToastStates.infoFailed,
        message: 'Re-sending email failed!',
        position: 'bottom-right',
      })
    } finally {
      setDisableButtons(false)
    }
  }

  return (
    <Stack gap={4} p={1}>
      <Box alignContent="center" display="flex" flex={1} justifyContent="space-between">
        <BadgeIdDisplay id={badge?.id} isBadgeModel={false} mintTxHash={badge.createdTxHash} />
        {isClaimable ? (
          <Typography color={colors.redError} mb={4} textTransform="uppercase">
            {t('badge.unclaimed')}
          </Typography>
        ) : (
          <Typography color={colors.green} mb={4} textTransform="uppercase">
            {t('badge.claimed')}
          </Typography>
        )}
      </Box>

      {/* Badge Receiver Address */}
      {isClaimable && isAppConnected ? (
        <Stack alignContent="center" display="flex" flex={1} justifyContent="space-between">
          <Typography color={colors.redError} mb={4}>
            {t('badge.thirdPartyBadgeUnclaimedText')}
          </Typography>
          <ButtonV2
            backgroundColor={colors.green}
            disabled={disableButtons}
            onClick={() => sendClaimEmail()}
            sx={{ ml: 'auto' }}
            variant="contained"
          >
            {t('badge.resendEmailButton')}
          </ButtonV2>
        </Stack>
      ) : (
        <BadgeRequesterPreview ownerAddress={badge.account.id as WCAddress} />
      )}
    </Stack>
  )
}
