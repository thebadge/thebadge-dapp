import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, keyframes, useTheme } from '@mui/material'
import { A11y, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

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
  slidesPerView?: number
  spaceBetween?: number
  itemsScale?: string
  leftPadding?: string
  rightPadding?: string
}

export default function TBSwiper(props: TBSwiperProps) {
  const swiperId = 'id' + Math.random().toString(16).slice(2)
  const theme = useTheme()
  const sm = useSizeSM()
  const md = useSizeMD()
  const lg = useSizeLG()

  const amountItems = () => {
    if (sm) {
      return 1
    } else if (md) {
      return 2
    } else if (lg) {
      return 3
    } else {
      return 4
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
      <ArrowBackIosIcon
        className={'tb-swiper-button-prev-' + swiperId}
        sx={{
          mr: props.leftPadding || '0.5rem',
          height: '35px',
          width: '35px',
          animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
        }}
      />
      <Swiper
        loop={true}
        modules={[Navigation, A11y]}
        navigation={{
          nextEl: '.tb-swiper-button-next-' + swiperId,
          prevEl: '.tb-swiper-button-prev-' + swiperId,
        }}
        pagination={{ clickable: true }}
        slidesPerView={props.slidesPerView || amountItems()}
        spaceBetween={props.spaceBetween || 25}
      >
        {props.items.map((item, index) => (
          <SwiperSlide key={'swiper-slide-' + swiperId + '-' + index}>
            <Box sx={{ scale: props.itemsScale || '1' }}>{item}</Box>
          </SwiperSlide>
        ))}
      </Swiper>
      <ArrowForwardIosIcon
        className={'tb-swiper-button-next-' + swiperId}
        sx={{
          ml: props.rightPadding || '0.5rem',
          height: '35px',
          width: '35px',
          animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
        }}
      />
    </Box>
  )
}
