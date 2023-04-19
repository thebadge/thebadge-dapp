import React, { useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { colors } from 'thebadge-ui-library'

import { NoResultsAnimated } from '@/src/components/assets/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import SafeSuspense, { withPageGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import MiniBadgeTypeMetadata from '@/src/pagePartials/badge/MiniBadgeTypeMetadata'
import BadgeInfoPreview from '@/src/pagePartials/badge/explorer/BadgeInfoPreview'
import { BadgeType } from '@/types/generated/subgraph'
import { NextPageWithLayout } from '@/types/next'

const ExploreBadgeTypes: NextPageWithLayout = () => {
  const { t } = useTranslation()
  const [badgeTypes, setBadgeTypes] = useState<BadgeType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedBadgeType, setSelectedBadgeType] = useState<number>(0)

  const gql = useSubgraph()

  const filters: Array<ListFilter> = [
    {
      title: 'Minted',
      color: 'blue',
    },
    {
      title: 'In Review',
      color: 'green',
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

  return (
    <>
      <FilteredList
        categories={['Category 1', 'Category 2', 'Category 3']}
        filters={filters}
        loading={loading}
        loadingColor={'blue'}
        preview={
          badgeTypes[selectedBadgeType] && (
            <SafeSuspense>
              <Box display="flex" justifyContent="space-between">
                <Typography color={colors.blue} mb={4} variant="dAppHeadline2">
                  BadgeType Info
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
        search={search}
        title={t('explorer.title')}
      >
        {badgeTypes.length > 0 ? (
          badgeTypes.map((bt, i) => {
            return (
              <SafeSuspense fallback={<MiniBadgePreviewLoading />} key={bt.id}>
                <MiniBadgePreviewContainer
                  highlightColor={colors.blue}
                  onClick={() => setSelectedBadgeType(i)}
                  selected={bt.id === badgeTypes[selectedBadgeType]?.id}
                >
                  <MiniBadgeTypeMetadata
                    buttonTitle={t('explorer.button')}
                    disableAnimations
                    highlightColor={colors.blue}
                    metadata={bt.metadataURL}
                    onClick={() => {
                      // router.push(`/badge/mint/${bt.id}`)
                    }}
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
