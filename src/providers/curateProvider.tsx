import React, { useContext, useState } from 'react'

import CurateModal from '@/src/pagePartials/badge/curate/CurateModal'

type CurateContextType = {
  curate: (typeId: string, address: string) => void
}

const CurateContext = React.createContext<CurateContextType>({
  curate: () => {
    // Empty function
  },
})

export default function CurateContextProvider({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [badgeTypeId, setBadgeTypeId] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  function curate(typeId: string, address: string) {
    setModalOpen(true)
    setOwnerAddress(address)
    setBadgeTypeId(typeId)
  }

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <CurateContext.Provider value={{ curate }}>
      {modalOpen && (
        <CurateModal
          badgeTypeId={badgeTypeId}
          onClose={handleClose}
          open={modalOpen}
          ownerAddress={ownerAddress}
        />
      )}
      {children}
    </CurateContext.Provider>
  )
}

export const useCurateProvider = () => useContext(CurateContext)
