import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import CreateCommunityBadgeModel from '@/src/pagePartials/badge/model/CreateCommunityBadgeModel'
import CreateThirdPartyBadgeModel from '@/src/pagePartials/badge/model/CreateThirdPartyBadgeModel'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { NextPageWithLayout } from '@/types/next'

const CreateBadgeModel: NextPageWithLayout = () => {
  const { state } = useTransaction()
  const router = useRouter()
  const controllerType = useControllerTypeParam()

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
    case BadgeModelControllerType.Community.toLowerCase(): {
      return <CreateCommunityBadgeModel />
    }
    case BadgeModelControllerType.ThirdParty.toLowerCase(): {
      return <CreateThirdPartyBadgeModel />
    }
    default: {
      throw `Route does not exists`
    }
  }
}

export default withPageGenericSuspense(CreateBadgeModel)
