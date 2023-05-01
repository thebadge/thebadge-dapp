import { ReactNode } from 'react'

import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { DOCS_URL } from '@/src/constants/common'
import BadgeRender from '@/src/pagePartials/home/BadgeRender'

export default function CertificationProcess() {
  const { t } = useTranslation()
  const processStep = (icon: ReactNode, text: string) => {
    return (
      <Box display={'flex'} flexDirection={'column'}>
        {icon}
        <Typography
          display={'flex'}
          fontSize={'14px !important'}
          fontWeight={500}
          justifyContent={'center'}
          variant="body4"
        >
          {text}
        </Typography>
      </Box>
    )
  }
  return (
    <div>
      <Box display="flex" flex="1">
        <Box display={'flex'} flexDirection={'row'} gap={8} justifyContent={'center'} mb={4}></Box>
        <BadgeRender />
      </Box>

      <Typography
        alignItems={'center'}
        component={'a'}
        display={'flex'}
        fontSize={'14px !important'}
        fontWeight={900}
        href={`${DOCS_URL}/thebadge-documentation/overview/how-it-works`}
        justifyContent={'center'}
        lineHeight={'15px'}
        mb={10}
        sx={{
          cursor: 'pointer',
        }}
        target={'_blank'}
      >
        {t('home.certificationProcess.title')}{' '}
        <Typography color={'#22DBBD'} ml={1}>
          {' > '}
        </Typography>
      </Typography>
    </div>
  )
}
