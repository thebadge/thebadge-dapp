import React, { RefObject, createRef, useCallback, useState } from 'react'

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
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import { useSizeSM } from '@/src/hooks/useSize'
import BadgeModelInfoPreview from '@/src/pagePartials/badge/explorer/BadgeModelInfoPreview'
import BadgeModelMiniPreview from '@/src/pagePartials/badge/miniPreview/BadgeModelMiniPreview'
import { BadgeModel } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeModels: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const isMobile = useSizeSM()

  const [badgeModels, setBadgeModels] = useState<BadgeModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeModel, setSelectedBadgeModel] = useState<number>(0)

  const badgeModelsElementRefs: RefObject<HTMLLIElement>[] = badgeModels.map(() =>
    createRef<HTMLLIElement>(),
  )

  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadgeModel,
    badgeModelsElementRefs,
    selectedBadgeModel,
    badgeModels.length,
  )

  const search = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selectedFilters: Array<ListFilter>,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      selectedCategory: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      textSearch?: string,
    ) => {
      setLoading(true)

      // TODO filter badges using filters, category, text
      const badgeModels = await gql.communityBadgeModels()
      const badges = (badgeModels.badgeModels as BadgeModel[]) || []

      setLoading(false)
      setBadgeModels(badges)
      setSelectedBadgeModel(0)
    },
    [gql],
  )

  function renderSelectedBadgePreview() {
    if (!badgeModels[selectedBadgeModel]) return null
    return (
      <SelectedItemPreviewWrapper
        color={colors.blue}
        onSelectNext={selectNext}
        onSelectPrevious={selectPrevious}
        title={t('explorer.preview.title')}
      >
        <BadgeModelInfoPreview badgeModel={badgeModels[selectedBadgeModel]} />
      </SelectedItemPreviewWrapper>
    )
  }

  function renderBadgeModelItem(bt: BadgeModel, index: number) {
    const isSelected = bt.id === badgeModels[selectedBadgeModel]?.id
    return (
      <InViewPort
        key={bt.id}
        minHeight={300}
        minWidth={180}
        onViewPortEnter={() => {
          if (isMobile) {
            setSelectedBadgeModel(index)
          }
        }}
      >
        <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
          <MiniBadgePreviewContainer
            highlightColor={colors.blue}
            onClick={() => setSelectedBadgeModel(index)}
            ref={badgeModelsElementRefs[index]}
            selected={isSelected}
          >
            <BadgeModelMiniPreview
              buttonTitle={t('explorer.button')}
              disableAnimations
              highlightColor={colors.blue}
              metadata={bt.uri}
            />
          </MiniBadgePreviewContainer>
        </SafeSuspense>
      </InViewPort>
    )
  }

  function generateListItems() {
    if (badgeModels.length > 0) {
      return badgeModels.map((bt, i) => renderBadgeModelItem(bt, i))
    }
    return [
      <Stack key="no-results">
        <NoResultsAnimated errorText={t('explorer.noBadgesFound')} />
      </Stack>,
    ]
  }

  return (
    <FilteredList
      items={generateListItems()}
      loading={loading}
      loadingColor={'blue'}
      preview={renderSelectedBadgePreview()}
      search={search}
      title={t('explorer.title')}
      titleColor={colors.blue}
    />
  )
}

export default withPageGenericSuspense(ExploreBadgeModels, { spinner: { color: 'blue' } })
