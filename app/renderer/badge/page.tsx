'use client'
import * as React from 'react'

import { BadgePreview } from '@thebadge/ui-library'
import 'node_modules/@thebadge/ui-library/dist/index.css'

type InjectedArgs = {
  imageUrl: string
  badgeBackgroundUrl: string
  badgeUrl: string
  name: string
  description: string
  textContrast?: string
}

// https://thebadge-dapp-git-add-renderers-thebadge.vercel.app/badge?name=asdasd&description=asdasdasd&badgeUrl=asdasdasdasd

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
