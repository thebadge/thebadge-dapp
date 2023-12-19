import React, { ReactElement, useEffect, useState } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useClaimParams from '@/src/hooks/nextjs/useClaimParams'
import ClaimUUIDIsInvalid from '@/src/pagePartials/errors/displays/ClaimUUIDIsInvalid'
import { checkClaimUUIDValid } from '@/src/utils/relayTx'

const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

type Props = {
  children: ReactElement
  minHeight?: number
  creatorEmail: string
}

export const PreventActionIfClaimUUIDInvalid: React.FC<Props> = ({
  children,
  creatorEmail,
  minHeight,
}) => {
  const [isClaimUUIDValid, setIsClaimUUIDValid] = useState(false)
  const { claimUUID } = useClaimParams()

  useEffect(() => {
    const checkInvalidUUID = async () => {
      const result = await checkClaimUUIDValid(claimUUID)
      setIsClaimUUIDValid(result)
    }
    checkInvalidUUID()
  }, [claimUUID])

  if (!isClaimUUIDValid) {
    return (
      <Wrapper style={{ minHeight }}>
        <ClaimUUIDIsInvalid creatorContact={`mailto:${creatorEmail}`} />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
