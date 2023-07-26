import React, { RefObject, createRef, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ADDRESS_PREFIX, nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import getHighlightColorByStatus from '@/src/utils/badges/getHighlightColorByStatus'
import { Badge, BadgeStatus } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const now = nowInSeconds()

const filters: Array<ListFilter<BadgeStatus>> = [
  {
    title: 'In Review',
    color: 'green',
    defaultSelected: true,
    fixed: true,
    key: BadgeStatus.Requested,
  },
  {
    title: 'Approved',
    color: 'darkGreen',
    key: BadgeStatus.Approved,
  },
]

const CurateBadges: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const { address } = useWeb3Connection()

  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeIndex, setSelectedBadgeIndex] = useState<number>(0)

  const badgesElementRefs: RefObject<HTMLLIElement>[] = badges.map(() => createRef<HTMLLIElement>())
  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadgeIndex,
    badgesElementRefs,
    selectedBadgeIndex,
    badges.length,
  )

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    setSelectedBadgeIndex(0)
    setBadges([])

    const badgesUserCanReview = await gql.badgesUserCanReviewSmallSet({
      userAddress: address || '',
      date: selectedFilters.some((f) => f.key == BadgeStatus.Approved) ? 0 : now,
      statuses: selectedFilters.map((f) => f.key) as Array<BadgeStatus>,
      badgeReceiver: textSearch ? textSearch.toLowerCase() : ADDRESS_PREFIX,
    })
    const badges = (badgesUserCanReview.badges as Badge[]) || []
    setSelectedBadgeIndex(0)
    setBadges(badges)
    setLoading(false)
  }

  function renderSelectedBadgePreview() {
    if (!badges[selectedBadgeIndex]) return null
    return (
      <>
        <Box display="flex" justifyContent="space-between">
          <Typography color={colors.green} mb={4} variant="dAppHeadline2">
            {t('explorer.curate.title') + '#' + badges[selectedBadgeIndex].id}
          </Typography>
          <Box>
            <IconButton onClick={selectPrevious}>
              <ArrowBackIosOutlinedIcon color="green" />
            </IconButton>
            <IconButton onClick={selectNext}>
              <ArrowForwardIosOutlinedIcon color="green" />
            </IconButton>
          </Box>
        </Box>
        <SafeSuspense>
          <BadgeEvidenceInfoPreview badge={badges[selectedBadgeIndex]} />
        </SafeSuspense>
      </>
    )
  }

  return (
    <>
      <FilteredList
        filters={filters}
        loading={loading}
        loadingColor={'green'}
        preview={renderSelectedBadgePreview()}
        search={search}
        searchInputLabel={t('curateExplorer.searchLabel')}
        title={t('curateExplorer.title')}
      >
        {badges.length > 0 ? (
          badges.map((badge, i) => {
            const isSelected = badge.id === badges[selectedBadgeIndex]?.id

            return (
              <InViewPort key={badge.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
                  <MiniBadgePreviewContainer
                    highlightColor={getHighlightColorByStatus(badge.status)}
                    ref={badgesElementRefs[i]}
                    selected={isSelected}
                  >
                    <MiniBadgeModelPreview
                      buttonTitle={t('curateExplorer.button')}
                      disableAnimations
                      highlightColor={getHighlightColorByStatus(badge.status)}
                      metadata={badge.badgeModel.uri}
                      onClick={() => setSelectedBadgeIndex(i)}
                    />
                  </MiniBadgePreviewContainer>
                </SafeSuspense>
              </InViewPort>
            )
          })
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('curateExplorer.noBadgesFound')} />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}

export default withPageGenericSuspense(CurateBadges)
