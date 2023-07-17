import { useRouter } from 'next/navigation'
import React from 'react'

import { Box } from '@mui/material'
import { EmptyBadgePreview } from '@thebadge/ui-library'
import { EffectCoverflow, Pagination } from 'swiper'

import InViewPort from '@/src/components/helpers/InViewPort'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import { fillListWithPlaceholders } from '@/src/components/utils/emptyBadges'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import BadgeModelPreview from '@/src/pagePartials/badge/BadgeModelPreview'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function BadgeListTypeList() {
  const gql = useSubgraph()
  const router = useRouter()

  const badgeModels = gql
    .useBadgeModelsMaxAmount({ first: 10 })
    .data?.badgeModels?.map((badgeModel) => {
      return (
        <Box
          key={badgeModel.id}
          onClick={() => router.push(`/badge/mint/${badgeModel.id}`)}
          sx={{ height: '100%', display: 'flex' }}
        >
          <InViewPort minHeight={300} minWidth={180}>
            <SafeSuspense>
              <BadgeModelPreview effects metadata={badgeModel?.uri} size="small" />
            </SafeSuspense>
          </InViewPort>
        </Box>
      )
    })
  // If there is no badges to show, we list 5 placeholders
  const badgeModelsList = fillListWithPlaceholders(
    badgeModels,
    <EmptyBadgePreview size="small" />,
    5,
  )

  return (
    <TBSwiper
      centeredSlides={true}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 1,
        scale: 1,
        slideShadows: false,
      }}
      effect={'coverflow'}
      grabCursor={true}
      initialSlide={2}
      items={badgeModelsList}
      loop={false}
      maxSlidesPerView={4}
      modules={[EffectCoverflow, Pagination]}
      noArrows
      pagination={{ type: 'bullets', clickable: true }}
      spaceBetween={12}
      style={{
        padding: '20px 0 56px 43px',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '--swiper-pagination-bullet-inactive-color': '#ffffff',
      }}
    />
  )
}
