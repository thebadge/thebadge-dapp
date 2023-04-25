import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Box } from '@mui/material'
import { EffectCoverflow, Pagination } from 'swiper'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import useSubgraph from '@/src/hooks/subgraph/useSubgraph'
import BadgeTypeMetadata from '@/src/pagePartials/badge/BadgeTypeMetadata'
import { badgesExampleList } from '@/src/pagePartials/home/SectionBoxes'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function BadgeListTypeList() {
  const gql = useSubgraph()
  const badgeTypes = gql.useBadgeTypes()
  const router = useRouter()

  const badgesList = useMemo(() => {
    const badges = badgeTypes.data?.badgeTypes.map((badgeType) => {
      return (
        <Box
          key={badgeType.id}
          onClick={() => router.push(`/badge/mint/${badgeType.id}`)}
          sx={{ height: '100%', display: 'flex' }}
        >
          <SafeSuspense>
            <BadgeTypeMetadata metadata={badgeType?.metadataURL} size="small" />
          </SafeSuspense>
        </Box>
      )
    })
    // TODO Remove badgesExampleList when we have more volumen to complete the list
    if (!badges) return badgesExampleList
    if (badges.length >= 5) {
      return badges
    }
    return [...badges, ...badgesExampleList].slice(0, 5)
  }, [badgeTypes.data?.badgeTypes, router])

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
      items={badgesList}
      maxSlidesPerView={4}
      modules={[EffectCoverflow, Pagination]}
      noArrows
      pagination={{ type: 'bullets', clickable: true }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      style={{ padding: '0 0 56px 35px', '--swiper-pagination-bullet-inactive-color': '#ffffff' }}
    />
  )
}
