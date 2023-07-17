import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { Box, Stack } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const now = nowInSeconds()

export default function BadgesIAmReviewingSection() {
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
      fixed: true,
      defaultSelected: true,
    },
  ]

  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { address } = useWeb3Connection()
  const router = useRouter()
  const gql = useSubgraph()

  if (!address) return null

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const badgesMetadataIamReviewing = await gql.badgesMetaDataUserChallenged({
      userAddress: address,
    })
    const badgesIamReviewing = badgesMetadataIamReviewing.badgeKlerosMetaDatas.map(
      (metadata) => metadata.badge,
    )
    const badgesLayouts = badgesIamReviewing.map((badge) => {
      const badgeModel = badge.badgeModel
      return (
        <Box key={badge.id}>
          <MiniBadgeModelPreview
            highlightColor={colors.green}
            metadata={badgeModel?.uri}
            onClick={() => router.push(`/badge/preview/${badge.id}`)}
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
    <>
      <FilteredList
        disableEdit
        filters={filters}
        loading={loading}
        loadingColor={'green'}
        search={search}
        showTextSearch={false}
        title={t('profile.badgesIAmReviewing.title')}
        titleColor={colors.green}
      >
        {items.length > 0 ? (
          items
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('profile.badgesIAmReviewing.noResults')} />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}
