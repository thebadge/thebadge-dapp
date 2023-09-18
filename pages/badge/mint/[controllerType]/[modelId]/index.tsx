import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect } from 'react'

import MintKlerosBadgeModel from '@/pages/badge/mint/[controllerType]/[modelId]/mintKleros'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useControllerTypeParam from '@/src/hooks/nextjs/useControllerTypeParam'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useTransaction, { TransactionStates } from '@/src/hooks/useTransaction'
import { NextPageWithLayout } from '@/types/next'

const MintBadgeModel: NextPageWithLayout = () => {
  const { state } = useTransaction()
  const router = useRouter()
  const badgeModelId = useModelIdParam()
  const controllerType = useControllerTypeParam()
  console.log('model id', badgeModelId, 'type', controllerType)

  if (!badgeModelId) {
    throw `No modelId provided as URL query param`
  }

  if (!controllerType) {
    throw `No controllerType provided as URL query param`
  }

  useEffect(() => {
    // Redirect to the profile
    if (state === TransactionStates.success) {
      router.push(`/profile`)
    }
  }, [router, state])

  switch (controllerType.toLowerCase()) {
    case 'kleros': {
      return <MintKlerosBadgeModel />
    }
    case 'thirdparty': {
      return <div>third party</div>
    }
    default: {
      throw `Route does not exists`
    }
  }
}

export default withPageGenericSuspense(MintBadgeModel)
