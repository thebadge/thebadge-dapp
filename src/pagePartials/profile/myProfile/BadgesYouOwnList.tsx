import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'

import { Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import { Chains } from '@/src/config/web3'
import useMultiSubgraph from '@/src/hooks/subgraph/useMultiSubgraph'
import BadgeItemGenerator from '@/src/pagePartials/badge/preview/generators/BadgeItemGenerator'
import { SubgraphName } from '@/src/subgraph/subgraph'
import { generateBadgePreviewUrl, generateExplorer } from '@/src/utils/navigation/generateUrl'
import { isTestnet } from '@/src/utils/network'
import { Badge, BadgeStatus, Badge_Filter } from '@/types/generated/subgraph'

const { useWeb3Connection } = await import('@/src/providers/web3/web3ConnectionProvider')

type Props = {
  address: string
}
export default function BadgesYouOwnList({ address }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const { address: connectedWalletAddress, readOnlyChainId } = useWeb3Connection()

  const isLoggedInUser = connectedWalletAddress === address

  const [ownBadges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const multiSubgraph = useMultiSubgraph(
    SubgraphName.TheBadge,
    isTestnet ? [readOnlyChainId, Chains.goerli, Chains.sepolia] : [Chains.gnosis, Chains.polygon],
  )

  const filters: Array<ListFilter<BadgeStatus>> = [
    {
      title: t('badgesList.filters.minted'),
      color: 'blue',
      defaultSelected: true,
      key: BadgeStatus.Approved,
    },
    {
      title: t('badgesList.filters.challenged'),
      color: 'error',
      defaultSelected: true,
      key: BadgeStatus.Challenged,
    },
    {
      title: t('badgesList.filters.inReview'),
      color: 'green',
      key: BadgeStatus.Requested,
    },
  ]

  const onBadgeClick = useCallback(
    (badge: Badge) => () =>
      router.push(
        generateBadgePreviewUrl(badge.id, {
          theBadgeContractAddress: badge.contractAddress,
          connectedChainId: readOnlyChainId,
        }),
      ),
    [router, readOnlyChainId],
  )

  const search = async (
    selectedFilters: Array<ListFilter>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedCategory: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textSearch?: string,
  ) => {
    setLoading(true)

    const where: Badge_Filter = {
      status_in: (selectedFilters.map((filter) => filter.key) as Array<BadgeStatus>) || [],
    }

    const userWithBadgesManyNetworks = await Promise.all(
      multiSubgraph.map((gql) =>
        gql.userBadges({
          ownerAddress: address,
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
    setLoading(false)
  }

  function generateListItems() {
    if (ownBadges.length > 0) {
      return ownBadges.map((badge) => (
        <InViewPort key={`${badge.id}:${badge.networkName}:${badge.contractAddress}`}>
          <BadgeItemGenerator
            badgeContractAddress={badge.contractAddress}
            badgeId={badge.id}
            badgeNetworkName={badge.networkName}
            key={badge.id}
            onClick={onBadgeClick(badge)}
          />
        </InViewPort>
      ))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('profile.badgesYouOwn.noResults')} />
        {isLoggedInUser && (
          <ButtonV2
            backgroundColor={colors.transparent}
            fontColor={colors.blue}
            onClick={() => router.push(generateExplorer())}
            sx={{ m: 'auto' }}
          >
            <Typography>{t('profile.badgesYouOwn.mint')}</Typography>
          </ButtonV2>
        )}
      </Stack>,
    ]
  }

  return (
    <FilteredList
      alignItems={'left'}
      filters={filters}
      items={generateListItems()}
      listId={isLoggedInUser ? 'owned-badges-explorer-list' : 'preview-badges-explorer-list'}
      loading={loading}
      loadingColor={'blue'}
      search={search}
      showTextSearch={false}
      title={
        isLoggedInUser ? t('profile.badgesYouOwn.title') : t('profile.badgesYouOwn.shared_title')
      }
      titleColor={colors.blue}
    />
  )
}
