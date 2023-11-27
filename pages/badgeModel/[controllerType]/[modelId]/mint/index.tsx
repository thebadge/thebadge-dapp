import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import MintKlerosBadgeModel from '@/src/pagePartials/badge/mint/MintCommunityBadgeModel'
import MintThirdPartyBadgeModel from '@/src/pagePartials/badge/mint/MintThirdPartyBadgeModel'
import { ProfileType } from '@/src/pagePartials/profile/ProfileSelector'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { NextPageWithLayout } from '@/types/next'

const MintBadgeModel: NextPageWithLayout = () => {
  const { state } = useTransaction()
  const router = useRouter()
  const { badgeModelId } = useModelIdParam()
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
      router.push(generateProfileUrl({ profileType: ProfileType.USER_PROFILE }))
    }
  }, [router, state])

  switch (controllerType.toLowerCase()) {
    case BadgeModelControllerType.Community.toLowerCase(): {
      return <MintKlerosBadgeModel />
    }
    case BadgeModelControllerType.ThirdParty.toLowerCase(): {
      return <MintThirdPartyBadgeModel />
    }
    default: {
      throw `Route does not exists`
    }
  }
}

export default withPageGenericSuspense(MintBadgeModel)
