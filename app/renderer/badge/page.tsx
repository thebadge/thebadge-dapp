import * as React from 'react'

import { BadgePreview } from '@thebadge/ui-library'

type InjectedArgs = {
  imageUrl: string
  badgeBackgroundUrl: string
  badgeUrl: string
  name: string
  description: string
  textContrast?: string
}

export default async function Page({ searchParams }: { searchParams: InjectedArgs }) {
  const { badgeBackgroundUrl, badgeUrl, description, imageUrl, name, textContrast } = searchParams
  return (
    <BadgePreview
      animationEffects={[]}
      badgeBackgroundUrl={badgeBackgroundUrl}
      badgeUrl={badgeUrl}
      category={name}
      description={description}
      imageUrl={imageUrl}
      size="medium"
      textContrast={textContrast || 'light-withTextBackground'}
    />
  )
}
