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
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import ThirdPartyBadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/ThirdPartyBadgeEvidenceInfoPreview'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { Badge } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeModels: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const badgeModelId = useModelIdParam()
  const badgeModel = useBadgeModel(badgeModelId)

  const [badges, setBadge] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeModelIndex, setSelectedBadgeModelIndex] = useState<number>(0)

  const badgeModelsElementRefs: RefObject<HTMLLIElement>[] = badges.map(() =>
    createRef<HTMLLIElement>(),
  )
  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadgeModelIndex,
    badgeModelsElementRefs,
    selectedBadgeModelIndex,
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
      setSelectedBadgeModelIndex(0)
    }, 2000)
  }

  if (!badgeModel.data) {
    return null
  }

  function renderSelectedBadgePreview() {
    const selectedBadge = badges[selectedBadgeModelIndex]
    if (!selectedBadge) return null

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
          {badgeModel.data?.badgeModel.controllerType == BadgeModelControllerType.Community ? (
            <BadgeEvidenceInfoPreview badge={selectedBadge} />
          ) : (
            <ThirdPartyBadgeEvidenceInfoPreview badge={selectedBadge} />
          )}
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
        title={
          badgeModel.data.badgeModel.controllerType == BadgeModelControllerType.Community
            ? t('explorer.curate.title')
            : t('explorer.thirdParty.title')
        }
      >
        {badges.length > 0 ? (
          badges.map((badge, i) => {
            const isSelected = badge.id === badges[selectedBadgeModelIndex]?.id
            return (
              <InViewPort key={badge.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<BadgePreviewLoading />}>
                  <BadgePreviewContainer
                    highlightColor={colors.blue}
                    onClick={() => setSelectedBadgeModelIndex(i)}
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

export default withPageGenericSuspense(ExploreBadgeModels, { spinner: { color: 'blue' } })
