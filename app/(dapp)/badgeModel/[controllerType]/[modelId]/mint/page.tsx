'use client'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useEffect } from 'react'

import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintKlerosBadgeModel from '@/src/pagePartials/badge/mint/MintCommunityBadgeModel'
import MintThirdPartyBadgeModel from '@/src/pagePartials/badge/mint/MintThirdPartyBadgeModel'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

export default function BadgeModelMintPage() {
  const { state } = useTransaction()
  const router = useRouter()
  const badgeModelId = useModelIdParam()
  const controllerType = useControllerTypeParam()

  if (!badgeModelId) {
    throw `No modelId provided as URL query param`
  }

  if (!controllerType) {
    throw `No controllerType provided as URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(generateProfileUrl())
    }
  }, [router, state])

  switch (controllerType.toLowerCase()) {
    case BadgeModelControllerType.Community: {
      return <MintKlerosBadgeModel />
    }
    case BadgeModelControllerType.ThirdParty: {
      return <MintThirdPartyBadgeModel />
    }
    default: {
      throw `Route does not exists`
    }
  }
}
