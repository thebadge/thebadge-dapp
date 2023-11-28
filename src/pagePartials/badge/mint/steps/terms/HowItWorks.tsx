import React from 'react'

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Box, Link, Stack, styled } from '@mui/material'
import { colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { Controller, useFormContext } from 'react-hook-form'

import HowItWorksStep from '@/src/components/common/HowItWorksStep'
import { AgreementCheckbox } from '@/src/components/form/formFields/AgreementCheckbox'
import { DOCUMENTATION_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import { secondsToDays, secondsToMinutes } from '@/src/utils/dateUtils'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { isTestnet } from '@/src/utils/network'
import { Creator } from '@/types/badges/Creator'

const CriteriaLink = styled(Link)(() => ({
  color: colors.green,
  fontWeight: 700,
  '&:hover': {
    color: colors.green,
  },
  '&:visited': {
    color: colors.green,
  },
  '&:active': {
    color: colors.green,
  },
}))

export default function HowItWorks() {
  const { t } = useTranslation()
  const { control } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods

  const { badgeModelId } = useModelIdParam()
  const badgeModelData = useBadgeModel(badgeModelId)
  const klerosBadgeModel = useRegistrationBadgeModelKlerosMetadata(badgeModelId)

  const badgeModelKlerosMetadata = klerosBadgeModel.data?.badgeModelKlerosRegistrationMetadata
  const badgeCriteria = klerosBadgeModel.data?.badgeRegistrationCriteria
  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.metadataUri || '',
  )

  if (!badgeCreatorMetadata || !badgeModelKlerosMetadata) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const challengePeriodDuration = isTestnet
    ? secondsToMinutes(klerosBadgeModel.data?.challengePeriodDuration)
    : secondsToDays(klerosBadgeModel.data?.challengePeriodDuration)

  return (
    <Stack gap={8} mt={4}>
      <Stack gap={6}>
        <Box display="flex" gap={1}>
          <WarningAmberOutlinedIcon color="green" />
          <CriteriaLink href={badgeCriteria} target="_blank" underline="hover">
            Please, view badge application requirements PDF here
          </CriteriaLink>
        </Box>

        <HowItWorksStep
          index={1}
          text={t(`badge.model.mint.helpSteps.${0}`, {
            badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
            badgeCreatorProfileLink: generateProfileUrl({
              address: badgeModelData.data?.badgeModel?.creator.id,
            }),
          })}
        />
        <HowItWorksStep
          index={2}
          text={t(`badge.model.mint.helpSteps.${1}`, {
            curationDocsUrl: DOCUMENTATION_URL + '/protocol-mechanics/challenge',
          })}
        />
        <HowItWorksStep
          index={3}
          text={t(`badge.model.mint.helpSteps.${2}`, {
            curationCriteriaUrl: badgeCriteria,
          })}
        />
        <HowItWorksStep
          index={4}
          text={t(`badge.model.mint.helpSteps.${3}`, {
            challengePeriodDuration,
            timeUnit: isTestnet ? 'minutes' : 'days',
          })}
        />
      </Stack>
      <Controller
        control={control}
        name={'howItWorks'}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <AgreementCheckbox color="blue" error={error} onChange={onChange} value={value} />
        )}
      />
    </Stack>
  )
}
