import Image from 'next/image'

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, Typography } from '@mui/material'

export default function CertificationProcess() {
  return (
    <div>
      <Box display={'flex'} flexDirection={'row'} gap={8} justifyContent={'center'} mb={4}>
        <Image alt="Choose your certification" height="73" src="shareable/choose.svg" width="116" />
        <Image alt="Upload the evidence" height="73" src="shareable/evidence.svg" width="116" />
        <Image alt="Receive your Badge" height="73" src="shareable/complete.svg" width="116" />
      </Box>
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
