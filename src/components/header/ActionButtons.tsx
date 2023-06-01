import React, { RefObject } from 'react'

import { Box, Button, Tooltip, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { useCurrentUser } from '@/src/hooks/subgraph/useCurrentUser'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

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

export default function ActionButtons() {
  const { t } = useTranslation()
  const { data: user } = useCurrentUser()
  const { isWalletConnected } = useWeb3Connection()

  const { becomeACreatorSection, scrollTo } = useSectionReferences()

  const menuButton = (
    title: string,
    color: string,
    disabled: boolean,
    path: string,
    ref?: RefObject<HTMLDivElement> | null,
  ) => {
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
  const exploreButton = menuButton(t('header.buttons.mint'), colors.blue, false, '/badge/explorer')
  const curateButton = menuButton(
    t('header.buttons.curate'),
    colors.greenLogo,
    false,
    '/badge/curate',
  )
  const createButton = menuButton(
    t('header.buttons.create'),
    colors.pink,
    isWalletConnected && !user?.isCreator,
    '/badge/model/create',
  )

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
                onClick={() => scrollTo('/', becomeACreatorSection)}
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
