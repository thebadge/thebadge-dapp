import React from 'react'

import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function ManageBadges() {
  const { address } = useWeb3Connection()

  if (!address) return null

  return <>MANAGE BADGES WIP</>
}
