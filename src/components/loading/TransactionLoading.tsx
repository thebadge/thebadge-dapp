import { DOMAttributes, HTMLAttributes } from 'react'

import { Box, Typography, styled } from '@mui/material'
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
}
export const TransactionLoading: React.FC<Props> = ({ state, ...restProps }) => {
  const { t } = useTranslation()

  function renderState(state: TransactionStates) {
    switch (state) {
      case TransactionStates.none:
        return null
      case TransactionStates.waitingSignature:
        return (
          <>
            <Typography variant="dAppTitle1">{t('transactionLoading.signature')}</Typography>
            <LoadingArrow />
          </>
        )
      case TransactionStates.waitingMined:
        return (
          <>
            <Typography variant="dAppTitle1">{t('transactionLoading.confirmation')}</Typography>
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
          </>
        )
    }
  }

  return <Wrapper {...restProps}>{renderState(state)}</Wrapper>
}
