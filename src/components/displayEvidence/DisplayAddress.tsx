'use client'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Divider, Link, Tooltip, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'

import { FormField } from '@/src/components/form/helpers/FormField'
import { chainsConfig } from '@/src/config/web3'
import { truncateStringInTheMiddle } from '@/src/utils/strings'
import { ChainsValues } from '@/types/chains'
import { WCAddress } from '@/types/utils'

const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}))

const ExternalLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 400,
  lineHeight: '133%',
  fontSize: '14px',
  textDecoration: 'underline',

  '&:hover': {
    textDecoration: 'none',
  },

  '&:active': {
    opacity: 0.7,
  },
}))

type DisplayAddressProps = {
  label?: string
  placeholder?: string
  value: WCAddress
  truncate?: boolean
  networkId: ChainsValues
}

export function DisplayAddress({
  label,
  networkId,
  placeholder,
  truncate = false,
  value,
}: DisplayAddressProps) {
  const displayAddress = truncate ? truncateStringInTheMiddle(value, 8, 6) : value

  const getExplorerUrl = (hash: string) => {
    const url = chainsConfig[networkId]?.blockExplorerUrls[0]
    const type = hash.length > 42 ? 'tx' : 'address'
    return `${url}${type}/${hash}`
  }

  return (
    <Wrapper>
      <FormField
        formControl={
          <Box display="flex" justifyContent="space-between" width="100%">
            <ExternalLink href={getExplorerUrl(value)} target="_blank">
              {displayAddress}
            </ExternalLink>
            {placeholder && (
              <Tooltip arrow title={placeholder}>
                <InfoOutlinedIcon sx={{ ml: 1 }} />
              </Tooltip>
            )}
          </Box>
        }
        label={<Typography variant="subtitle2">{label}</Typography>}
        labelPosition={'top-left'}
      />
      <Divider color={colors.white} sx={{ mt: -1 }} />
    </Wrapper>
  )
}
