import React, { RefObject, createRef, useState } from 'react'

import { Stack } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  BadgePreviewContainer,
  BadgePreviewLoading,
} from '@/src/components/common/BadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import SelectedItemPreviewWrapper from '@/src/components/helpers/FilteredList/SelectedItemPreviewWrapper'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import { Badge } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeModels: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const badgeModelId = useModelIdParam()
  const isMobile = useSizeSM()

  const [badges, setBadge] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadge, setSelectedBadgeModel] = useState<number>(0)

  const badgeModelsElementRefs: RefObject<HTMLLIElement>[] = badges.map(() =>
    createRef<HTMLLIElement>(),
  )
  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadgeModel,
    badgeModelsElementRefs,
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
    const badgesByModel = await gql.badgeByModelId({ id: badgeModelId })
    const badges = (badgesByModel.badges as Badge[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadge(badges)
      setSelectedBadgeModel(0)
    }, 2000)
  }

  function renderSelectedBadgePreview() {
    if (!badges[selectedBadge]) return null
    return (
      <SelectedItemPreviewWrapper
        color={colors.blue}
        onSelectNext={selectNext}
        onSelectPrevious={selectPrevious}
        title={t('explorer.curate.title')}
      >
        <BadgeEvidenceInfoPreview badge={badges[selectedBadge]} />
      </SelectedItemPreviewWrapper>
    )
  }

  function renderBadgeItem(badge: Badge, index: number) {
    const isSelected = badge.id === badges[selectedBadge]?.id
    return (
      <InViewPort
        key={badge.id}
        minHeight={300}
        minWidth={180}
        onViewPortEnter={() => {
          if (isMobile) {
            setSelectedBadgeModel(index)
          }
        }}
      >
        <SafeSuspense fallback={<BadgePreviewLoading />}>
          <BadgePreviewContainer
            highlightColor={colors.blue}
            onClick={() => setSelectedBadgeModel(index)}
            ref={badgeModelsElementRefs[index]}
            selected={isSelected}
          >
            <BadgeModelPreview metadata={badge.badgeModel.uri} size="small" />
          </BadgePreviewContainer>
        </SafeSuspense>
      </InViewPort>
    )
  }

  function generateListItems() {
    if (badges.length > 0) {
      return badges.map((badge, i) => renderBadgeItem(badge, i))
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
        loadingColor={'blue'}
        preview={renderSelectedBadgePreview()}
        search={search}
        title={t('explorer.title')}
      />
    </>
  )
}

export default withPageGenericSuspense(ExploreBadgeModels, { spinner: { color: 'blue' } })
