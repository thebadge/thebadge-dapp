import { DOMAttributes, HTMLAttributes } from 'react'

import { Box, Typography, styled } from '@mui/material'

import { LoadingArrow } from '@/src/components/loading/animated/LoadingArrow'
import { LoadingCheck } from '@/src/components/loading/animated/LoadingCheck'
import { LoadingDots } from '@/src/components/loading/animated/LoadingDots'
import { LoadingFailed } from '@/src/components/loading/animated/LoadingFailed'
import { TransactionStates } from '@/src/hooks/useTransaction'

const Wrapper = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  gap: 16px;
`

interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  state: TransactionStates
}
export const TransactionLoading: React.FC<Props> = ({ state, ...restProps }) => {
  function renderState(state: TransactionStates) {
    switch (state) {
      case TransactionStates.none:
        return null
      case TransactionStates.waitingSignature:
        return (
          <>
            <Typography variant="dAppTitle1">Waiting signature</Typography>
            <LoadingArrow />
          </>
        )
      case TransactionStates.waitingMined:
        return (
          <>
            <Typography variant="dAppTitle1">Waiting confirmation</Typography>
            <LoadingDots />
          </>
        )
      case TransactionStates.success:
        return (
          <>
            <Typography variant="dAppTitle1">Transaction done</Typography>
            <LoadingCheck />
          </>
        )
      case TransactionStates.failed:
        return (
          <>
            <Typography variant="dAppTitle1">Transaction failed</Typography>
            <LoadingFailed />
          </>
        )
    }
  }

  return <Wrapper {...restProps}>{renderState(state)}</Wrapper>
}
