import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import { Box, Typography } from '@mui/material'

import { Choose } from './svg/choose'
import { Complete } from './svg/complete'
import { Evidence } from './svg/evidence'

export default function CertificationProcess() {
  return (
    <div>
      <Box display={'flex'} flexDirection={'row'} gap={8} justifyContent={'center'} mb={4}>
        <Choose />
        <Evidence />
        <Complete />
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
