import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'

import AlreadyOwnThisBadgeErrorModal from '@/src/pagePartials/errors/AlreadyOwnThisBadgeError'
import ConnectWalletErrorModal from '@/src/pagePartials/errors/ConnectWalletError'

type ErrorsContextType = {
  connectWalletError: () => void
  connectWalletErrorSolved: () => void
  alreadyOwnBadgeError: () => void
}

const ErrorsContext = React.createContext<ErrorsContextType>({
  connectWalletError: () => {
    // Empty function
  },
  connectWalletErrorSolved: () => {
    // Empty function
  },
  alreadyOwnBadgeError: () => {
    // Empty function
  },
})

export default function ErrorsContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [walletErrorOpen, setWalletErrorOpen] = useState(false)
  const [alreadyOwnBadgeOpen, setOwnBadgeOpen] = useState(false)

  function handleCloseWalletError() {
    router.push('/')
    connectWalletErrorSolved()
  }
  function connectWalletErrorSolved() {
    setWalletErrorOpen(false)
  }
  function connectWalletError() {
    setWalletErrorOpen(true)
  }

  function alreadyOwnBadgeError() {
    setOwnBadgeOpen(true)
  }
  function handleOwnBadgeError() {
    setOwnBadgeOpen(false)
  }

  return (
    <ErrorsContext.Provider
      value={{ connectWalletError, connectWalletErrorSolved, alreadyOwnBadgeError }}
    >
      {walletErrorOpen && (
        <ConnectWalletErrorModal onClose={handleCloseWalletError} open={walletErrorOpen} />
      )}
      {alreadyOwnBadgeOpen && (
        <AlreadyOwnThisBadgeErrorModal onClose={handleOwnBadgeError} open={alreadyOwnBadgeOpen} />
      )}
      {children}
    </ErrorsContext.Provider>
  )
}

export const useErrorsProvider = () => useContext(ErrorsContext)
