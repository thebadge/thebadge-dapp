import Link from 'next/link'

import { styled } from '@mui/material'
import { LogoTheBadgeWithText } from '@thebadge/ui-library'

import { Logo as BaseLogoSVG } from '@/src/components/assets/Logo'

const HomeLink = styled('a')`
  transition: opacity 0.05s linear;

  &:active {
    opacity: 0.7;
  }
`

const LogoSVG = styled(BaseLogoSVG)`
  cursor: pointer;
  width: 55px;
`

const LogoSVGWithText = styled(LogoTheBadgeWithText)`
  cursor: pointer;
  width: 55px;
`

export const Logo = ({ size }: { size?: number }) => (
  <Link href="/" legacyBehavior passHref prefetch={false}>
    <HomeLink>
      <LogoSVG size={size || 100} />
    </HomeLink>
  </Link>
)

export const LogoWithText = ({ color, size }: { size?: number; color?: string }) => (
  <Link href="/" legacyBehavior passHref prefetch={false}>
    <HomeLink>
      <LogoSVGWithText fill={color} size={size || 130} />
    </HomeLink>
  </Link>
)
