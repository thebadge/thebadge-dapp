import React, { useContext, useState } from 'react'

import CurateModal from '@/src/pagePartials/badge/curate/CurateModal'
import ChallengeModal from '@/src/pagePartials/badge/curate/challenge/ChallengeModal'

type CurateContextType = {
  curate: (badgeId: string) => void
  challenge: (badgeId: string) => void
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
  const [badgeId, setBadgeId] = useState('')

  const [challengeModalOpen, setChallengeModalOpen] = useState(false)
  function challenge(badgeId: string) {
    setChallengeModalOpen(true)
    setBadgeId(badgeId)
  }

  function handleCloseChallenge() {
    setChallengeModalOpen(false)
  }

  function curate(badgeId: string) {
    setCurateModalOpen(true)
    setBadgeId(badgeId)
  }

  function handleCloseCurate() {
    setCurateModalOpen(false)
  }

  return (
    <CurateContext.Provider value={{ curate, challenge }}>
      {challengeModalOpen && (
        <ChallengeModal
          badgeId={badgeId}
          onClose={handleCloseChallenge}
          open={challengeModalOpen}
        />
      )}
      {curateModalOpen && (
        <CurateModal badgeId={badgeId} onClose={handleCloseCurate} open={curateModalOpen} />
      )}
      {children}
    </CurateContext.Provider>
  )
}

export const useCurateProvider = () => useContext(CurateContext)
