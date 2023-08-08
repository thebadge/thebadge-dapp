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
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import { Creator } from '@/types/badges/Creator'

const steps = ['Help', 'Badge Evidence', 'Badge Preview']

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
  const modelId = useModelIdParam()
  const badgeModelData = useBadgeModel(modelId)

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.creatorUri || '',
  )

  if (!badgeCreatorMetadata || !badgeModelData) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', mb: 6, gap: 4, alignItems: 'center' }}>
      <Typography color={colors.blue} textAlign="center" variant="title2">
        {t('badge.model.create.title')}
      </Typography>

      <MarkdownTypography textAlign="justify" variant="body3" width="85%">
        {t(`badge.type.mint.steps.${currentStep}.subTitle`, {
          badgeName: badgeModelMetadata?.name,
          creatorContact: `mailto:${badgeCreatorMetadata.data?.content?.email}`,
          badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
          curationDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
          costDocsUrls: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
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
                      color: `${colors.blue} !important`,
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
