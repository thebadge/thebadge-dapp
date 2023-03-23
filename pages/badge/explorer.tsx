import Link from 'next/link'
import React, { useState } from 'react'

import { Box } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import GetBadgeTypeChallengePeriodDuration from '@/src/pagePartials/badge/GetBadgeTypeReviewDueDate'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { getTheme } from '@/src/theme/theme'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadges: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { appChainId } = useWeb3Connection()
  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)

  const theme = getTheme()
  const filters: Array<ListFilter> = [
    {
      title: 'Minted',
      color: 'blue',
    },
    {
      title: 'In Review',
      color: 'green',
    },
    {
      title: 'Approved',
      color: 'darkGreen',
    },
    {
      title: 'Challenged',
      color: 'pink',
    },
  ]

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const badgeTypes = await gql.badgeTypes()
    const badges = badgeTypes.badgeTypes || []

    const badgeLayouts = badges.map((bt) => {
      return (
        <Box key={bt.id} maxWidth={'250px'}>
          <MiniBadgeTypeMetadata metadata={bt.metadataURL} />
          <div>mintCost: {formatUnits(bt.mintCost, 18)} + Kleros deposit</div>
          <div>ValidFor: {bt.validFor / 60 / 60 / 24} </div>
          <div>paused: {bt.paused ? 'Yes' : 'No'}</div>
          <div>Controller: {bt.controllerName}</div>
          <div>
            <span>Challenge period duration: </span>
            <GetBadgeTypeChallengePeriodDuration tcrList={bt.klerosBadge?.klerosTCRList} /> days
          </div>

          {/* TODO ADD Creator/Emitter Metadata*/}
          {/*<div>Metadata: {bt.emitter.metadata}</div>*/}
          {/* This is broken because the metadata is not linked on IPFS. */}
          {/* <CreatorDetails metadata={bt.emitter.metadata} /> */}
          <Link href={`/badge/mint/${bt.id}`}>Mint</Link>
        </Box>
      )
    })

    setTimeout(() => {
      console.log('searched with', selectedFilters, selectedCategory, textSearch)
      setLoading(false)
      setItems(badgeLayouts)
    }, 2000)
  }

  return (
    <>
      <FilteredList
        categories={['Category 1', 'Category 2', 'Category 3']}
        filters={filters}
        items={items}
        loading={loading}
        search={search}
        title={t('explorer.title')}
      ></FilteredList>
    </>
  )
}

export default withPageGenericSuspense(ExploreBadges)
