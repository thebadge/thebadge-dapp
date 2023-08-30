import React, { RefObject, createRef, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  BadgePreviewContainer,
  BadgePreviewLoading,
} from '@/src/components/common/BadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import { Badge } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeTypes: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const badgeModelId = useModelIdParam()

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
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
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
      <>
        <Box display="flex" justifyContent="space-between">
          <Typography color={colors.blue} mb={4} variant="dAppHeadline2">
            {t('explorer.curate.title')}
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
        <SafeSuspense>
          <BadgeEvidenceInfoPreview badge={badges[selectedBadge]} />
        </SafeSuspense>
      </>
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
        {badges.length > 0 ? (
          badges.map((badge, i) => {
            const isSelected = badge.id === badges[selectedBadge]?.id
            return (
              <InViewPort key={badge.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<BadgePreviewLoading />}>
                  <BadgePreviewContainer
                    highlightColor={colors.blue}
                    onClick={() => setSelectedBadgeModel(i)}
                    ref={badgeModelsElementRefs[i]}
                    selected={isSelected}
                  >
                    <BadgeModelPreview metadata={badge.badgeModel.uri} size="small" />
                  </BadgePreviewContainer>
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
