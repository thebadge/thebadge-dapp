import React from 'react'

import { Box, useTheme } from '@mui/material'
import { SectionLayout, colors } from '@thebadge/ui-library'

import { useSizeSM } from '@/src/hooks/useSize'
import BadgesYouOwnList from '@/src/pagePartials/profile/myProfile/BadgesYouOwnList'
import NearToExpire from '@/src/pagePartials/profile/myProfile/NearToExpire'
import Pending from '@/src/pagePartials/profile/myProfile/Pending'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function MyProfileSection() {
  const { address } = useWeb3Connection()
  const theme = useTheme()
  const isMobile = useSizeSM()

  if (!address) return null

  return (
    <>
      <Box display="flex" flex={1} flexDirection={isMobile ? 'column' : 'row'}>
        {/* Near to expire badges */}
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.greyBackground}
          components={[
            {
              component: <NearToExpire />,
            },
          ]}
          sx={{
            boxShadow: `0px 0px 6px ${theme.palette.mainMenu.boxShadow.main}`,
            borderWidth: 'inherit !important',
            mb: '3rem',
            flex: 3,
            borderRadius: '15px !important',
            marginRight: 2,
          }}
        />

        {/* In review badges */}
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.transparent}
          components={[
            {
              component: <Pending />,
            },
          ]}
          sx={{
            mb: '3rem',
            flex: 2,
            borderRadius: '15px !important',
          }}
        />
      </Box>

      <BadgesYouOwnList address={address} />
    </>
  )
}
