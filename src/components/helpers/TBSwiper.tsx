'use client'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, keyframes, useTheme } from '@mui/material'
import { A11y, Navigation } from 'swiper'
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'

import { useSizeLG, useSizeMD, useSizeSM } from '@/src/hooks/useSize'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const growEffect = keyframes`
  0% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
`

type TBSwiperProps = {
  items: React.ReactNode[]
  maxSlidesPerView?: number
  spaceBetween?: number
  itemsScale?: string
  leftPadding?: string
  rightPadding?: string
  noArrows?: boolean
} & SwiperProps

export default function TBSwiper({
  items,
  itemsScale,
  leftPadding,
  maxSlidesPerView,
  noArrows,
  rightPadding,
  spaceBetween,
  ...props
}: TBSwiperProps) {
  const swiperId = 'id' + Math.random().toString(16).slice(2)
  const theme = useTheme()
  const sm = useSizeSM()
  const md = useSizeMD()
  const lg = useSizeLG()

  const amountItems = () => {
    const maxItems = maxSlidesPerView || 4
    if (sm) {
      return 1
    } else if (md) {
      return maxItems < 2 ? maxItems : 2
    } else if (lg) {
      return maxItems < 3 ? maxItems : 3
    } else {
      return maxItems
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {!noArrows && (
        <ArrowBackIosIcon
          className={'tb-swiper-button-prev-' + swiperId}
          sx={{
            mr: leftPadding || '0.5rem',
            height: '35px',
            width: '35px',
            animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
          }}
        />
      )}

      <Swiper
        loop={true}
        modules={props.modules ? [Navigation, A11y, ...props.modules] : [Navigation, A11y]}
        navigation={{
          nextEl: '.tb-swiper-button-next-' + swiperId,
          prevEl: '.tb-swiper-button-prev-' + swiperId,
        }}
        pagination={{ clickable: true }}
        slidesPerView={amountItems()}
        spaceBetween={spaceBetween || 25}
        {...props}
      >
        {items.map((item, index) => (
          <SwiperSlide key={'swiper-slide-' + swiperId + '-' + index}>
            <Box sx={{ scale: itemsScale || '1', display: 'flex', justifyContent: 'center' }}>
              {item}
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
      {!noArrows && (
        <ArrowForwardIosIcon
          className={'tb-swiper-button-next-' + swiperId}
          sx={{
            ml: rightPadding || '0.5rem',
            height: '35px',
            width: '35px',
            animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
          }}
        />
      )}
    </Box>
  )
}
