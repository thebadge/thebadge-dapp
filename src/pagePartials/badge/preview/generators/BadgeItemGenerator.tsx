import React from 'react'

import { Skeleton, Stack, Typography, styled } from '@mui/material'

import { BadgePreviewLoading } from '@/src/components/common/BadgePreviewContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { getChainIdByName } from '@/src/config/web3'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeThirdPartyRequiredData } from '@/src/hooks/subgraph/useBadgeModelThirdPartyMetadata'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import { BadgeView } from '@/src/pagePartials/badge/preview/BadgeView'
import DiplomaView from '@/src/pagePartials/badge/preview/DiplomaView'
import { reCreateThirdPartyValuesObject } from '@/src/utils/badges/mintHelpers'
import { capitalizeFirstLetter } from '@/src/utils/strings'
import { BadgeModelControllerType, BadgeModelTemplate } from '@/types/badges/BadgeModel'

const DiplomaContainer = styled(Stack)(({ theme }) => ({
  cursor: 'pointer',
  justifyContent: 'center',
  display: 'flex',
  alignSelf: 'center',
  flexBasis: '45%',
  flexGrow: 1,
  boxSizing: 'border-box',
  [theme.breakpoints.up(1140)]: {
    maxWidth: '48%',
  },
  [theme.breakpoints.down(1040)]: {
    alignItems: 'center',
  },
}))

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

  badgeContractAddress?: string
  badgeNetworkName?: string
}

export default function BadgeItemGenerator({
  badgeContractAddress,
  badgeId,
  badgeNetworkName,
  onClick,
}: BadgeItemProps) {
  // Safeguard to use the contract in the url
  // If this hooks run under a page that has the "contract" query params it must use it
  const { contract } = useBadgeIdParam()
  // If there is a networkName provided, we fetch the badge from there using the contractAddress
  // This information is available on the own subGraph
  const badgeContract = badgeNetworkName
    ? `${getChainIdByName(badgeNetworkName)}:${badgeContractAddress}`
    : undefined

  const badgeById = useBadgeById(badgeId, badgeContract || contract)

  const badge = badgeById.data
  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }
  const modelId = badge.badgeModel.id
  const isThirdParty =
    badge.badgeModel.controllerType.toLowerCase() ===
    BadgeModelControllerType.ThirdParty.toLowerCase()

  const template = useBadgeModelTemplate(modelId, badgeContract || contract)
  const badgeUrl = badge.badgeMetadata.external_link
  const requiredBadgeDataMetadata = useBadgeThirdPartyRequiredData(
    `${badge.id}` || '',
    badgeContract || contract,
    {
      skip: !isThirdParty,
    },
  )

  const additionalData = reCreateThirdPartyValuesObject(
    requiredBadgeDataMetadata.data?.requirementsDataValues || {},
    requiredBadgeDataMetadata.data?.requirementsDataColumns,
  )

  if (template === BadgeModelTemplate.Diploma) {
    return (
      <DiplomaContainer onClick={onClick}>
        <SafeSuspense
          fallback={
            <Skeleton
              animation="wave"
              height={400}
              sx={{ m: 'auto' }}
              variant="rounded"
              width={625}
            />
          }
        >
          {badgeNetworkName && (
            <Typography ml={2} textAlign="left" variant="labelLarge">
              Network: <strong>{capitalizeFirstLetter(badgeNetworkName)}</strong>
            </Typography>
          )}
          <DiplomaView
            additionalData={additionalData}
            badgeContractAddress={badgeContractAddress}
            badgeNetworkName={badgeNetworkName}
            badgeUrl={badgeUrl}
            modelId={modelId}
          />
        </SafeSuspense>
      </DiplomaContainer>
    )
  }

  return (
    <BadgeContainer onClick={onClick}>
      <SafeSuspense fallback={<BadgePreviewLoading />}>
        {badgeNetworkName && (
          <Typography textAlign="left" variant="labelLarge">
            Network: <strong>{capitalizeFirstLetter(badgeNetworkName)}</strong>
          </Typography>
        )}
        <Stack m="10px">
          <BadgeView
            additionalData={additionalData}
            badgeContractAddress={badgeContractAddress}
            badgeNetworkName={badgeNetworkName}
            badgeUrl={badgeUrl}
            modelId={modelId}
            size={'small'}
          />
        </Stack>
      </SafeSuspense>
    </BadgeContainer>
  )
}
