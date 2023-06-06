import React, { RefObject, createRef, useCallback, useEffect, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { nowInSeconds } from '@/src/constants/helpers'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useKeyPress } from '@/src/hooks/useKeypress'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
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
  const leftPress = useKeyPress('ArrowLeft')
  const rightPress = useKeyPress('ArrowRight')

  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeIndex, setSelectedBadgeIndex] = useState<number>(0)

  const badgesElementRefs: RefObject<HTMLLIElement>[] = badges.map(() => createRef<HTMLLIElement>())

  const selectPreviousBadge = useCallback(() => {
    if (!badges.length) return
    setSelectedBadgeIndex((prevIndex) => {
      if (prevIndex === 0) return badges.length - 1
      return prevIndex - 1
    })
  }, [badges.length])

  const selectNextBadge = useCallback(() => {
    if (!badges.length) return
    setSelectedBadgeIndex((prevIndex) => {
      if (prevIndex === badges.length - 1) return 0
      return prevIndex + 1
    })
  }, [badges.length])

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    setSelectedBadgeIndex(0)
    setBadges([])

    const badgesInReview = await gql.badgesInReviewSmallSet({
      date: selectedFilters.some((f) => f.key == BadgeStatus.Approved) ? 0 : now,
      statuses: selectedFilters.map((f) => f.key) as Array<BadgeStatus>,
      badgeReceiver: textSearch ? textSearch.toLowerCase() : '0x',
    })
    const badges = (badgesInReview.badges as Badge[]) || []
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
            {t('explorer.curate.title')}
          </Typography>
          <Box>
            <IconButton onClick={selectPreviousBadge}>
              <ArrowBackIosOutlinedIcon color="green" />
            </IconButton>
            <IconButton onClick={selectNextBadge}>
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

  useEffect(() => {
    // Each time that a new item is selected, we scroll to it
    if (badgesElementRefs[selectedBadgeIndex]?.current) {
      window.scrollTo({
        top:
          (badgesElementRefs[selectedBadgeIndex].current?.offsetTop || 0) -
          (badgesElementRefs[selectedBadgeIndex].current?.offsetHeight || 0),
        behavior: 'smooth',
      })
    }
  }, [badgesElementRefs, selectedBadgeIndex])

  useEffect(() => {
    if (leftPress) selectPreviousBadge()
  }, [leftPress, selectPreviousBadge])

  useEffect(() => {
    if (rightPress) selectNextBadge()
  }, [rightPress, selectNextBadge])

  return (
    <>
      <FilteredList
        filters={filters}
        loading={loading}
        loadingColor={'green'}
        preview={renderSelectedBadgePreview()}
        search={search}
        title={t('curateExplorer.title')}
      >
        {badges.length > 0 ? (
          badges.map((badge, i) => {
            const isSelected = badge.id === badges[selectedBadgeIndex]?.id

            return (
              <InViewPort key={badge.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
                  <MiniBadgePreviewContainer
                    highlightColor={colors.greenLogo}
                    ref={badgesElementRefs[i]}
                    selected={isSelected}
                  >
                    <MiniBadgeModelPreview
                      buttonTitle={t('curateExplorer.button')}
                      disableAnimations
                      highlightColor={colors.greenLogo}
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
