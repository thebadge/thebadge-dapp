import { ReactNode } from 'react'

import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'

import { Choose } from './svg/choose'
import { Complete } from './svg/complete'
import { Evidence } from './svg/evidence'
import { DOCS_URL } from '@/src/constants/common'

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
      <Box display={'flex'} flexDirection={'row'} gap={8} justifyContent={'center'} mb={4}>
        {processStep(<Choose />, t('home.certificationProcess.step1'))}
        {processStep(<Evidence />, t('home.certificationProcess.step2'))}
        {processStep(<Complete />, t('home.certificationProcess.step3'))}
      </Box>

      <Typography
        alignItems={'center'}
        component={'a'}
        display={'flex'}
        fontSize={'14px !important'}
        fontWeight={900}
        href={`${DOCS_URL}/thebadge-documentation/protocol-mechanics/how-it-works`}
        justifyContent={'center'}
        lineHeight={'15px'}
        mb={8}
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
