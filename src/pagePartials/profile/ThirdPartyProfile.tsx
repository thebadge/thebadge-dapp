import React from 'react'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import ProfileContextProvider from '@/src/providers/ProfileProvider'

const ThirdPartyProfile = () => {
  return (
    <ProfileContextProvider>
      <SafeSuspense>WIP THIRD PARTY</SafeSuspense>
    </ProfileContextProvider>
  )
}

export default ThirdPartyProfile
