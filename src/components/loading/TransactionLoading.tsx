import React, { DOMAttributes, HTMLAttributes } from 'react'

import { Box, Typography, styled } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { LoadingArrow } from '@/src/components/loading/animated/LoadingArrow'
import { LoadingCheck } from '@/src/components/loading/animated/LoadingCheck'
import { LoadingDots } from '@/src/components/loading/animated/LoadingDots'
import { LoadingFailed } from '@/src/components/loading/animated/LoadingFailed'
import { TransactionStates } from '@/src/hooks/useTransaction'

const Wrapper = styled(Box)`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin: 1rem;
  gap: 1rem;
`

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  state: TransactionStates
  resetTxState?: VoidFunction
}

export const TransactionLoading: React.FC<Props> = ({ resetTxState, state, ...restProps }) => {
  const { t } = useTranslation()

  function renderState(state: TransactionStates) {
    switch (state) {
      case TransactionStates.none:
        return null
      case TransactionStates.waitingSignature:
        return (
          <>
            <Typography variant="dAppTitle1">{t('transactionLoading.signature')}</Typography>
            <Typography variant="labelMedium">
              {t('transactionLoading.bePatientSignature')}
            </Typography>
            <LoadingArrow />
          </>
        )
      case TransactionStates.waitingMined:
        return (
          <>
            <Typography variant="dAppTitle1">{t('transactionLoading.confirmation')}</Typography>
            <Typography variant="labelMedium">
              {t('transactionLoading.bePatientConfirmation')}
            </Typography>
            <LoadingDots />
          </>
        )
      case TransactionStates.success:
        return (
          <>
            <Typography variant="dAppTitle1">{t('transactionLoading.done')}</Typography>
            <LoadingCheck />
          </>
        )
      case TransactionStates.failed:
        return (
          <>
            <Typography variant="dAppTitle1">{t('transactionLoading.failed')}</Typography>
            <LoadingFailed />
            {resetTxState && (
              <ButtonV2
                backgroundColor={colors.transparent}
                fontColor={colors.green}
                onClick={resetTxState}
              >
                <Typography>Try again</Typography>
              </ButtonV2>
            )}
          </>
        )
    }
  }

  return <Wrapper {...restProps}>{renderState(state)}</Wrapper>
}
