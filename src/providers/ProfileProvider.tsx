import React, { useCallback, useContext } from 'react'

import useActionObserver, { ActionObserver } from '@/src/hooks/useActionObserver'

type ProfileContextType = {
  refreshWatcher: ActionObserver
  refreshTrigger: () => Promise<void>
}

const ProfileContext = React.createContext<ProfileContextType>({
  refreshTrigger: async () => {
    // Empty function
  },
  refreshWatcher: 0,
})

export default function ProfileContextProvider({ children }: { children: React.ReactNode }) {
  const { trigger, watch: refreshWatcher } = useActionObserver()

  const refreshTrigger = useCallback(async () => {
    trigger()
  }, [trigger])

  return (
    <ProfileContext.Provider value={{ refreshWatcher, refreshTrigger }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileProvider = () => useContext(ProfileContext)
