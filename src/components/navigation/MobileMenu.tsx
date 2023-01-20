import { DOMAttributes } from 'react'

import { styled } from '@mui/material'

// import { useTranslations } from 'next-intl'

// import { ContainerPadding } from '@/src/components/helpers/ContainerPadding'
import { NavLink as BaseNavLink } from '@/src/components/navigation/NavLink'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled('div')(({ theme }) => ({
  // background-color: ${({ theme }) => theme.modal.overlayColor};
  bottom: 0,
  left: 0,
  position: 'fixed',
  // top: ${({ theme }) => theme.header.height},
  width: '100vw',
  zIndex: 5,

  // @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
  //   display: none;
  // }
}))

const Menu = styled('nav')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  // @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
  //   display: none;
  // }
}))

const NavLink = styled(BaseNavLink)(({ theme }) => ({
  alignItems: 'center',
  // background-color: ${({ theme }) => theme.mobileMenu.backgroundColor};
  // border-bottom: 1px solid ${({ theme }) => theme.mobileMenu.borderColor};
  // color: ${({ theme }) => theme.mobileMenu.color};
  display: 'flex',
  fontSize: '1.4rem',
  fontWeight: 400,
  gap: '10px',
  lineHeight: '1.2',
  minHeight: '42px',
  textDecoration: 'none',
  userSelect: 'none',
  width: '100%',

  // &.active {
  //   font-weight: 700;
  // }
  //
  // &:active {
  //   opacity: 0.7;
  // }
  //
  // &:last-child {
  //   border-bottom: none;
  // }
}))

export const MobileMenu: React.FC<DOMAttributes<HTMLDivElement>> = ({ ...restProps }) => {
  // const t = useTranslations('mainMenu')
  const { address } = useWeb3Connection()

  return (
    <Wrapper {...restProps}>
      <Menu>
        <NavLink href="/">
          Home
          {/*{t('home')}*/}
        </NavLink>
        {address && (
          <NavLink href={`/profile/${address}`}>
            Profile
            {/*{t('profile')}*/}
          </NavLink>
        )}
      </Menu>
    </Wrapper>
  )
}
