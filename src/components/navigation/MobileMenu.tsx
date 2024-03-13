import { useRouter } from 'next/router'
import React, { useState } from 'react'

import RadarIcon from '@mui/icons-material/Radar'
import { IconButton, Stack, styled } from '@mui/material'
import { useWeb3Modal } from '@web3modal/wagmi/react'

import { useMainMenuItems } from '@/src/components/navigation/MainMenu.config'
import { MenuItem, SubMenuItem } from '@/src/components/navigation/MainMenu.types'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { generateBaseUrl } from '@/src/utils/navigation/generateUrl'

const MenuContainer = styled(Stack)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  gap: theme.spacing(2),
  display: 'flex',
  flexDirection: 'row',
  zIndex: 1,
  width: '100svw',
  alignItems: 'center',
  backgroundColor: '#000000',
  filter: 'drop-shadow(0px 3px 5px white)',
  justifyContent: 'space-evenly',
}))

export default function MobileMenu() {
  const router = useRouter()
  const { open: openWeb3Modal } = useWeb3Modal()
  const { scrollTo } = useSectionReferences()

  const [selectedElement, setSelectedElement] = useState(-1)
  const { bottomMenuItems, topMenuItems } = useMainMenuItems()

  const navigateTo = async (link: any, openInNewTab?: boolean) => {
    if (link) {
      if (link.current) {
        scrollTo(generateBaseUrl(), link)
      } else {
        if (openInNewTab) {
          window.open(link)
        } else {
          await router.push(link)
        }
      }
    }
  }
  const onItemClick = async (item: MenuItem | SubMenuItem) => {
    if (item.href) {
      await navigateTo(item.href, item.openLinkInNewTab)

      if (!item.subItems) {
        // close after click if no subItems opening
        setTimeout(() => setSelectedElement(-1), 300)
      }
    }
    if (item.customOnClickBehavior) {
      item.customOnClickBehavior()
    }
  }

  const toggleSelectedElement = (index: number) => {
    if (selectedElement === index) {
      setSelectedElement(-1) // unselect
    } else {
      setSelectedElement(index) // select
    }
  }

  const onMenuItemClick = async (item: MenuItem, index: number) => {
    toggleSelectedElement(index)
    if (!item.subItems || item.subItems.length === 0) {
      await onItemClick(item)
    }
  }

  const toggleNetworkChange = () => {
    openWeb3Modal({ view: 'Networks' })
  }

  return (
    <MenuContainer>
      {topMenuItems.map((item, i) => (
        <IconButton key={i} onClick={() => onMenuItemClick(item, i)} sx={{ width: '52px' }}>
          {item.icon}
        </IconButton>
      ))}
      <IconButton onClick={toggleNetworkChange} sx={{ width: '52px' }}>
        <RadarIcon />
      </IconButton>
    </MenuContainer>
  )
}
