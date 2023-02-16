import * as React from 'react'

import { BadgePreviewV2 } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'

type Props = {
  metadata?: string
}

function BadgeTypeMetadata({ metadata }: Props) {
  const res: any = useS3Metadata(metadata || '')
  const badgeMetadata = res.data.content

  return (
    <SafeSuspense>
      <BadgePreviewV2
        animationEffects={['wobble', 'grow', 'glare']}
        animationOnHover
        badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
        badgeUrl="https://www.thebadge.xyz"
        category="Badge Category"
        description={badgeMetadata.description}
        imageUrl={badgeMetadata.image.s3Url}
        size="medium"
        textContrast="light-withTextBackground"
        title={badgeMetadata.name}
      />
    </SafeSuspense>
  )
}

export default BadgeTypeMetadata
