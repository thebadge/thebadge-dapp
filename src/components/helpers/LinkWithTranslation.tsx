import Link from 'next/link'
import React from 'react'

import { styled } from '@mui/material'
import { useLanguageQuery } from 'next-export-i18n'

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    textDecoration: 'underline',
    '& .MuiTypography-root': {
      color: `${theme.palette.text.secondary} !important`,
    },
  },
}))

export default function LinkWithTranslation({
  children,
  pathname,
  queryParams,
}: {
  children: React.ReactNode
  pathname: string
  queryParams?: { [key: string]: string }
}) {
  const [query] = useLanguageQuery()

  const lang = query && query.lang ? query.lang : undefined

  return (
    <StyledLink href={{ pathname: pathname, query: { lang, ...queryParams } }}>
      {children}
    </StyledLink>
  )
}
