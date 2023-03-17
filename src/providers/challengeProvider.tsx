import React, { useContext, useState } from 'react'

import ChallengeModal from '@/src/pagePartials/badge/challenge/ChallengeModal'

type ChallengeContextType = {
  challenge: (typeId: string, address: string) => void
}

const ChallengeContext = React.createContext<ChallengeContextType>({
  challenge: () => {
    // Empty function
  },
})

export default function ChallengeContextProvider({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [badgeTypeId, setBadgeTypeId] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  function challenge(typeId: string, address: string) {
    setModalOpen(true)
    setOwnerAddress(address)
    setBadgeTypeId(typeId)
  }

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <ChallengeContext.Provider value={{ challenge }}>
      {modalOpen && (
        <ChallengeModal
          badgeTypeId={badgeTypeId}
          onClose={handleClose}
          open={modalOpen}
          ownerAddress={ownerAddress}
        />
      )}
      {children}
    </ChallengeContext.Provider>
  )
}

export const useChallengeProvider = () => useContext(ChallengeContext)
