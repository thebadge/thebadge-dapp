import * as React from 'react'

import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import CreateCommunityBadgeModel from '@/src/pagePartials/badge/model/CreateCommunityBadgeModel'
import CreateThirdPartyBadgeModel from '@/src/pagePartials/badge/model/CreateThirdPartyBadgeModel'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { NextPageWithLayout } from '@/types/next'

const CreateBadgeModel: NextPageWithLayout = () => {
  const controllerType = useControllerTypeParam()

  if (!controllerType) {
    throw `No controllerType provided as URL query param`
  }

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
