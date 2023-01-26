import Link from 'next/link'
import React from 'react'

import { styled } from '@mui/material'
import { useLanguageQuery } from 'next-export-i18n'

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    textDecoration: 'underline',
  },
}))

export default function LinkWithTranslation({
  children,
  pathname,
}: {
  children: React.ReactNode
  pathname: string
}) {
  const [query] = useLanguageQuery()

  return <StyledLink href={{ pathname: pathname, query: query }}>{children}</StyledLink>
}
