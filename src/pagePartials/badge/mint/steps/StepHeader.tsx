import * as React from 'react'

import { Stack, Typography } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import StepHeaderStepper from '@/src/components/form/formWithSteps/StepHeaderStepper'
import StepHeaderSubtitle from '@/src/components/form/formWithSteps/StepHeaderSubtitle'
import { DOCS_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import useBadgeModelTemplate from '@/src/hooks/theBadge/useBadgeModelTemplate'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { Creator } from '@/types/badges/Creator'

const steps = ['Help', 'Badge Evidence', 'Badge Preview']

export default function StepHeader({
  completedSteps,
  currentStep,
  onStepNavigation,
}: {
  currentStep: number
  onStepNavigation: (n: number) => void
  completedSteps: Record<string, boolean>
}) {
  const { t } = useTranslation()
  const modelId = useModelIdParam()
  const badgeModelData = useBadgeModel(modelId)
  const template = useBadgeModelTemplate(modelId)

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
        hint={t(`badge.model.mint.steps.${currentStep}.hint`, {
          docsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
          createBadgeModelDocs:
            DOCS_URL + '/thebadge-documentation/protocol-mechanics/how-it-works',
        })}
        showHint={currentStep !== 5}
        subTitle={t(`badge.model.mint.steps.${currentStep}.subTitle`, {
          badgeName: badgeModelMetadata?.name,
          creatorContact: `mailto:${badgeCreatorMetadata.data?.content?.email}`,
          badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
          curationDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
          costDocsUrls: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
        })}
      />
    </Stack>
  )
}
