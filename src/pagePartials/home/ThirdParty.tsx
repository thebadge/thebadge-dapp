import React from 'react'

import { Box, Tooltip, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import { DISCORD_URL, DOCS_URL } from '@/src/constants/common'
import { useSectionReferences } from '@/src/providers/referencesProvider'

export default function ThirdParty() {
  const { becomeAThirdPartySection } = useSectionReferences()
  const { t } = useTranslation()
  return (
    <Box
      alignItems={'center'}
      display={'flex'}
      flex={1}
      flexDirection={'column'}
      justifyContent={'space-between'}
      paddingX={10}
      paddingY={5}
      ref={becomeAThirdPartySection}
    >
      <Typography color={'#22dbbd'} component={'span'} variant="h5">
        {t('home.thirdParty.title1')}
        <b>{t('home.thirdParty.title2')}</b>
      </Typography>
      <Typography
        component={'div'}
        fontSize={'14px !important'}
        fontWeight={600}
        lineHeight={'16px'}
        mt={2}
      >
        {t('home.thirdParty.step1')}
      </Typography>

      <Typography
        component={'a'}
        fontSize={'14px !important'}
        fontWeight={700}
        href={`${DOCS_URL}/thebadge-documentation/overview/categories/third-party-badges`}
        lineHeight={'14px'}
        mt={2}
        target={'_blank'}
      >
        {t('home.thirdParty.learnMore')}
      </Typography>

      <Tooltip
        arrow
        title={
          <span>
            {t('home.thirdParty.tooltip.prefixText')}
            <a href={DISCORD_URL} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {t('home.thirdParty.tooltip.link')}
            </a>
            {t('home.thirdParty.tooltip.suffixText')}
          </span>
        }
      >
        <Box>
          <ButtonV2
            backgroundColor={'#22dbbd'}
            disabled={true}
            fontColor={colors.black}
            sx={{
              mt: 4,
              borderRadius: '10px',
              fontSize: '14px !important',
              padding: '0.5rem 1rem !important',
              height: 'fit-content !important',
              lineHeight: '14px',
              fontWeight: 700,
              boxShadow: 'none',
            }}
          >
            {t('home.thirdParty.button')}
          </ButtonV2>
        </Box>
      </Tooltip>
    </Box>
  )
}
