import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Typography, keyframes, styled, useTheme } from '@mui/material'
import { A11y, Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ButtonV2, colors } from 'thebadge-ui-library'

import {
  SectionBox,
  SectionTitleBox,
  badgesExampleList,
} from '@/src/pagePartials/home/SectionBoxes'
import { useSectionReferences } from '@/src/providers/referencesProvider'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const LearnMoreButton = styled(ButtonV2)(({ theme }) => ({
  borderRadius: '10px',
  fontSize: '11px !important',
  padding: '0.5rem 1rem !important',
  height: 'fit-content !important',
  lineHeight: '14px',
  fontWeight: 700,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.text.primary}`,
  '&:hover': {
    backgroundColor: colors.transparent,
    border: `1px solid ${theme.palette.text.secondary}`,
    color: theme.palette.text.secondary,
  },
}))

const growEffect = keyframes`
  0% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
`

export default function EarnByCurating() {
  const { earnByCuratingSection } = useSectionReferences()
  const theme = useTheme()

  return (
    <SectionBox ref={earnByCuratingSection}>
      <SectionTitleBox>
        <Box>
          <Typography variant={'caption'}>Become a Curator</Typography>
          <Typography
            mb={2.5}
            sx={{ fontSize: '25px !important', fontWeight: 700, lineHeight: '30px !important' }}
          >
            Earn by Curating
          </Typography>
        </Box>

        <LearnMoreButton
          backgroundColor={colors.transparent}
          fontColor={theme.palette.text.primary}
        >
          LEARN MORE
        </LearnMoreButton>
      </SectionTitleBox>

      <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ArrowBackIosIcon
          className={'badges-swiper-button-prev'}
          sx={{
            mr: '1rem',
            height: '35px',
            width: '35px',
            animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
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
            animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
          }}
        />
      </Box>
    </SectionBox>
  )
}
