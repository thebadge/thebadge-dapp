import * as React from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Stepper from '@mui/material/Stepper'
import { OverridableStringUnion } from '@mui/types'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { DOCS_URL } from '@/src/constants/common'
import { useSizeSM } from '@/src/hooks/useSize'

const steps = [
  'Help',
  'Badge model basics',
  'Badge model strategy',
  'Evidence form',
  'Badge model preview',
]

export default function StepHeader({
  color,
  completedSteps,
  currentStep,
  onStepNavigation,
}: {
  currentStep: number
  onStepNavigation: (n: number) => void
  completedSteps: Record<string, boolean>
  color?: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
}) {
  const { t } = useTranslation()
  const isMobile = useSizeSM()

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', mb: 6, gap: 4, alignItems: 'center' }}>
      <Typography color={colors.purple} textAlign="center" variant="title2">
        {t('badge.model.create.title')}
      </Typography>

      <MarkdownTypography textAlign="justify" variant="body3" width="85%">
        {t(`badge.model.create.steps.${currentStep}.subTitle`, {
          docsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
          criteriaDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
          createBadgeTypeDocs: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
        })}
      </MarkdownTypography>

      <Box display="flex" flex="1" width="100%">
        <Stepper
          activeStep={currentStep}
          alternativeLabel
          nonLinear
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            width: '100%',
          }}
        >
          {steps.map((label, index) => (
            <Step completed={completedSteps[index]} key={label}>
              <StepButton
                onClick={() => onStepNavigation(index)}
                sx={{
                  '.MuiStepLabel-iconContainer': {
                    '.Mui-active, .Mui-completed': {
                      color: `${colors.purple} !important`,
                    },
                  },
                  '& .MuiStepIcon-text': {
                    fontSize: '1rem',
                  },
                }}
              >
                <Typography variant="subtitle2">{label}</Typography>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Stack>
  )
}
