import React, { useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import getHighlightColorByStatus from '@/src/utils/badges/getHighlightColorByStatus'
import { BadgeStatus, Badge_Filter } from '@/types/generated/subgraph'
import { KlerosBadgeTypeController__factory } from '@/types/generated/typechain'

type Props = {
  address: string
}
export default function BadgesYouOwnList({ address }: Props) {
  const { t } = useTranslation()
  const { sendTx } = useTransaction()

  const { appChainId } = useWeb3Connection()
  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)

  const filters: Array<ListFilter> = [
    {
      title: 'Minted',
      color: 'blue',
      fixed: true,
      defaultSelected: true,
    },
    {
      title: 'Challenged',
      color: 'pink',
    },
    {
      title: 'In Review',
      color: 'green',
    },
  ]

  //async function handleClaimIt(badgeId: string, address: string) {
  //  const transaction = await sendTx(() => klerosController.claimBadge(badgeId, address))
  //
  //  await transaction.wait()
  //}

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO search with: selectedFilters, selectedCategory, textSearch
    let where: Badge_Filter = {}
    selectedFilters.forEach((filter) => {
      if (filter.title === 'Minted') {
        where = {
          ...where,
          status_in: where.status_in
            ? [...where.status_in, BadgeStatus.Approved]
            : [BadgeStatus.Approved],
        }
      }
      if (filter.title === 'Challenged') {
        where = {
          ...where,
          isChallenged: true,
        }
      }
      if (filter.title === 'In Review') {
        where = {
          ...where,
          status_in: where.status_in
            ? [...where.status_in, BadgeStatus.InReview]
            : [BadgeStatus.InReview],
        }
      }
    })

    const userWithBadges = await gql.userBadges({
      ownerAddress: address,
      where,
    })
    const badges = userWithBadges?.user?.badges || []

    const badgesLayouts = badges.map((badge) => {
      // TODO Use badge status to add claim or change the highlight color
      return (
        <Box key={badge.id}>
          <MiniBadgeTypeMetadata
            highlightColor={getHighlightColorByStatus(badge.status)}
            metadata={badge.badgeType?.metadataURL}
          />
        </Box>
      )
    })

    setTimeout(() => {
      setItems(badgesLayouts)
      setLoading(false)
    }, 2000)
  }

  return (
    <FilteredList
      categories={['Category 1', 'Category 2', 'Category 3']}
      filters={filters}
      loading={loading}
      search={search}
      title={t('profile.badgesYouOwn')}
    >
      {items.length > 0 ? (
        items
      ) : (
        <Stack>
          <Typography variant="body3">
            You don't have any badges that match these filters...
          </Typography>
          <NoResultsAnimated />
        </Stack>
      )}
    </FilteredList>
  )
}
