import { Box, Typography } from '@mui/material'
import { ButtonV2, colors } from 'thebadge-ui-library'

export default function ThirdParty() {
  return (
    <Box
      alignItems={'center'}
      display={'flex'}
      flex={1}
      flexDirection={'column'}
      justifyContent={'space-between'}
      paddingX={10}
      paddingY={5}
    >
      <Typography color={'#22dbbd'} component={'span'} variant="h5">
        Are you willing to emit on-chan certificates as a <b>third-party entity?</b>
      </Typography>
      <Typography
        component={'div'}
        fontSize={'12px !important'}
        fontWeight={600}
        lineHeight={'16px'}
        mt={2}
      >
        Also known as "Blockchain certifications as a service". These are badges generated and
        backed by a public or private entity. Entities that are willing to generate these badges
        have to be registered on the platform before they can start emitting them.
      </Typography>
      <Typography
        component={'span'}
        fontSize={'12px !important'}
        fontWeight={700}
        lineHeight={'14px'}
        mt={2}
      >
        Learn more
      </Typography>
      <ButtonV2
        backgroundColor={'#22dbbd'}
        fontColor={colors.black}
        sx={{
          mt: 4,
          borderRadius: '10px',
          fontSize: '12px !important',
          padding: '0.5rem 1rem !important',
          height: 'fit-content !important',
          lineHeight: '14px',
          fontWeight: 700,
          boxShadow: 'none',
        }}
      >
        BECOME A THIRD PARTY
      </ButtonV2>
    </Box>
  )
}
