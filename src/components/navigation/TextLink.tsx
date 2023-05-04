import { styled } from '@mui/material'

import { NavLink } from '@/src/components/navigation/NavLink'

export const TextLink = styled(NavLink)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`
