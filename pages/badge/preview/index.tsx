import { useRouter } from 'next/router'
import React, { RefObject, Suspense, createRef, useCallback, useEffect, useState } from 'react'

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
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useKeyPress } from '@/src/hooks/useKeypress'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import BadgeEvidenceInfoPreview from '@/src/pagePartials/badge/explorer/BadgeEvidenceInfoPreview'
import { Badge } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ViewListOfBadgesByType: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const gql = useSubgraph()
  const router = useRouter()
  const badgeTypeId = router.query.typeId as string

  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadge, setSelectedBadge] = useState<number>(0)

  const badgeTypesElementRefs: RefObject<HTMLLIElement>[] = badges.map(() =>
    createRef<HTMLLIElement>(),
  )

  useEffect(() => {
    // Each time that a new item is selected, we scroll to it
    if (badgeTypesElementRefs[selectedBadge]?.current) {
      window.scrollTo({
        top:
          (badgeTypesElementRefs[selectedBadge].current?.offsetTop || 0) -
          (badgeTypesElementRefs[selectedBadge].current?.offsetHeight || 0),
        behavior: 'smooth',
      })
    }
  }, [badgeTypesElementRefs, selectedBadge])

  const selectPreviousBadgeType = useCallback(() => {
    if (!badges.length) return
    setSelectedBadge((prevIndex) => {
      if (prevIndex === 0) return badges.length - 1
      return prevIndex - 1
    })
  }, [badges.length])

  const selectNextBadgeType = useCallback(() => {
    if (!badges.length) return
    setSelectedBadge((prevIndex) => {
      if (prevIndex === badges.length - 1) return 0
      return prevIndex + 1
    })
  }, [badges.length])

  const leftPress = useKeyPress('ArrowLeft')
  const rightPress = useKeyPress('ArrowRight')

  useEffect(() => {
    if (leftPress) selectPreviousBadgeType()
  }, [leftPress, selectPreviousBadgeType])

  useEffect(() => {
    if (rightPress) selectNextBadgeType()
  }, [rightPress, selectNextBadgeType])

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const badgesByType = await gql.badgeByModelId({ id: badgeTypeId })
    const badges = (badgesByType.badges as Badge[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadges(badges)
      setSelectedBadge(0)
    }, 2000)
  }

  function renderSelectedBadgePreview() {
    if (!badges[selectedBadge]) return null
    return (
      <SafeSuspense>
        <Box display="flex" justifyContent="space-between">
          <Typography color={colors.blue} mb={4} variant="dAppHeadline2">
            {t('explorer.minted.subtitle')}
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
        <Suspense>
          <BadgeEvidenceInfoPreview badge={badges[selectedBadge]} />
        </Suspense>
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
        title={t('explorer.minted.title', {
          badgeTypeName: badges[selectedBadge]?.badgeModel?.id,
        })}
      >
        {badges.length > 0 ? (
          badges.map((bt, i) => {
            const isSelected = bt.id === badges[selectedBadge]?.id
            return (
              <InViewPort key={bt.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
                  <MiniBadgePreviewContainer
                    highlightColor={colors.purple}
                    onClick={() => setSelectedBadge(i)}
                    ref={badgeTypesElementRefs[i]}
                    selected={isSelected}
                  >
                    <BadgeTypeMetadata
                      metadata={badges[selectedBadge].badgeModel.uri}
                      size="small"
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

export default withPageGenericSuspense(ViewListOfBadgesByType, { spinner: { color: 'blue' } })
