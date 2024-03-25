import * as React from 'react'

import { BadgePreview } from '@thebadge/ui-library'

import { getChainIdByName, getChainLogo } from '@/src/config/web3'
import { getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import useBadgeIdParam from '@/src/hooks/nextjs/useBadgeIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { getClassicConfigs } from '@/src/utils/badges/metadataHelpers'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import { ClassicBadgeFieldsConfig } from '@/types/badges/BadgeMetadata'
import { ChainsValues } from '@/types/chains'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

type BadgePreviewGeneratorProps = {
  modelId: string
  badgeUrl?: string
  additionalData?: Record<string, any>
  size?: 'small' | 'medium' | 'large'
  chainId?: ChainsValues
  disableAnimation?: boolean
  badgeContractAddress?: string
  badgeNetworkName?: string
}

export const BadgeView = ({
  additionalData,
  badgeContractAddress,
  badgeNetworkName,
  badgeUrl,
  chainId,
  disableAnimation,
  modelId,
  size = 'medium',
}: BadgePreviewGeneratorProps) => {
  const { contract } = useBadgeIdParam()

  // If there is a networkName provided, we fetch the badge from there using the contractAddress
  // This information is available on the own subGraph
  const badgeContract = badgeNetworkName
    ? `${getChainIdByName(badgeNetworkName)}:${badgeContractAddress}`
    : undefined

  const badgeModelData = useBadgeModel(modelId, badgeContract || contract)
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata
  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const { address, readOnlyChainId } = useWeb3Connection()
  const availableBackgroundsData = useAvailableBackgrounds(readOnlyChainId, address)

  const modelBackgrounds = availableBackgroundsData.data?.modelBackgrounds

  const { backgroundType, fieldsConfigs, textContrast } = getClassicConfigs(
    badgeModelMetadata?.attributes,
  )

  const { data: fieldsConfigData } = useS3Metadata<{
    content: ClassicBadgeFieldsConfig
  }>((fieldsConfigs?.value as string) || '')

  return (
    <BadgePreview
      animationEffects={disableAnimation ? [] : ['wobble', 'grow', 'glare']}
      animationOnHover
      badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value, modelBackgrounds)}
      badgeNetworkUrl={chainId && getChainLogo(chainId)}
      badgeUrl={badgeUrl}
      category={enrichTextWithValues(badgeModelMetadata?.name, additionalData as EnrichTextValues)}
      description={enrichTextWithValues(
        badgeModelMetadata?.description,
        additionalData as EnrichTextValues,
      )}
      imageUrl={badgeLogoImage?.s3Url}
      miniLogoSubTitle={fieldsConfigData?.content.miniLogoSubTitle}
      miniLogoTitle={fieldsConfigData?.content.miniLogoTitle}
      miniLogoUrl={fieldsConfigData?.content.miniLogoUrl?.base64File}
      size={size}
      textContrast={textContrast?.value || 'light-withTextBackground'}
    />
  )
}
