import CreateNewBadge from "@/src/pagePartials/profile/created/CreateNewBadge";
import { Box, useTheme } from '@mui/material'
import React from "react";
import { SectionLayout, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import BadgesYouOwnList from '@/src/pagePartials/profile/myProfile/BadgesYouOwnList'
import ExploreOtherBadges from '@/src/pagePartials/profile/myProfile/ExploreOtherBadges'
import NearToExpire from '@/src/pagePartials/profile/myProfile/NearToExpire'
import Pending from '@/src/pagePartials/profile/myProfile/Pending'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function MyProfileSection() {
  const { address } = useWeb3Connection()
  const theme = useTheme()

  if (!address) return null

  return (
    <>
      <Box display="flex" flex={1} flexDirection="row">
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

      <Box mb={5}>
        <ExploreOtherBadges />
      </Box>

      <SafeSuspense>
        <BadgesYouOwnList address={address} />
      </SafeSuspense>
    </>
  )
}
