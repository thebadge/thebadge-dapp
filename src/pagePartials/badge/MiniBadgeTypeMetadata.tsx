import * as React from 'react'

import { MiniBadgePreview, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useColorMode } from '@/src/providers/themeProvider'

type Props = {
  metadata?: string
  highlightColor?: string
}

function MiniBadgeTypeMetadata({ highlightColor, metadata }: Props) {
  const res: any = useS3Metadata(metadata || '')
  const { mode } = useColorMode()
  const badgeMetadata = res.data.content

  return (
    <SafeSuspense>
      <MiniBadgePreview
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
        category="Badge Category"
        description={badgeMetadata.description}
        highlightColor={highlightColor || (mode === 'light' ? colors.blackText : colors.white)}
        textContrast="light-withTextBackground"
        textContrastOutside={mode}
        title={badgeMetadata.name}
      />
    </SafeSuspense>
  )
}

export default MiniBadgeTypeMetadata
