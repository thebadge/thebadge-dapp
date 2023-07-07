import React, { useState } from 'react'

import { Box, Stack } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
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

    const badgeModels = badgesInReview?.user?.badges || []
    const badgesLayouts = badgeModels.map((badge) => {
      const badgeModel = badge.badgeModel
      return (
        <Box key={badge.id}>
          <MiniBadgeModelPreview highlightColor={colors.green} metadata={badgeModel?.uri} />
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
