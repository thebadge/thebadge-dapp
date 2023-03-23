import React, { useState } from 'react'

import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useTranslation } from 'next-export-i18n'
import Countdown from 'react-countdown'
import { colors } from 'thebadge-ui-library'

import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
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
    textSearch: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const userCreatedBadges = await gql.userCreatedBadges({ ownerAddress: address })
    const badgeTypes = userCreatedBadges?.user?.createdBadgeTypes || []

    const badgesLayouts = badgeTypes.map((badgeType) => {
      return (
        <Box
          key={badgeType.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            border: `1px solid ${colors.green}`,
            borderRadius: 2,
            p: 2,
          }}
        >
          <BadgeTypeMetadata metadata={badgeType?.metadataURL} />
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
        items={items}
        loading={loading}
        search={search}
        title={t('profile.badgesCreated')}
      ></FilteredList>
    </>
  )
}
