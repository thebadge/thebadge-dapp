import React from 'react'

import { Box, alpha, styled } from '@mui/material'
import { BadgePreview } from '@thebadge/ui-library'
import { useFormContext } from 'react-hook-form'

import { BADGE_MODEL_TEXT_CONTRAST, getBackgroundBadgeUrl } from '@/src/constants/backgrounds'
import { CreateCommunityModelSchemaType } from '@/src/pagePartials/badge/model/schema/CreateCommunityModelSchema'

const BoxShadow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  filter: `drop-shadow(0px 0px 15px ${alpha(theme.palette.text.primary, 0.3)})`,
}))

export default function BadgeClassicCreationPreview() {
  const { watch } = useFormContext<CreateCommunityModelSchemaType>()

  const watchedName = watch('name') || 'Security Certificate'
  const watchedDescription =
    watch('description') ||
    'This badges certifies that the address that has it complies with the regulations about...'

  // Classic Badge Configs
  const watchedLogoUri = watch('badgeModelLogoUri')
  const watchedTextContrast = watch('textContrast')
  const watchedBackground = watch('backgroundImage')

  return (
    <BoxShadow>
      <BadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl={getBackgroundBadgeUrl(watchedBackground)}
        badgeUrl="https://www.thebadge.xyz"
        description={watchedDescription}
        imageUrl={watchedLogoUri?.base64File}
        size="medium"
        textContrast={BADGE_MODEL_TEXT_CONTRAST[watchedTextContrast]}
        title={watchedName}
      />
    </BoxShadow>
  )
}
