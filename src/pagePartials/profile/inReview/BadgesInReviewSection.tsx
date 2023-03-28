import React, { useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { colors } from 'thebadge-ui-library'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function BadgesInReviewSection() {
  const filters: Array<ListFilter> = [
    {
      title: 'In Review',
      color: 'green',
      fixed: true,
      defaultSelected: true,
    },
    {
      title: 'Challenged',
      color: 'pink',
    },
    {
      title: 'Minted',
      color: 'blue',
    },
  ]

  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { address, appChainId } = useWeb3Connection()

  if (!address) return null
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const badgesInReview = await gql.userBadgesInReview({ ownerAddress: address })

    const badgeTypes = badgesInReview?.user?.badges || []
    const badgesLayouts = badgeTypes.map((badge) => {
      const badgeType = badge.badgeType
      return (
        <Box key={badgeType.id}>
          <MiniBadgeTypeMetadata highlightColor={colors.green} metadata={badgeType?.metadataURL} />
        </Box>
      )
    })

    setTimeout(() => {
      setItems(badgesLayouts)
      setLoading(false)
    }, 2000)
  }

  return (
    <>
      <FilteredList
        color={colors.green}
        disableEdit
        filters={filters}
        loading={loading}
        search={search}
        title={'Your badges in review'}
      >
        {items.length > 0 ? (
          items
        ) : (
          <Stack>
            <Typography variant="body3">There are no badges in review...</Typography>
            <NoResultsAnimated />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}
