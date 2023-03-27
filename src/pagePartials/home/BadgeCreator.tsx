import { useRouter } from 'next/router'

import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { Box, Typography } from '@mui/material'
import { ButtonV2, colors } from 'thebadge-ui-library'

import { DOCS_URL } from '@/src/constants/common'
import { useSectionReferences } from '@/src/providers/referencesProvider'

export default function BadgeCreator() {
  const { becomeACreatorSection } = useSectionReferences()
  const router = useRouter()

  return (
    <Box
      alignItems={'center'}
      display={'flex'}
      flex={1}
      flexDirection={'column'}
      justifyContent={'space-between'}
      paddingX={5}
      paddingY={5}
      ref={becomeACreatorSection}
    >
      <Typography
        color={colors.pink}
        fontSize={'30px !important'}
        fontWeight={700}
        lineHeight={'30px'}
        mb={4}
      >
        Badge Creator
      </Typography>
      <Box alignItems={'center'} display={'flex'} flexDirection={'row'} justifyContent={'center'}>
        <TaskAltIcon color={'pink'} sx={{ mr: 2 }} />
        <Typography
          component={'div'}
          fontSize={'12px !important'}
          fontWeight={600}
          lineHeight={'16px'}
        >
          You can design and publish custom badges that other users can apply for to verify
          real-world information.
        </Typography>
      </Box>
      <Box
        alignItems={'center'}
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'center'}
        mt={2}
      >
        <TaskAltIcon color={'pink'} sx={{ mr: 2 }} />
        <Typography
          component={'div'}
          fontSize={'12px !important'}
          fontWeight={600}
          lineHeight={'16px'}
        >
          Set the price for the badges you create and receive a share of the fee when users apply
          for and receive them.
        </Typography>
      </Box>
      <Typography
        component={'a'}
        fontSize={'12px !important'}
        fontWeight={700}
        href={`${DOCS_URL}/thebadge-documentation/overview/how-it-works/creators`}
        lineHeight={'14px'}
        mt={2}
      >
        Learn more
      </Typography>
      <ButtonV2
        backgroundColor={colors.pink}
        fontColor={colors.white}
        onClick={() => router.push('/creator/register')}
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
        BECOME A CREATOR
      </ButtonV2>
    </Box>
  )
}
