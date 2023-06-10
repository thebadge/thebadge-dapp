import * as React from 'react'

import { IconBadge, MiniBadgePreview, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useColorMode } from '@/src/providers/themeProvider'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  highlightColor?: string
  disableAnimations?: boolean
  onClick?: () => void
  buttonTitle?: string
}

function MiniBadgeModelPreview({
  buttonTitle,
  disableAnimations,
  highlightColor,
  metadata,
  onClick,
}: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '')
  const { mode } = useColorMode()
  const badgeMetadata = res.data?.content

  return (
    <SafeSuspense>
      <MiniBadgePreview
        animationEffects={!disableAnimations ? ['wobble', 'grow', 'glare'] : []}
        animationOnHover
        badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
        buttonTitle={buttonTitle}
        description={badgeMetadata?.description}
        height={'50px'}
        highlightColor={highlightColor || (mode === 'light' ? colors.blackText : colors.white)}
        imageUrl={badgeMetadata?.image.s3Url}
        miniIcon={<IconBadge color={colors.white} height={25} width={25} />}
        onClick={onClick}
        textContrast="light-withTextBackground"
        textContrastOutside={mode}
        title={badgeMetadata?.name}
      />
    </SafeSuspense>
  )
}

export default MiniBadgeModelPreview
