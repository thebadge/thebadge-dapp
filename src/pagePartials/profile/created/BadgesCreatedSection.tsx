import React, { useState } from 'react'

import { Box, Stack, Typography, styled } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

const StyledBadgeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  transition: 'all 2s',
  overflow: 'hidden',
  '& #badge-info': {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.text.primary,
    color: theme.palette.background.default,
    padding: '8px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    transition: 'all .75s cubic-bezier(0.83, 0, 0.17, 1)',
    position: 'absolute',
    bottom: '-38px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
  },
  '&:hover': {
    overflow: 'none',
    '& #badge-info': {
      bottom: '2px',
    },
  },
}))

export default function BadgesCreatedSection() {
  const { t } = useTranslation()
  const { address, appChainId } = useWeb3Connection()
  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  if (!address) return null
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)

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
        <StyledBadgeContainer key={badgeType.id}>
          <MiniBadgeTypeMetadata disableAnimations metadata={badgeType?.metadataURL} />
          <Box id="badge-info">
            <Typography variant="body4">Const: {formatUnits(badgeType.mintCost, 18)}</Typography>
            <Typography variant="body4">Minted: {badgeType.badgesMintedAmount}</Typography>
          </Box>
        </StyledBadgeContainer>
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
        categories={['Category 1', 'Category 2', 'Category 3']}
        filters={[]}
        loading={loading}
        search={search}
        title={t('profile.badgesCreated')}
      >
        {items.length > 0 ? (
          items
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('profile.badgesCreatedNoResults')} />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}
