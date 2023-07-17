import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { Box, Stack } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getHighlightColorByStatus from '@/src/utils/badges/getHighlightColorByStatus'
import { BadgeStatus, Badge_Filter } from '@/types/generated/subgraph'
import { KlerosController__factory } from '@/types/generated/typechain'

type Props = {
  address: string
}
export default function BadgesYouOwnList({ address }: Props) {
  const { t } = useTranslation()
  const { sendTx } = useTransaction()
  const router = useRouter()
  const { address: connectedWalletAddress } = useWeb3Connection()

  const isLoggedInUser = connectedWalletAddress === address

  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const klerosController = useContractInstance(KlerosController__factory, 'KlerosController')
  const gql = useSubgraph()

  async function handleClaimIt(badgeId: string, address: string) {
    const transaction = await sendTx(() => klerosController.claim(badgeId))

    await transaction.wait()
  }

  const filters: Array<ListFilter<BadgeStatus>> = [
    {
      title: t('badgesList.filters.minted'),
      color: 'blue',
      defaultSelected: true,
      key: BadgeStatus.Approved,
    },
    {
      title: t('badgesList.filters.challenged'),
      color: 'pink',
      key: BadgeStatus.Challenged,
    },
    {
      title: t('badgesList.filters.inReview'),
      color: 'green',
      key: BadgeStatus.Requested,
    },
  ]

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)

    const where: Badge_Filter = {
      status_in: (selectedFilters.map((filter) => filter.key) as Array<BadgeStatus>) || [],
    }

    const userWithBadges = await gql.userBadges({
      ownerAddress: address,
      where,
    })
    const badges = userWithBadges?.user?.badges || []

    const badgesLayouts = badges.map((badge) => {
      // TODO Use badge status to add claim or change the highlight color
      return (
        <Box key={badge.id} onClick={() => router.push(`/badge/preview/${badge.id}`)}>
          <MiniBadgeModelPreview
            highlightColor={getHighlightColorByStatus(badge.status)}
            metadata={badge.badgeModel?.uri}
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
      // categories={['Category 1', 'Category 2', 'Category 3']}
      filters={filters}
      loading={loading}
      loadingColor={'blue'}
      search={search}
      showTextSearch={false}
      title={
        isLoggedInUser ? t('profile.badgesYouOwn.title') : t('profile.badgesYouOwn.shared_title')
      }
      titleColor={'blue'}
    >
      {items.length > 0 ? (
        items
      ) : (
        <Stack>
          <NoResultsAnimated errorText={t('profile.badgesYouOwn.noResults')} />
        </Stack>
      )}
    </FilteredList>
  )
}
