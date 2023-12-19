import React, { RefObject, createRef, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeModelInfoPreview from '@/src/pagePartials/badge/explorer/BadgeModelInfoPreview'
import { BadgeModel } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeModels: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()

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
    const badgeModels = await gql.badgeModels()
    const badges = (badgeModels.badgeModels as BadgeModel[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadgeModels(badges)
      setSelectedBadgeModel(0)
    }, 2000)
  }

  function renderSelectedBadgePreview() {
    if (!badgeModels[selectedBadgeModel]) return null
    return (
      <SafeSuspense>
        <Box display="flex" justifyContent="space-between">
          <Typography color={colors.blue} mb={4} variant="dAppHeadline2">
            {t('explorer.preview.title')}
          </Typography>
          <Box>
            <IconButton onClick={selectPrevious}>
              <ArrowBackIosOutlinedIcon color="blue" />
            </IconButton>
            <IconButton onClick={selectNext}>
              <ArrowForwardIosOutlinedIcon color="blue" />
            </IconButton>
          </Box>
        </Box>
        <BadgeModelInfoPreview badgeModel={badgeModels[selectedBadgeModel]} />
      </SafeSuspense>
    )
  }

  return (
    <>
      <FilteredList
        loading={loading}
        loadingColor={'blue'}
        preview={renderSelectedBadgePreview()}
        search={search}
        title={t('explorer.title')}
        titleColor={colors.blue}
      >
        {badgeModels.length > 0 ? (
          badgeModels.map((bt, i) => {
            const isSelected = bt.id === badgeModels[selectedBadgeModel]?.id
            return (
              <InViewPort key={bt.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
                  <MiniBadgePreviewContainer
                    highlightColor={colors.blue}
                    onClick={() => setSelectedBadgeModel(i)}
                    ref={badgeModelsElementRefs[i]}
                    selected={isSelected}
                  >
                    <MiniBadgeModelPreview
                      buttonTitle={t('explorer.button')}
                      disableAnimations
                      highlightColor={colors.blue}
                      metadata={bt.uri}
                    />
                  </MiniBadgePreviewContainer>
                </SafeSuspense>
              </InViewPort>
            )
          })
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('explorer.noBadgesFound')} />
          </Stack>
        )}
      </FilteredList>
    </>
  )
}

export default withPageGenericSuspense(ExploreBadgeModels, { spinner: { color: 'blue' } })
