'use client'
import Link from 'next/link'

import { styled } from '@mui/material'
import { LogoTheBadgeWithText, colors } from '@thebadge/ui-library'

import { Logo as BaseLogoSVG } from '@/src/components/assets/Logo'

const HomeLink = styled(Link)(() => ({
  transition: 'opacity 0.05s linear',

  color: colors.green,
  fontWeight: 700,
  '&:hover': {
    color: colors.green,
  },
  '&:visited': {
    color: colors.green,
  },
  '&:active': {
    opacity: 0.7,
    color: colors.green,
  },
}))

const LogoSVG = styled(BaseLogoSVG)`
  cursor: pointer;
  width: 55px;
`

const LogoSVGWithText = styled(LogoTheBadgeWithText)`
  cursor: pointer;
  width: 55px;
`

export const Logo = ({ size }: { size?: number }) => (
  <HomeLink href="/">
    <LogoSVG size={size || 100} />
  </HomeLink>
)

export const LogoWithText = ({ color, size }: { size?: number; color?: string }) => (
  <HomeLink href="/">
    <LogoSVGWithText fill={color} size={size || 100} />
  </HomeLink>
)
