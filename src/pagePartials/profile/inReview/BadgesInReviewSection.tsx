import React, { useState } from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function BadgesInReviewSection() {
  const { t } = useTranslation()
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
  ]

  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { address } = useWeb3Connection()
  const gql = useSubgraph()

  if (!address) return null

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
        disableEdit
        filters={filters}
        loading={loading}
        loadingColor={'green'}
        search={search}
        title={t('profile.badgesInReview.title')}
        titleColor={colors.green}
      >
        {items.length > 0 ? (
          items
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('profile.badgesInReview.noResults')} />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}
