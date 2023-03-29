import React, { useContext, useState } from 'react'

import CurateModal from '@/src/pagePartials/badge/curate/CurateModal'
import ChallengeModal from '@/src/pagePartials/badge/curate/challenge/ChallengeModal'

type CurateContextType = {
  curate: (typeId: string, address: string) => void
  challenge: (typeId: string, address: string) => void
}

const CurateContext = React.createContext<CurateContextType>({
  curate: () => {
    // Empty function
  },
  challenge: () => {
    // Empty function
  },
})

export default function CurateContextProvider({ children }: { children: React.ReactNode }) {
  const [curateModalOpen, setCurateModalOpen] = useState(false)
  const [badgeTypeId, setBadgeTypeId] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')

  const [challengeModalOpen, setChallengeModalOpen] = useState(false)
  function challenge(typeId: string, address: string) {
    setChallengeModalOpen(true)
    setOwnerAddress(address)
    setBadgeTypeId(typeId)
  }

  function handleCloseChallenge() {
    setChallengeModalOpen(false)
  }

  function curate(typeId: string, address: string) {
    setCurateModalOpen(true)
    setOwnerAddress(address)
    setBadgeTypeId(typeId)
  }

  function handleCloseCurate() {
    setCurateModalOpen(false)
  }

  return (
    <CurateContext.Provider value={{ curate, challenge }}>
      {challengeModalOpen && (
        <ChallengeModal
          badgeTypeId={badgeTypeId}
          onClose={handleCloseChallenge}
          open={challengeModalOpen}
          ownerAddress={ownerAddress}
        />
      )}
      {curateModalOpen && (
        <CurateModal
          badgeTypeId={badgeTypeId}
          onClose={handleCloseCurate}
          open={curateModalOpen}
          ownerAddress={ownerAddress}
        />
      )}
      {children}
    </CurateContext.Provider>
  )
}

export const useCurateProvider = () => useContext(CurateContext)
