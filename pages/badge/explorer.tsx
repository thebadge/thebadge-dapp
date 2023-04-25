import React, { RefObject, createRef, useEffect, useState } from 'react'

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
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import { useKeyPress } from '@/src/hooks/useKeypress'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import BadgeInfoPreview from '@/src/pagePartials/badge/explorer/BadgeInfoPreview'
import { BadgeType } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeTypes: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const [badgeTypes, setBadgeTypes] = useState<BadgeType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeType, setSelectedBadgeType] = useState<number>(0)

  const badgeTypesElementRefs: RefObject<HTMLLIElement>[] = badgeTypes.map(() =>
    createRef<HTMLLIElement>(),
  )
  const gql = useSubgraph()

  const leftPress = useKeyPress('ArrowLeft')
  const rightPress = useKeyPress('ArrowRight')

  useEffect(() => {
    // Each time that a new item is selected, we scroll to it
    if (badgeTypesElementRefs[selectedBadgeType]?.current) {
      window.scrollTo({
        top:
          (badgeTypesElementRefs[selectedBadgeType].current?.offsetTop || 0) -
          (badgeTypesElementRefs[selectedBadgeType].current?.offsetHeight || 0),
        behavior: 'smooth',
      })
    }
  }, [badgeTypesElementRefs, selectedBadgeType])

  useEffect(() => {
    if (badgeTypes.length && rightPress) {
      selectNextBadgeType()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightPress])

  useEffect(() => {
    if (badgeTypes.length && leftPress) {
      selectPreviousBadgeType()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPress])

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)

    // TODO filter badges using filters, category, text
    const badgeTypes = await gql.badgeTypes()
    const badges = (badgeTypes.badgeTypes as BadgeType[]) || []

    setTimeout(() => {
      setLoading(false)
      setBadgeTypes(badges)
      setSelectedBadgeType(0)
    }, 2000)
  }

  function selectPreviousBadgeType() {
    setSelectedBadgeType((prevIndex) => {
      if (prevIndex === 0) return badgeTypes.length - 1
      return prevIndex - 1
    })
  }
  function selectNextBadgeType() {
    setSelectedBadgeType((prevIndex) => {
      if (prevIndex === badgeTypes.length - 1) return 0
      return prevIndex + 1
    })
  }

  function renderSelectedBadgePreview() {
    if (!badgeTypes[selectedBadgeType]) return null
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
        <BadgeInfoPreview badgeType={badgeTypes[selectedBadgeType]} />
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
        {badgeTypes.length > 0 ? (
          badgeTypes.map((bt, i) => {
            const isSelected = bt.id === badgeTypes[selectedBadgeType]?.id
            return (
              <SafeSuspense fallback={<MiniBadgePreviewLoading />} key={bt.id}>
                <MiniBadgePreviewContainer
                  highlightColor={colors.blue}
                  onClick={() => setSelectedBadgeType(i)}
                  ref={badgeTypesElementRefs[i]}
                  selected={isSelected}
                >
                  <MiniBadgeTypeMetadata
                    buttonTitle={t('explorer.button')}
                    disableAnimations
                    highlightColor={colors.blue}
                    metadata={bt.metadataURL}
                  />
                </MiniBadgePreviewContainer>
              </SafeSuspense>
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
