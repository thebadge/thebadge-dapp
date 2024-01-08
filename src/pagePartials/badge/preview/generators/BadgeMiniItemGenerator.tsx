import React from 'react'

import { Stack, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import BadgeMiniPreview from '@/src/pagePartials/badge/miniPreview/BadgeMiniPreview'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { BadgeModelControllerType, BadgeModelTemplate } from '@/types/badges/BadgeModel'

const BadgeContainer = styled(Stack)(() => ({
  cursor: 'pointer',
  flex: 1,
  justifyContent: 'center',
  display: 'flex',
  alignSelf: 'center',
  alignItems: 'center',
}))

type BadgeItemProps = {
  badgeId: string
  onClick: VoidFunction
}

export default function BadgeMiniItemGenerator({ badgeId, onClick }: BadgeItemProps) {
  // Safeguard to use the contract in the url
  // If this hooks run under a page that has the "contract" query params it must use it
  const { contract } = useBadgeIdParam()
  const badgeById = useBadgeById(badgeId, contract)

  const badge = badgeById.data
  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }
  const modelId = badge.badgeModel.id
  const isThirdParty =
    badge.badgeModel.controllerType.toLowerCase() ===
    BadgeModelControllerType.ThirdParty.toLowerCase()

  const template = useBadgeModelTemplate(modelId, contract)

  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(
    `${badge.id}` || '',
    badge?.contractAddress,
    { skip: !isThirdParty },
  )
  const additionalData = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  if (template === BadgeModelTemplate.Diploma) {
    // TODO Add diploma DiplomaMiniPreview
  }

  return (
    <BadgeContainer onClick={onClick}>
      <SafeSuspense fallback={<BadgePreviewLoading />}>
        <BadgeMiniPreview
          additionalData={additionalData}
          badgeModelMetadata={badge.badgeModel.uri}
          disableAnimations
          highlightColor={colors.green}
          onClick={onClick}
        />
      </SafeSuspense>
    </BadgeContainer>
  )
}
