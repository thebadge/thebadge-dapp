import React, { ReactElement, useEffect, useState } from 'react'

import { styled } from '@mui/material'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useClaimUUIDParam from '@/src/hooks/nextjs/useClaimUUIDParam'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import ClaimUUIDIsInvalid from '@/src/pagePartials/errors/displays/ClaimUUIDIsInvalid'
import { checkClaimUUIDValid } from '@/src/utils/relayTx'
import { Creator } from '@/types/badges/Creator'

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
}

export const PreventActionIfClaimUUIDInvalid: React.FC<Props> = ({ children, minHeight }) => {
  const [isClaimUUIDValid, setIsClaimUUIDValid] = useState(false)
  const claimUUID = useClaimUUIDParam()

  useEffect(() => {
    const checkInvalidUUID = async () => {
      const result = await checkClaimUUIDValid(claimUUID)
      setIsClaimUUIDValid(result)
    }
    checkInvalidUUID()
  }, [claimUUID])

  const modelId = useModelIdParam()
  const badgeModelData = useBadgeModel(modelId)

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata || !badgeModelData) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  if (!isClaimUUIDValid) {
    return (
      <Wrapper style={{ minHeight }}>
        <ClaimUUIDIsInvalid
          creatorContact={`mailto:${badgeCreatorMetadata.data?.content?.email}`}
        />
      </Wrapper>
    )
  }

  return <SafeSuspense>{children}</SafeSuspense>
}
