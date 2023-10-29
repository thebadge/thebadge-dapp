'use client'

import { Stack, Typography, styled } from '@mui/material'
import { BoxBorderGradient, colors, gradients } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import { ProcessIllustration } from '@/src/components/assets/ProcessIllustration'
import { DOCS_URL } from '@/src/constants/common'
import { useSizeSM } from '@/src/hooks/useSize'

const BigTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  whiteSpace: 'pre-line',
  textShadow: '0px 0px 4px #3FC',
  fontSize: '53px',
  fontWeight: 800,
  lineHeight: '64px' /* 120.755% */,
  [theme.breakpoints.down('sm')]: {
    fontSize: '48px',
  },
  '#the-badge': {
    fontSize: '58px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '52px',
    },
  },
  '#welcome': {
    color: colors.green,
  },
}))

const ProcessTutorial = styled('a')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  fontSize: '12px !important',
  fontWeight: 900,
  justifyContent: 'center',
  lineHeight: '15px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    position: 'absolute',
    transform: 'translate(-50%, 0)',
    left: '50%',
    bottom: theme.spacing(-6),
    fontSize: '14px !important',
  },
}))

export default function WelcomeDecoration() {
  const { t } = useTranslation()
  const isMobile = useSizeSM()

  return (
    <BoxBorderGradient
      borderWidth="4px"
      gradient={gradients.gradient0}
      sx={{
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
        mt: isMobile ? 0 : 6,
        mb: 6,
        p: isMobile ? 4 : 6,
      }}
    >
      <Stack gap={2}>
        <BigTitle as="h1" variant="dAppHeadline1">
          <span id="welcome">{t('home.welcome')}</span>
          <span id="the-badge">{t('home.title')}</span>
        </BigTitle>
        <Typography color={colors.pink} component="h2" textAlign="center" variant="dAppTitle2">
          {t('home.subtitle')}
        </Typography>
      </Stack>

      {/* Certification process */}
      <Stack gap={2} position="relative">
        <ProcessIllustration />
        <ProcessTutorial
          href={`${DOCS_URL}/thebadge-documentation/protocol-mechanics/how-it-works`}
          sx={{
            cursor: 'pointer',
          }}
          target={'_blank'}
        >
          {t('home.certificationProcess.title')}
          <Typography color={colors.green} ml={1}>
            {' > '}
          </Typography>
        </ProcessTutorial>
      </Stack>
    </BoxBorderGradient>
  )
}
