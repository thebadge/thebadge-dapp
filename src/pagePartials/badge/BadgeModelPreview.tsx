import * as React from 'react'

import { BadgePreview, BadgePreviewProps } from 'thebadge-ui-library'

import useS3Metadata from '@/src/hooks/useS3Metadata'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BackendFileResponse } from '@/types/utils'

type Props = {
  metadata?: string
  size?: BadgePreviewProps['size']
}

function BadgeModelPreview({ metadata, size = 'medium' }: Props) {
  const res = useS3Metadata<{ content: BadgeModelMetadata<BackendFileResponse> }>(metadata || '')
  console.log({ res })
  const badgeMetadata = res.data?.content

  if (res.error) return <div>error</div>

  return (
    <BadgePreview
      animationEffects={['wobble', 'grow', 'glare']}
      animationOnHover
      badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
      badgeUrl="https://www.thebadge.xyz"
      category={badgeMetadata?.name}
      description={badgeMetadata?.description}
      imageUrl={badgeMetadata?.image.s3Url}
      size={size}
      textContrast="light-withTextBackground"
    />
  )
}

export default BadgeModelPreview
