import { useRouter } from 'next/router'

import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from 'thebadge-ui-library'

import { DOCS_URL } from '@/src/constants/common'
import { useSectionReferences } from '@/src/providers/referencesProvider'

export default function BadgeCreator() {
  const { becomeACreatorSection } = useSectionReferences()
  const router = useRouter()
  const { t } = useTranslation()

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
        {t('home.badgeCreator.title')}
      </Typography>
      <Box alignItems={'center'} display={'flex'} flexDirection={'row'} justifyContent={'center'}>
        <TaskAltIcon color={'pink'} sx={{ mr: 2 }} />
        <Typography
          component={'div'}
          fontSize={'12px !important'}
          fontWeight={600}
          lineHeight={'16px'}
        >
          {t('home.badgeCreator.step1')}
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
          {t('home.badgeCreator.step2')}
        </Typography>
      </Box>
      <Typography
        component={'a'}
        fontSize={'12px !important'}
        fontWeight={700}
        href={`${DOCS_URL}/thebadge-documentation/overview/how-it-works/creators`}
        lineHeight={'14px'}
        mt={2}
        target={'_blank'}
      >
        {t('home.badgeCreator.learnMore')}
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
        {t('home.badgeCreator.button')}
      </ButtonV2>
    </Box>
  )
}
