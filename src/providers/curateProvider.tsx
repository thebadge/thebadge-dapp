'use client'
import React, { useCallback, useContext, useState } from 'react'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import CurateModal from '@/src/pagePartials/badge/curate/CurateModal'
import AddEvidenceModal from '@/src/pagePartials/badge/curate/addEvidence/AddEvidenceModal'
import ChallengeModal from '@/src/pagePartials/badge/curate/challenge/ChallengeModal'

type CurateContextType = {
  curate: (badgeId: string) => void
  challenge: (badgeId: string) => void
  addMoreEvidence: (badgeId: string) => void
}

const CurateContext = React.createContext<CurateContextType>({
  curate: () => {
    // Empty function
  },
  challenge: () => {
    // Empty function
  },
  addMoreEvidence: () => {
    // Empty function
  },
})

export default function CurateContextProvider({ children }: { children: React.ReactNode }) {
  const [curateModalOpen, setCurateModalOpen] = useState(false)
  const [addEvidenceModalOpen, setAddEvidenceModalOpen] = useState(false)
  const [challengeModalOpen, setChallengeModalOpen] = useState(false)

  const [badgeId, setBadgeId] = useState('')

  const challenge = useCallback((badgeId: string) => {
    setChallengeModalOpen(true)
    setBadgeId(badgeId)
  }, [])

  const addMoreEvidence = useCallback((badgeId: string) => {
    setAddEvidenceModalOpen(true)
    setBadgeId(badgeId)
  }, [])

  const handleCloseChallenge = useCallback(() => {
    setChallengeModalOpen(false)
  }, [])

  const curate = useCallback((badgeId: string) => {
    setCurateModalOpen(true)
    setBadgeId(badgeId)
  }, [])

  const handleCloseCurate = useCallback(() => {
    setCurateModalOpen(false)
  }, [])

  const handleCloseAddEvidence = useCallback(() => {
    setAddEvidenceModalOpen(false)
  }, [])

  return (
    <CurateContext.Provider value={{ curate, challenge, addMoreEvidence }}>
      {/* We don't want to have a loading spinner for these modals that are not even open - Just to be safe about errors */}
      <SafeSuspense fallback={<></>}>
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
        {addEvidenceModalOpen && (
          <AddEvidenceModal
            badgeId={badgeId}
            onClose={handleCloseAddEvidence}
            open={addEvidenceModalOpen}
          />
        )}
      </SafeSuspense>
      {children}
    </CurateContext.Provider>
  )
}

export const useCurateProvider = () => useContext(CurateContext)
