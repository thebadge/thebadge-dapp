import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import StepHeaderStepper from '@/src/components/form/formWithSteps/StepHeaderStepper'
import StepHeaderSubtitle from '@/src/components/form/formWithSteps/StepHeaderSubtitle'
import { DOCS_URL, EMAIL_URL } from '@/src/constants/common'
import { useSizeSM } from '@/src/hooks/useSize'

const steps = ['Badge model basics', 'Badge model details', 'Badge model preview']

export default function StepHeaderThirdParty({
  completedSteps,
  currentStep,
  onStepNavigation,
}: {
  currentStep: number
  onStepNavigation: (n: number) => void
  completedSteps: Record<string, boolean>
}) {
  const { t } = useTranslation()
  const isMobile = useSizeSM()

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mb: isMobile ? 12 : 6,
        gap: 4,
        alignItems: 'center',
      }}
    >
      <Typography color={colors.purple} textAlign="center" variant="title2">
        {t('badge.model.create.title')}
      </Typography>

      <StepHeaderStepper
        color={colors.purple}
        completedSteps={completedSteps}
        currentStep={currentStep}
        onStepNavigation={onStepNavigation}
        steps={steps}
      />

      <StepHeaderSubtitle
        hint={t(`badge.model.create.steps.${currentStep}.hint`, {
          docsUrl: DOCS_URL,
          createBadgeModelDocs:
            DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
          supportContact: EMAIL_URL,
        })}
        showHint={currentStep !== 5}
        stepNumber={currentStep + 1}
        subTitle={t(`badge.model.create.steps.${currentStep}.subTitle`, {
          docsUrl: DOCS_URL,
          criteriaDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
          supportContact: EMAIL_URL,
        })}
      />
    </Stack>
  )
}
