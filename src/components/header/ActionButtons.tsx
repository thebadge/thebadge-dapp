import { useRouter } from 'next/router'
import React, { RefObject, useState } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, Button, Menu, MenuItem, Tooltip, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import useIsThirdPartyUser from '@/src/hooks/theBadge/useIsThirdPartyUser'
import { useSectionReferences } from '@/src/providers/referencesProvider'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import {
  generateBadgeCurate,
  generateBadgeExplorer,
  generateBadgeModelCreate,
  generateCreatorRegisterUrl,
} from '@/src/utils/navigation/generateUrl'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'

const StyledButton = styled(Button)<{ border?: string }>(({ border }) => ({
  color: 'white',
  border,
  borderRadius: '10px',
  fontSize: '14px !important',
  padding: '0.5rem 1rem !important',
  height: 'fit-content !important',
  lineHeight: '14px',
  fontWeight: 700,
  boxShadow: 'none',
}))

type ButtonWithMenuProps = {
  title: string
  disabled: boolean
  color: string
  menuItems: { title: string; href: string }[]
}

const ButtonWithMenu = ({ color, disabled, menuItems, title }: ButtonWithMenuProps) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (menuItem: { title: string; href: string }) => {
    setAnchorEl(null)
    if (menuItem.href) {
      router.push(menuItem.href)
    }
  }

  return (
    <div>
      <StyledButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        border={`2px solid ${color}`}
        disabled={disabled}
        endIcon={<KeyboardArrowDownIcon />}
        id="create-menu-button"
        onClick={handleClick}
      >
        {title}
      </StyledButton>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorEl={anchorEl}
        id="create-menu"
        onClose={handleClose}
        open={open}
      >
        {menuItems.map((item, index) => {
          return (
            <MenuItem key={index} onClick={() => handleClose(item)}>
              {item.title}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}

export default function ActionButtons() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const { address: connectedWalletAddress, isWalletConnected } = useWeb3Connection()
  const isThirdPartyUser = useIsThirdPartyUser(connectedWalletAddress)
  const router = useRouter()
  const { scrollTo } = useSectionReferences()

  const menuButton = ({
    color,
    disabled,
    menuItems,
    path,
    ref,
    title,
  }: {
    title: string
    color: string
    disabled: boolean
    path: string
    ref?: RefObject<HTMLDivElement> | null
    menuItems?: { title: string; href: string }[]
  }) => {
    if (!menuItems) {
      return (
        <StyledButton
          border={`2px solid ${color}`}
          disabled={disabled}
          onClick={() => {
            scrollTo(path, ref || null)
          }}
        >
          {title}
        </StyledButton>
      )
    }
    return <ButtonWithMenu color={color} disabled={disabled} menuItems={menuItems} title={title} />
  }
  const exploreButton = menuButton({
    title: t('header.buttons.mint'),
    color: colors.blue,
    disabled: false,
    path: generateBadgeExplorer(),
  })
  const curateButton = menuButton({
    title: t('header.buttons.curate'),
    color: colors.greenLogo,
    disabled: false,
    path: generateBadgeCurate(),
  })
  const createButton = menuButton({
    title: t('header.buttons.create'),
    color: colors.pink,
    disabled: isWalletConnected && !user?.isCreator,
    path: generateBadgeModelCreate(),
    menuItems: isThirdPartyUser
      ? [
          {
            title: t('header.buttons.menu.community'),
            href: generateBadgeModelCreate(BadgeModelControllerType.Community),
          },
          {
            title: t('header.buttons.menu.thirdParty'),
            href: generateBadgeModelCreate(BadgeModelControllerType.ThirdParty),
          },
        ]
      : undefined,
  })

  return (
    <Box
      alignItems="center"
      display="flex"
      flex={1}
      justifyContent="space-between"
      sx={{ columnGap: '10px' }}
    >
      {exploreButton}
      {curateButton}

      {isWalletConnected && !user?.isCreator ? (
        <Tooltip
          arrow
          title={
            <>
              {t('header.tooltips.becomeACreator.prefixText')}
              <Box
                onClick={() => router.push(generateCreatorRegisterUrl())}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('header.tooltips.becomeACreator.link')}
              </Box>
            </>
          }
        >
          <span>{createButton}</span>
        </Tooltip>
      ) : (
        createButton
      )}
    </Box>
  )
}
