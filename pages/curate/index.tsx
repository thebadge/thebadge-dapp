import React, { RefObject, createRef, useState } from 'react'

import { Box, Stack, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import SelectedItemPreviewWrapper from '@/src/components/helpers/FilteredList/SelectedItemPreviewWrapper'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ADDRESS_PREFIX, nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import TimeLeftDisplay from '@/src/pagePartials/badge/explorer/addons/TimeLeftDisplay'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')
import getHighlightColorByStatus from '@/src/utils/badges/getHighlightColorByStatus'
import { Badge, BadgeStatus } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const TimeLeftContainer = styled(Box)(() => ({
  position: 'absolute',
  zIndex: 1,
  top: '6px',
  left: '50%',
  transform: 'translate(-50%, 0)',
}))

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
      date: now,
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
      <SelectedItemPreviewWrapper
        color={colors.green}
        onSelectNext={selectNext}
        onSelectPrevious={selectPrevious}
        title={t('explorer.curate.title')}
      >
        <BadgeEvidenceInfoPreview badge={badges[selectedBadgeIndex]} />
      </SelectedItemPreviewWrapper>
    )
  }

  function renderBadgeToCurateItem(badge: Badge, index: number) {
    const isSelected = badge.id === badges[selectedBadgeIndex]?.id
    const showTimeLeft = badge.status !== BadgeStatus.Approved

    return (
      <InViewPort key={badge.id} minHeight={300} minWidth={180}>
        <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
          <MiniBadgePreviewContainer
            highlightColor={getHighlightColorByStatus(badge.status)}
            ref={badgesElementRefs[index]}
            selected={isSelected}
          >
            {showTimeLeft && (
              <TimeLeftContainer>
                <TimeLeftDisplay
                  reviewDueDate={badge?.badgeKlerosMetaData?.reviewDueDate}
                  smallView
                />
              </TimeLeftContainer>
            )}
            <MiniBadgeModelPreview
              buttonTitle={t('curateExplorer.button')}
              controllerType={badge?.badgeModel?.controllerType}
              disableAnimations
              highlightColor={getHighlightColorByStatus(badge.status)}
              metadata={badge?.badgeModel?.uri}
              onClick={() => setSelectedBadgeIndex(index)}
            />
          </MiniBadgePreviewContainer>
        </SafeSuspense>
      </InViewPort>
    )
  }

  function generateListItems() {
    if (badges.length > 0) {
      return badges.map((badge, i) => renderBadgeToCurateItem(badge, i))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('curateExplorer.noBadgesFound')} />
      </Stack>,
    ]
  }

  return (
    <>
      <FilteredList
        filters={filters}
        items={generateListItems()}
        loading={loading}
        loadingColor={'green'}
        preview={renderSelectedBadgePreview()}
        search={search}
        searchInputLabel={t('curateExplorer.searchLabel')}
        title={t('curateExplorer.title')}
      />
    </>
  )
}

export default withPageGenericSuspense(CurateBadges)
