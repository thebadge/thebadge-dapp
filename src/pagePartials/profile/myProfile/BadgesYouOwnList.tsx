import React, { useState } from 'react'

import { Box } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { KlerosBadgeTypeController__factory } from '@/types/generated/typechain'

type Props = {
  address: string
}
export default function BadgesYouOwnList({ address }: Props) {
  const { t } = useTranslation()

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
      defaultSelected: true,
      fixed: true,
    },
    {
      title: 'Approved',
      color: 'darkGreen',
    },
    {
      title: 'Expired',
      color: 'deepPurple',
    },
  ]

  // function handleClaimIt(badgeId: string, address: string) {
  //   klerosController.claimBadge(badgeId, address)
  // }

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch: string,
  ) => {
    setLoading(true)
    // TODO search with: selectedFilters, selectedCategory, textSearch
    const userWithBadges = await gql.userBadges({ ownerAddress: address })
    const badges = userWithBadges?.user?.badges || []

    const badgesLayouts = badges.map((badge) => {
      return (
        <Box
          key={badge.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            border: `1px solid ${colors.green}`,
            borderRadius: 2,
            p: 2,
          }}
        >
          <BadgeTypeMetadata metadata={badge.badgeType?.metadataURL} />
          {/*const needClaim =*/}
          {/*bt.status === 'InReview' && dayjs().isAfter(dayjs.unix(bt.reviewDueDate).toDate())*/}
          {/*<Box*/}
          {/*  key={bt.id}*/}
          {/*  sx={{*/}
          {/*    display: 'flex',*/}
          {/*    flexDirection: 'column',*/}
          {/*    gap: 1,*/}
          {/*    border: `1px solid ${colors.green}`,*/}
          {/*    borderRadius: 2,*/}
          {/*    p: 2,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {bt.status === 'Approved' ? (*/}
          {/*    <LinkWithTranslation pathname={`/badge/${bt.badgeType.id}/${address}`}>*/}
          {/*      Minted badge {bt.id}*/}
          {/*    </LinkWithTranslation>*/}
          {/*  ) : (*/}
          {/*    <Typography>Minted badge {bt.id}</Typography>*/}
          {/*  )}*/}
          {/*  <Typography>Status: {bt.status}</Typography>*/}
          {/*  <Typography>*/}
          {/*    Review ends in <Countdown date={dayjs.unix(bt.reviewDueDate).toDate()} />*/}
          {/*  </Typography>*/}
          {/*  <Typography>BadgeType Id: {bt.badgeType.id}</Typography>*/}
          {/*  <Typography>BadgeType Minted Amount: {bt.badgeType.badgesMintedAmount}</Typography>*/}

          {/*  {needClaim && (*/}
          {/*    <Box>*/}
          {/*      <Button onClick={() => handleClaimIt(bt.badgeType.id, address)} variant="contained">*/}
          {/*        Claim It*/}
          {/*      </Button>*/}
          {/*    </Box>*/}
          {/*  )}*/}
          {/*</Box>*/}
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
      items={items}
      loading={loading}
      search={search}
      title={t('profile.badgesYouOwn')}
    ></FilteredList>
  )
}
