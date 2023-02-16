import { ReactNode } from 'react'

import { Box, Typography } from '@mui/material'

import { Choose } from './svg/choose'
import { Complete } from './svg/complete'
import { Evidence } from './svg/evidence'

export default function CertificationProcess() {
  const processStep = (icon: ReactNode, text: string) => {
    return (
      <Box display={'flex'} flexDirection={'column'}>
        {icon}
        <Typography
          display={'flex'}
          fontSize={'12px !important'}
          fontWeight={500}
          justifyContent={'center'}
          lineHeight={'16px'}
        >
          {text}
        </Typography>
      </Box>
    )
  }
  return (
    <div>
      <Box display={'flex'} flexDirection={'row'} gap={8} justifyContent={'center'} mb={4}>
        {processStep(<Choose />, 'Choose a certificate')}
        {processStep(<Evidence />, 'Upload the evidence')}
        {processStep(<Complete />, 'Complete!')}
      </Box>

      <Typography
        alignItems={'center'}
        display={'flex'}
        fontSize={'12px !important'}
        fontWeight={900}
        justifyContent={'center'}
        lineHeight={'15px'}
        mb={10}
        sx={{
          cursor: 'pointer',
        }}
      >
        FULL CERTIFICATION PROCESS TUTORIAL{' '}
        <Typography color={'#22DBBD'} ml={1}>
          {' > '}
        </Typography>
      </Typography>
    </div>
  )
}
