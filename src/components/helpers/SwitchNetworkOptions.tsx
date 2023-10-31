import React from 'react'

import { List, ListItemButton, ListItemText } from '@mui/material'

import { chainsConfig } from '@/src/config/web3'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export const SwitchNetworkOptions: React.FC = () => {
  const { appChainId, pushNetwork } = useWeb3Connection()
  const chainOptions = Object.values(chainsConfig)

  return (
    <List component="div" disablePadding>
      {chainOptions.map((item, index) => (
        <ListItemButton
          dense
          key={index}
          onClick={() => {
            pushNetwork({ chainId: item.chainIdHex })
          }}
          selected={appChainId === item.chainId}
          sx={{ pl: 4 }}
        >
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </List>
  )
}
