import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import useTranslation from 'next-translate/useTranslation'

import StepHeaderStepper from '@/src/components/form/formWithSteps/StepHeaderStepper'
import StepHeaderSubtitle from '@/src/components/form/formWithSteps/StepHeaderSubtitle'
import { DOCS_URL, EMAIL_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { Creator } from '@/types/badges/Creator'

const steps = ['Help', 'Evidence', 'Preview']

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
  const { badgeModelId } = useModelIdParam()
  const badgeModelData = useBadgeModel(badgeModelId)
  const template = useBadgeModelTemplate(badgeModelId)

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata || !badgeModelData) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  return (
    <Stack sx={{ display: 'flex', flexDirection: 'column', mb: 6, gap: 4, alignItems: 'center' }}>
      <Typography color={colors.blue} textAlign="center" variant="title2">
        {t('badge.model.mint.title', {
          badgeModelTemplate: template,
        })}
      </Typography>

      <StepHeaderStepper
        color={colors.blue}
        completedSteps={completedSteps}
        currentStep={currentStep}
        onStepNavigation={onStepNavigation}
        steps={steps}
      />

      <StepHeaderSubtitle
        hint={t(`badge.model.mint.thirdParty.steps.${currentStep}.hint`, {
          docsUrl: DOCS_URL,
          badgeModelTemplate: template,
          supportContact: EMAIL_URL,
        })}
        showHint={currentStep !== 5}
        subTitle={t(`badge.model.mint.thirdParty.steps.${currentStep}.subTitle`, {
          badgeName: badgeModelMetadata?.name,
          supportContact: EMAIL_URL,
          badgeModelTemplate: template,
          docsUrl: DOCS_URL,
        })}
      />
    </Stack>
  )
}
