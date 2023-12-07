import React, { RefObject, createRef, useState } from 'react'

import { Stack } from '@mui/material'
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
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import { useSizeSM } from '@/src/hooks/useSize'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeInfoPreview from '@/src/pagePartials/badge/explorer/BadgeInfoPreview'
import { Badge } from '@/types/generated/subgraph'
import { shuffleBadges } from '@/src/components/utils/sortBadgeList'

const ExploreBadges = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const isMobile = useSizeSM()

  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadge, setSelectedBadge] = useState<number>(0)

  const badgeElementRefs: RefObject<HTMLLIElement>[] = badges.map(() => createRef<HTMLLIElement>())

  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadge,
    badgeElementRefs,
    selectedBadge,
    badges.length,
  )

  const search = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedFilters: Array<ListFilter>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedCategory: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const allBadgesQuery = await gql.allBadges()
    const badges = (allBadgesQuery.badges as Badge[]) || []
    // Shuffles the badges to avoid having badges with the same model near to others
    const shuffledBadges = shuffleBadges(badges)
    setTimeout(() => {
      setLoading(false)
      setBadges(shuffledBadges)
      setSelectedBadge(0)
    }, 2000)
  }

  function renderSelectedBadgePreview() {
    if (!badges[selectedBadge]) return null
    return (
      <SelectedItemPreviewWrapper
        color={colors.green}
        onSelectNext={selectNext}
        onSelectPrevious={selectPrevious}
        title={t('explorer.badges.preview.title')}
      >
        <BadgeInfoPreview badge={badges[selectedBadge]} />
      </SelectedItemPreviewWrapper>
    )
  }

  function renderBadgeItem(bt: Badge, index: number) {
    const isSelected = bt.id === badges[selectedBadge]?.id
    return (
      <InViewPort
        key={bt.id}
        minHeight={300}
        minWidth={180}
        onViewPortEnter={() => {
          if (isMobile) {
            setSelectedBadge(index)
          }
        }}
      >
        <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
          <MiniBadgePreviewContainer
            highlightColor={colors.green}
            onClick={() => setSelectedBadge(index)}
            ref={badgeElementRefs[index]}
            selected={isSelected}
          >
            <MiniBadgeModelPreview
              disableAnimations
              highlightColor={colors.green}
              metadata={bt.uri}
            />
          </MiniBadgePreviewContainer>
        </SafeSuspense>
      </InViewPort>
    )
  }

  function generateListItems() {
    if (badges.length > 0) {
      return badges.map((bt, i) => renderBadgeItem(bt, i))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('explorer.noBadgesFound')} />
      </Stack>,
    ]
  }

  return (
    <>
      <FilteredList
        items={generateListItems()}
        loading={loading}
        loadingColor={'green'}
        preview={renderSelectedBadgePreview()}
        search={search}
        title={t('explorer.badges.title')}
        titleColor={colors.green}
      />
    </>
  )
}

export default ExploreBadges
