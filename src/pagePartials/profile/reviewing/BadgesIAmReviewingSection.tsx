import { useRouter } from 'next/navigation'
import React, { RefObject, createRef, useState } from 'react'

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

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
import {
  getChallengedBadgesId,
  updateChallengedBadgesId,
} from '@/src/utils/badges/challengeBadgesHelpers'
import { generateBadgeCurate } from '@/src/utils/navigation/generateUrl'
import { Badge } from '@/types/generated/subgraph'

const filters: Array<ListFilter<'In Review' | 'Challenged'>> = [
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
    // Validate if the response has the badges that the user has challenged recently
    // this is done to prevent the use of @live on queries, that would make it refresh
    // continuously, in the other hand these methods only refresh until it get all the recently challenged badges
    const pendingBadgesReviewedToFetch = getChallengedBadgesId(address)
    const badgesIamReviewingIds = badgesIamReviewing.map((badge) => badge.id)
    // Filter the pendingBadgesReviewedToFetch that are not inside badgesIamReviewingIds
    const stillMissingBadges = pendingBadgesReviewedToFetch.filter(
      (pendingId) => !badgesIamReviewingIds.includes(pendingId),
    )
    updateChallengedBadgesId(stillMissingBadges, address)
    // If there are missing badges, we call the search again in a few
    if (stillMissingBadges.length > 0) {
      setTimeout(() => {
        search(selectedFilters, selectedCategory, textSearch)
      }, 15000)
    }
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
              onClick={() => router.push(generateBadgeCurate())}
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
