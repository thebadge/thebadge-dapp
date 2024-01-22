import React from 'react'

import { Box, alpha, styled } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { useFormContext } from 'react-hook-form'

import { BADGE_MODEL_TEXT_CONTRAST, getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import { useAvailableBackgrounds } from '@/src/hooks/useAvailableBackgrounds'
import { CustomFieldsConfigurationSchemaType } from '@/src/pagePartials/badge/model/schema/CommonSchemas'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'
const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function BadgeClassicCreationPreview() {
  const { watch } = useFormContext<
    CreateCommunityModelSchemaType & CustomFieldsConfigurationSchemaType
  >()
  const { address, readOnlyChainId } = useWeb3Connection()
  const availableBackgroundsData = useAvailableBackgrounds(readOnlyChainId, address)
  const modelBackgrounds = availableBackgroundsData.data?.modelBackgrounds

  // If custom fields are enabled, we need to show on the Badge Preview the badgeTitle and badgeDescription
  const watchedName = watch('name') || 'Security Certificate'
  const watchedDescription =
    watch('description') ||
    'This badges certifies that the address that has it complies with the regulations about...'

  // Classic Badge Configs
  const watchedLogoUri = watch('badgeModelLogoUri')
  const watchedTextContrast = watch('textContrast')
  const watchedBackground = watch('backgroundImage')
  const watchedMiniLogoTitle = watch('miniLogo.miniLogoTitle')
  const watchedMiniLogoSubtitle = watch('miniLogo.miniLogoSubTitle')
  const watchedMiniLogoUrl = watch('miniLogo.miniLogoUrl')

  return (
    <BoxShadow>
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(watchedBackground, modelBackgrounds)}
        badgeUrl="https://www.thebadge.xyz"
        description={watchedDescription}
        imageUrl={watchedLogoUri?.base64File}
        miniLogoSubTitle={watchedMiniLogoSubtitle}
        miniLogoTitle={watchedMiniLogoTitle}
        miniLogoUrl={watchedMiniLogoUrl?.base64File}
        size="medium"
        textContrast={BADGE_MODEL_TEXT_CONTRAST[watchedTextContrast]}
        title={watchedName}
      />
    </BoxShadow>
  )
}
