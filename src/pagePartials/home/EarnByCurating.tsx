import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Typography } from '@mui/material'
import { A11y, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ButtonV2, colors } from 'thebadge-ui-library'

import {
  SectionBox,
  SectionTitleBox,
  badgesExampleList,
} from '@/src/pagePartials/home/SectionBoxes'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function EarnByCurating() {
  return (
    <SectionBox>
      <SectionTitleBox>
        <Box>
          <Typography variant={'caption'}>Become a Curator</Typography>
          <Typography fontSize={'25px'} fontWeight={700} lineHeight={'30px'} mb={2.5}>
            Earn by Curating
          </Typography>
        </Box>

        <ButtonV2
          backgroundColor={colors.transparent}
          fontColor={colors.black}
          sx={{
            borderRadius: '10px',
            fontSize: '11px !important',
            padding: '0.5rem 1rem !important',
            height: 'fit-content !important',
            lineHeight: '14px',
            fontWeight: 700,
            boxShadow: 'none',
            border: `1px solid ${colors.black}`,
            '&:hover': {
              backgroundColor: colors.transparent,
              border: `1px solid ${colors.white}`,
              color: colors.white,
            },
          }}
        >
          LEARN MORE
        </ButtonV2>
      </SectionTitleBox>

      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ArrowBackIosIcon
          className={'badges-swiper-button-prev'}
          sx={{
            mr: '1rem',
            height: '35px',
            width: '35px',
          }}
        />
        <Swiper
          modules={[Navigation, A11y]}
          navigation={{
            nextEl: '.badges-swiper-button-next',
            prevEl: '.badges-swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          slidesPerView={4}
          spaceBetween={25}
        >
          {badgesExampleList.map((badge, index) => (
            <SwiperSlide key={'swiper-badge-' + index}>{badge}</SwiperSlide>
          ))}
        </Swiper>
        <ArrowForwardIosIcon
          className={'badges-swiper-button-next'}
          sx={{
            ml: '1rem',
            height: '35px',
            width: '35px',
          }}
        />
      </Box>
    </SectionBox>
  )
}
