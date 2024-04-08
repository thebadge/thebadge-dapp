import React, { useEffect, useState } from 'react'

import { Box, Divider, Typography, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import InViewPort from '@/src/components/helpers/InViewPort'
import { getRequiredPremiumBadgeByNetworkId } from '@/src/constants/premiumSubscription'
import useGetMultiChainsConfig from '@/src/hooks/subgraph/useGetMultiChainsConfig'
import useMultiSubgraph from '@/src/hooks/subgraph/useMultiSubgraph'
import { useBadgesRequired } from '@/src/hooks/theBadge/useBadgesRequired'
import BadgeItemGenerator from '@/src/pagePartials/badge/preview/generators/BadgeItemGenerator'
import { useColorMode } from '@/src/providers/themeProvider'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { Badge, BadgeStatus, Badge_Filter } from '@/types/generated/subgraph'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

const FilteredListHeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(1),
  justifyContent: 'space-between',
  alignItems: 'center',
}))

export default function ManageSubscription() {
  const { t } = useTranslation()
  const { address, readOnlyChainId } = useWeb3Connection()
  const { mode } = useColorMode()
  const { hasUserBadgeModelBalance } = useBadgesRequired()
  const [isUserPremium, setIsUserPremium] = useState(false)
  const [ownBadges, setBadges] = useState<Badge[]>([])
  const { chainIds: defaultChains } = useGetMultiChainsConfig()
  const multiSubgraph = useMultiSubgraph(SubgraphName.TheBadge, defaultChains)

  useEffect(() => {
    const getUserSubscriptionStatus = async () => {
      const badgeModelRequired = getRequiredPremiumBadgeByNetworkId(readOnlyChainId)
      const hasBalance =
        badgeModelRequired &&
        (await hasUserBadgeModelBalance(badgeModelRequired, address as string))
      setIsUserPremium(hasBalance ? hasBalance : false)

      const where: Badge_Filter = {
        status_in: [BadgeStatus.Approved],
      }

      const userWithBadgesManyNetworks = await Promise.all(
        multiSubgraph.map((gql) =>
          gql.userBadges({
            ownerAddress: address as string,
            where,
          }),
        ),
      )

      let badges: Badge[] = []

      // For each network we put all the badges into a simple array
      userWithBadgesManyNetworks.forEach((userWithBadges) => {
        badges = [...badges, ...((userWithBadges?.user?.badges as Badge[]) || [])]
      })
      setBadges(badges)
    }
    getUserSubscriptionStatus()
  }, [address, hasUserBadgeModelBalance, multiSubgraph, readOnlyChainId])

  const renderPremiumBadge = () => {
    const badgeModelRequired = getRequiredPremiumBadgeByNetworkId(readOnlyChainId)
    const badge = ownBadges.find(
      (badge) =>
        badge.badgeModel?.id.toLowerCase() === badgeModelRequired?.id.toString().toLowerCase(),
    )

    if (!isUserPremium || !ownBadges.length || !badge) {
      return (
        <Typography
          color={mode === 'light' ? colors.blackText : colors.white}
          component="div"
          fontSize={'20px'}
          fontWeight="900"
          lineHeight={'30px'}
          padding={[1, 1, 1, 0]}
        >
          {t('profile.thirdParty.manageSubscriptions.nonSubscribed')}
        </Typography>
      )
    }

    return (
      <InViewPort key={`${badge.id}:${badge.networkName}:${badge.contractAddress}`}>
        <BadgeItemGenerator
          badgeContractAddress={badge.contractAddress}
          badgeId={badge.id}
          badgeNetworkName={badge.networkName}
          key={badge.id}
          showNetwork
        />
      </InViewPort>
    )
  }

  return (
    <Box>
      <FilteredListHeaderBox>
        <Typography
          color={mode === 'light' ? colors.blackText : colors.white}
          component="div"
          fontSize={'20px'}
          fontWeight="900"
          lineHeight={'30px'}
          padding={[1, 1, 1, 0]}
        >
          {t('profile.thirdParty.manageSubscriptions.title')}
        </Typography>
      </FilteredListHeaderBox>
      <Divider color={mode === 'dark' ? 'white' : 'black'} sx={{ borderWidth: '1px' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isUserPremium ? (
          renderPremiumBadge()
        ) : (
          <Typography
            color={mode === 'light' ? colors.blackText : colors.white}
            component="div"
            fontSize={'20px'}
            fontWeight="900"
            lineHeight={'30px'}
            padding={[1, 1, 1, 0]}
          >
            {t('profile.thirdParty.manageSubscriptions.nonSubscribed')}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
