import React, { useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import Countdown from 'react-countdown'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import CreateNewBadge from '@/src/pagePartials/profile/created/CreateNewBadge'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

export default function BadgesCreatedSection() {
  const { t } = useTranslation()
  const { address, appChainId } = useWeb3Connection()
  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  if (!address) return null
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)

  const filters: Array<ListFilter> = [
    {
      title: 'In Review',
      color: 'green',
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

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const userCreatedBadges = await gql.userCreatedBadges({ ownerAddress: address })
    const badgeTypes = userCreatedBadges?.user?.createdBadgeTypes || []

    const badgesLayouts = badgeTypes.map((badgeType) => {
      return (
        <Box key={badgeType.id}>
          <MiniBadgeTypeMetadata metadata={badgeType?.metadataURL} />
          <Typography>
            Review ends in <Countdown date={dayjs.unix(badgeType.validFor).toDate()} />
          </Typography>
          <Typography>BadgeType Id: {badgeType.id}</Typography>
          <Typography>BadgeType Minted Amount: {badgeType.badgesMintedAmount}</Typography>
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
      <Box mb={5}>
        <CreateNewBadge />
      </Box>

      <FilteredList
        categories={['Category 1', 'Category 2', 'Category 3']}
        filters={filters}
        loading={loading}
        search={search}
        title={t('profile.badgesCreated')}
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
    </>
  )
}
