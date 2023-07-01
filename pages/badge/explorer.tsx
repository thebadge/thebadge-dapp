import React, { RefObject, createRef, useCallback, useEffect, useState } from 'react'

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
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useKeyPress } from '@/src/hooks/useKeypress'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeModelInfoPreview from '@/src/pagePartials/badge/explorer/BadgeModelInfoPreview'
import { BadgeModel } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeTypes: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const [badgeModels, setBadgeModels] = useState<BadgeModel[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeModel, setSelectedBadgeType] = useState<number>(0)

  const badgeModelsElementRefs: RefObject<HTMLLIElement>[] = badgeModels.map(() =>
    createRef<HTMLLIElement>(),
  )
  const gql = useSubgraph()

  const leftPress = useKeyPress('ArrowLeft')
  const rightPress = useKeyPress('ArrowRight')

  useEffect(() => {
    // Each time that a new item is selected, we scroll to it
    if (badgeModelsElementRefs[selectedBadgeModel]?.current) {
      window.scrollTo({
        top:
          (badgeModelsElementRefs[selectedBadgeModel].current?.offsetTop || 0) -
          (badgeModelsElementRefs[selectedBadgeModel].current?.offsetHeight || 0),
        behavior: 'smooth',
      })
    }
  }, [badgeModelsElementRefs, selectedBadgeModel])

  const selectPreviousBadgeType = useCallback(() => {
    if (!badgeModels.length) return
    setSelectedBadgeType((prevIndex) => {
      if (prevIndex === 0) return badgeModels.length - 1
      return prevIndex - 1
    })
  }, [badgeModels.length])

  const selectNextBadgeType = useCallback(() => {
    if (!badgeModels.length) return
    setSelectedBadgeType((prevIndex) => {
      if (prevIndex === badgeModels.length - 1) return 0
      return prevIndex + 1
    })
  }, [badgeModels.length])

  useEffect(() => {
    if (rightPress) {
      selectNextBadgeType()
    }
  }, [rightPress, selectNextBadgeType])

  useEffect(() => {
    if (leftPress) {
      selectPreviousBadgeType()
    }
  }, [leftPress, selectPreviousBadgeType])

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const badgeModels = await gql.badgeModels()
    const badges = (badgeModels.badgeModels as BadgeModel[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadgeModels(badges)
      setSelectedBadgeType(0)
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
            <IconButton onClick={selectPreviousBadgeType}>
              <ArrowBackIosOutlinedIcon color="blue" />
            </IconButton>
            <IconButton onClick={selectNextBadgeType}>
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
      >
        {badgeModels.length > 0 ? (
          badgeModels.map((bt, i) => {
            const isSelected = bt.id === badgeModels[selectedBadgeModel]?.id
            return (
              <InViewPort key={bt.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
                  <MiniBadgePreviewContainer
                    highlightColor={colors.blue}
                    onClick={() => setSelectedBadgeType(i)}
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

export default withPageGenericSuspense(ExploreBadgeTypes, { spinner: { color: 'blue' } })
