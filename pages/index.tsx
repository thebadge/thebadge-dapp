import { ReactElement } from 'react'

import { ArrowForwardIos } from '@mui/icons-material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, Divider, Typography, styled, useTheme } from '@mui/material'
import { A11y, Navigation } from 'swiper'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import {
  BadgePreviewV2,
  ButtonV2,
  ResizedBadgePreviewsList,
  SectionLayout,
  colors,
} from 'thebadge-ui-library'

import DefaultLayout from '@/src/components/layout/DefaultLayout'
import { useSectionReferences } from '@/src/providers/referencesProvider'
import { NextPageWithLayout } from '@/types/next'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const CertificationProcess: React.FC = () => {
  return (
    <div>
      <Typography
        alignItems={'center'}
        component="span"
        display={'flex'}
        fontSize={12}
        fontWeight={900}
        justifyContent={'center'}
        lineHeight={'15px'}
        marginBottom={10}
      >
        FULL CERTIFICATION PROCESS TUTORIAL
        <ArrowForwardIosOutlinedIcon />
      </Typography>
    </div>
  )
}

const SectionBox = styled('div')(({ theme }) => ({
  width: '100%',
  padding: '2.25rem 3.325rem',
}))

const SectionTitleBox = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))

// replace this with badges obtained from backend
const badgeExample = (
  <BadgePreviewV2
    {...{
      size: 'small',
      title: 'Diploma in Intellectual Property',
      category: 'Diploma certificate.',
      description:
        'User with address: 0xD28....16eC has a degree in intellectual property from Austral University',
      badgeUrl: 'https://www.thebadge.xyz',
      imageUrl:
        'https://images.unsplash.com/photo-1564054074885-e5a7c93671d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
      badgeBackgroundUrl:
        'https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      textContrast: 'light-withTextBackground',
    }}
  ></BadgePreviewV2>
)
const badgesExampleList = [badgeExample, badgeExample, badgeExample, badgeExample, badgeExample]

const ClaimBadges = () => {
  const theme = useTheme()
  return (
    <SectionBox>
      <SectionTitleBox>
        <Typography
          color={colors.blue}
          fontWeight={900}
          lineHeight={'30px'}
          mb={2.5}
          variant={'h5'}
        >
          Claim one of these badges
        </Typography>
        <ButtonV2
          sx={{
            color: '#0D0D0D',
            backgroundColor: `${theme.palette.button.backgroundBlue.main}`,
            borderRadius: '10px',
            fontSize: '11px !important',
            padding: '0.5rem 1rem !important',
            height: 'fit-content !important',
            lineHeight: '14px',
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          EXPLORE CERTIFICATES
        </ButtonV2>
      </SectionTitleBox>
      <Divider color={'#BDBDBD'} />
      <ResizedBadgePreviewsList badges={badgesExampleList} sx={{ scale: '0.5 !important' }} />
    </SectionBox>
  )
}

const EarnByCurating = () => {
  const swiper = useSwiper()

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
          sx={{
            color: colors.black,
            backgroundColor: colors.transparent,
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
        <ArrowForwardIos
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

const BadgeCreator = () => (
  <Box
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      placeContent: 'center',
      textAlign: 'center',
      minHeight: '200px',
    }}
  >
    <Typography color={colors.pink} variant="h4">
      Badge Creator
    </Typography>
    <Typography sx={{}}></Typography>
  </Box>
)

const ThirdParty = () => (
  <Box
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      placeContent: 'center',
      textAlign: 'center',
      minHeight: '200px',
    }}
  >
    <Typography color={colors.green} variant="h4">
      Third Party
    </Typography>
  </Box>
)

const Home: NextPageWithLayout = () => {
  const { homeSection } = useSectionReferences()
  const theme = useTheme()

  return (
    <Box display="flex" flexDirection="column" ref={homeSection}>
      <Typography component="h2" marginBottom={2} textAlign="center" variant="h2">
        Welcome to TheBadge!
      </Typography>
      <Typography component="div" marginBottom={10} textAlign="center" variant="h5">
        DECENTRALIZED CERTIFICATION PLATFORM
      </Typography>

      {/* Certification process */}
      <CertificationProcess />

      {/* Claim badges */}
      <SectionLayout
        backgroundColor={colors.transparent}
        borderColor={colors.greyBackground}
        components={[{ component: <ClaimBadges /> }]}
        sx={{
          boxShadow: `0px 0px 6px ${theme.palette.mainMenu.boxShadow.main}`,
          borderWidth: 'inherit !important',
          mb: '3rem',
        }}
      />

      {/* Earn by curating */}
      <SectionLayout
        backgroundColor={colors.greyBackground}
        components={[{ component: <EarnByCurating /> }]}
        sx={{
          borderWidth: 'inherit !important',
          borderTopLeftRadius: '0 !important',
          borderTopRightRadius: '0 !important',
          mb: '3rem',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          columnGap: '16px',
          justifyContent: 'center',
        }}
      >
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.pink}
          components={[{ component: <BadgeCreator /> }]}
          sx={{ borderWidth: '2px' }}
        />
        <SectionLayout
          backgroundColor={colors.transparent}
          borderColor={colors.green}
          components={[{ component: <ThirdParty /> }]}
          sx={{ borderWidth: '2px' }}
        />
      </Box>
    </Box>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <DefaultLayout>{page}</DefaultLayout>
}

export default Home
