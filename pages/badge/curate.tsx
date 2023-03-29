import React, { useState } from 'react'

import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'
import { NextPageWithLayout } from '@/types/next'

const StyledBadgeContainer = styled(Box)(() => ({
  position: 'relative',
  transition: 'all 2s',
  overflow: 'hidden',
  '& #curate-btn': {
    transition: 'all .75s cubic-bezier(0.83, 0, 0.17, 1)',
    position: 'absolute',
    bottom: '-33px',
    left: '50%',
    transform: 'translate(-50%, 0%)',
  },
  '&:hover': {
    '& #curate-btn': {
      bottom: '3px',
    },
  },
}))

const now = Math.floor(Date.now() / 1000)
const CurateBadges: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const { curate } = useCurateProvider()
  const { appChainId } = useWeb3Connection()
  const [items, setItems] = useState<React.ReactNode[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)

  const filters: Array<ListFilter> = [
    {
      title: 'Minted',
      color: 'blue',
    },
    {
      title: 'In Review',
      color: 'green',
      defaultSelected: true,
      fixed: true,
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
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const badgesInReview = await gql.badgesInReview({ date: now })
    const badges = badgesInReview.badges || []

    const badgeLayouts = badges.map((badge) => {
      return (
        <StyledBadgeContainer key={badge.id} maxWidth={'250px'}>
          <MiniBadgeTypeMetadata
            disableAnimations
            highlightColor={'#24F3D2'}
            metadata={badge.badgeType.metadataURL}
          />
          <Button
            color={'darkGreen'}
            id="curate-btn"
            onClick={() => curate(badge.badgeType.id, badge.receiver.id)}
            sx={{ borderRadius: '8px' }}
            variant="contained"
          >
            {t('curateExplorer.button')}
          </Button>

          {/*
           TODO ADD Creator/Emitter Metadata
          <div>Metadata: {bt.emitter.metadata}</div>
           This is broken because the metadata is not linked on IPFS.
           <CreatorDetails metadata={bt.emitter.metadata} />
          */}
        </StyledBadgeContainer>
      )
    })

    setTimeout(() => {
      setLoading(false)
      setItems(badgeLayouts)
    }, 2000)
  }

  return (
    <>
      <FilteredList
        disableEdit
        filters={filters}
        loading={loading}
        search={search}
        title={t('curateExplorer.title')}
      >
        {items.length > 0 ? (
          items
        ) : (
          <Stack>
            <Typography variant="body3">{t('curateExplorer.noBadgesFound')}</Typography>
            <NoResultsAnimated />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}

export default withPageGenericSuspense(CurateBadges)
