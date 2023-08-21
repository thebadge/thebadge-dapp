import { useRouter } from 'next/navigation'
import React, { RefObject, createRef, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { NoResultsAnimated } from '@/src/components/assets/animated/NoResults'
import {
  MiniBadgePreviewContainer,
  MiniBadgePreviewLoading,
} from '@/src/components/common/MiniBadgePreviewContainer'
import FilteredList, { ListFilter } from '@/src/components/helpers/FilteredList'
import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import useListItemNavigation from '@/src/hooks/useListItemNavigation'
import MiniBadgeModelPreview from '@/src/pagePartials/badge/MiniBadgeModelPreview'
import BadgeReviewingInfoPreview from '@/src/pagePartials/profile/reviewing/BadgeEvidenceInfoPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Badge } from '@/types/generated/subgraph'

const filters: Array<ListFilter> = [
  {
    title: 'In Review',
    color: 'green',
    fixed: true,
    defaultSelected: true,
  },
  {
    title: 'Challenged',
    color: 'pink',
    fixed: true,
    defaultSelected: true,
  },
]

export default function BadgesIAmReviewingSection() {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const router = useRouter()
  const gql = useSubgraph()

  const [badgesIamReviewing, setItems] = useState<Badge[]>([])
  const [selectedBadge, setSelectedBadge] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const badgesElementRefs: RefObject<HTMLLIElement>[] = badgesIamReviewing.map(() =>
    createRef<HTMLLIElement>(),
  )
  const { selectNext, selectPrevious } = useListItemNavigation(
    setSelectedBadge,
    badgesElementRefs,
    selectedBadge,
    badgesIamReviewing.length,
  )

  const search = async (
    selectedFilters: Array<ListFilter>,
    selectedCategory: string,
    textSearch?: string,
  ) => {
    setLoading(true)
    // TODO filter badges with: selectedFilters, selectedCategory, textSearch
    const badgesMetadataIamReviewing = await gql.badgesMetaDataUserChallenged({
      userAddress: address,
    })
    const badgesIamReviewing = badgesMetadataIamReviewing.badgeKlerosMetaDatas.map(
      (metadata) => metadata.badge,
    ) as Badge[]

    setItems(badgesIamReviewing)
    setLoading(false)
  }

  function renderSelectedBadgePreview() {
    if (!badgesIamReviewing[selectedBadge]) return null
    return (
      <SafeSuspense>
        <Box display="flex" justifyContent="space-between">
          <Typography color={colors.purple} mb={4} variant="dAppHeadline2">
            {t('profile.badgesIAmReviewing.previewTitle')}
          </Typography>
          <Box>
            <IconButton onClick={selectPrevious}>
              <ArrowBackIosOutlinedIcon color="purple" />
            </IconButton>
            <IconButton onClick={selectNext}>
              <ArrowForwardIosOutlinedIcon color="purple" />
            </IconButton>
          </Box>
        </Box>
        <BadgeReviewingInfoPreview badge={badgesIamReviewing[selectedBadge]} />
      </SafeSuspense>
    )
  }
  if (!address) return null

  return (
    <>
      <FilteredList
        disableEdit
        filters={filters}
        loading={loading}
        loadingColor={'green'}
        preview={renderSelectedBadgePreview()}
        search={search}
        showTextSearch={false}
        title={t('profile.badgesIAmReviewing.title')}
        titleColor={colors.purple}
      >
        {badgesIamReviewing.length > 0 ? (
          badgesIamReviewing.map((badge, i) => {
            const isSelected = badge.id === badgesIamReviewing[selectedBadge]?.id
            return (
              <InViewPort key={badge.id} minHeight={300} minWidth={180}>
                <SafeSuspense fallback={<MiniBadgePreviewLoading />}>
                  <MiniBadgePreviewContainer
                    highlightColor={colors.purple}
                    onClick={() => setSelectedBadge(i)}
                    ref={badgesElementRefs[i]}
                    selected={isSelected}
                  >
                    <MiniBadgeModelPreview
                      disableAnimations
                      highlightColor={colors.purple}
                      metadata={badge.badgeModel?.uri}
                    />
                  </MiniBadgePreviewContainer>
                </SafeSuspense>
              </InViewPort>
            )
          })
        ) : (
          <Stack>
            <NoResultsAnimated errorText={t('profile.badgesIAmReviewing.noResults')} />
            <ButtonV2
              backgroundColor={colors.transparent}
              fontColor={colors.green}
              onClick={() => router.push('/badge/mint')}
              sx={{ m: 'auto' }}
            >
              <Typography>{t('profile.badgesIAmReviewing.curate')}</Typography>
            </ButtonV2>
          </Stack>
        )}
      </FilteredList>
    </>
  )
}
