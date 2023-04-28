import React, { RefObject, createRef, useEffect, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import { MiniBadgePreviewContainer } from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useKeyPress } from '@/src/hooks/useKeypress'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import { Badge } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const now = Math.floor(Date.now() / 1000 - 1000 * 60 * 60 * 24 * 30)

const filters: Array<ListFilter> = [
  {
    title: 'Minted',
    color: 'blue',
  },
  {
    title: 'In Review',
    color: 'green',
    defaultSelected: true,
    fixed: true,
  },
  {
    title: 'Approved',
    color: 'darkGreen',
  },
  {
    title: 'Challenged',
    color: 'pink',
  },
]

const CurateBadges: NextPageWithLayout = () => {
  const { t } = useTranslation()

  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadge, setSelectedBadge] = useState<number>(0)

  const badgesElementRefs: RefObject<HTMLLIElement>[] = badges.map(() => createRef<HTMLLIElement>())

  const gql = useSubgraph()

  const leftPress = useKeyPress('ArrowLeft')
  const rightPress = useKeyPress('ArrowRight')

  useEffect(() => {
    // Each time that a new item is selected, we scroll to it
    if (badgesElementRefs[selectedBadge]?.current) {
      window.scrollTo({
        top:
          (badgesElementRefs[selectedBadge].current?.offsetTop || 0) -
          (badgesElementRefs[selectedBadge].current?.offsetHeight || 0),
        behavior: 'smooth',
      })
    }
  }, [badgesElementRefs, selectedBadge])

  useEffect(() => {
    if (badges.length && rightPress) {
      selectNextBadge()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightPress])

  useEffect(() => {
    if (badges.length && leftPress) {
      selectPreviousBadge()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPress])

  function selectPreviousBadge() {
    setSelectedBadge((prevIndex) => {
      if (prevIndex === 0) return badges.length - 1
      return prevIndex - 1
    })
  }
  function selectNextBadge() {
    setSelectedBadge((prevIndex) => {
      if (prevIndex === badges.length - 1) return 0
      return prevIndex + 1
    })
  }

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const badgesInReview = await gql.badgesInReviewSmallSet({ date: now })
    const badges = (badgesInReview.badges as Badge[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadges(badges)
      setSelectedBadge(0)
    }, 2000)
  }

  function renderSelectedBadgePreview() {
    if (!badges[selectedBadge]) return null
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
          <BadgeEvidenceInfoPreview badge={badges[selectedBadge]} />
        </SafeSuspense>
      </>
    )
  }

  return (
    <>
      <FilteredList
        disableEdit
        filters={filters}
        loading={loading}
        loadingColor={'green'}
        preview={renderSelectedBadgePreview()}
        search={search}
        title={t('curateExplorer.title')}
      >
        {badges.length > 0 ? (
          badges.map((badge, i) => {
            const isSelected = badge.id === badges[selectedBadge]?.id

            return (
              <MiniBadgePreviewContainer
                highlightColor={colors.greenLogo}
                key={badge.id}
                ref={badgesElementRefs[i]}
                selected={isSelected}
              >
                <MiniBadgeTypeMetadata
                  buttonTitle={t('curateExplorer.button')}
                  disableAnimations
                  highlightColor={colors.greenLogo}
                  metadata={badge.badgeType.metadataURL}
                  onClick={() => setSelectedBadge(i)}
                />
              </MiniBadgePreviewContainer>
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
