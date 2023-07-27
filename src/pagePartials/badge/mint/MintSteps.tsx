import * as React from 'react'
import { useCallback, useRef, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import { BadgePreview, colors } from '@thebadge/ui-library'
import domtoimage from 'dom-to-image'
import { useTranslation } from 'next-export-i18n'
import { AnyZodObject, z } from 'zod'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import { AgreementSchemaBranded } from '@/src/components/form/helpers/customSchemas'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { APP_URL, DOCS_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useBadgeModel from '@/src/hooks/subgraph/useBadgeModel'
import { useRegistrationBadgeModelKlerosMetadata } from '@/src/hooks/subgraph/useBadgeModelKlerosMetadata'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { TransactionStates } from '@/src/hooks/useTransaction'
import MintCost from '@/src/pagePartials/badge/mint/MintCost'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getBackgroundBadgeUrl } from '@/src/utils/badges/getBackgroundBadgeUrl'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import { BadgeNFTAttributesType } from '@/types/badges/BadgeMetadata'
import { Creator } from '@/types/badges/Creator'

// eslint-disable-next-line @typescript-eslint/ban-types
type MintStepsProps<SchemaType extends z.ZodEffects<any, any, any> | AnyZodObject = any> = {
  txState: TransactionStates
  onSubmit: (data: z.TypeOf<SchemaType>, imageDataUrl: string) => void
  evidenceSchema: SchemaType
  costs: {
    mintCost: string
    klerosCost: string
    totalMintCost: string
  }
}

const steps = ['Help', 'Evidence form', 'Badge Preview']

export const MintSchemaStep1 = z.object({
  help: AgreementSchemaBranded.describe(`Mint badge quick tutorial.`),
})

export default function MintSteps({ costs, evidenceSchema, onSubmit, txState }: MintStepsProps) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const modelId = useModelIdParam()

  const [currentStep, setCurrentStep] = useState(0)

  if (!modelId) {
    throw `No modelId provided us URL query param`
  }
  const badgePreviewRef = useRef<HTMLDivElement>()

  const badgeModelData = useBadgeModel(modelId)
  const klerosBadgeModel = useRegistrationBadgeModelKlerosMetadata(modelId)

  const badgeModelKlerosMetadata = klerosBadgeModel.data?.badgeModelKlerosRegistrationMetadata
  const badgeModelMetadata = badgeModelData.data?.badgeModelMetadata

  if (badgeModelData.error || !badgeModelMetadata || !badgeModelKlerosMetadata) {
    throw `There was an error trying to fetch the metadata for the badge model`
  }

  const badgeLogoImage = badgeModelData.data?.badgeModelMetadata?.image

  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeModelData.data?.badgeModel?.creator.creatorUri || '',
  )

  const badgeCriteria =
    's3Url' in badgeModelKlerosMetadata.fileURI ? badgeModelKlerosMetadata.fileURI.s3Url : ''

  const convertPreviewToImage = useCallback(async (): Promise<string> => {
    if (!badgePreviewRef.current) return ''
    let previewImageDataUrl
    try {
      previewImageDataUrl = await domtoimage.toPng(badgePreviewRef.current, {
        cacheBust: true,
      })
      return previewImageDataUrl
    } catch (e) {
      console.warn('convertPreviewToImage', e)
      return ''
    }
  }, [])

  const handleOnSubmit = useCallback(
    async (data: z.infer<typeof evidenceSchema>) => {
      const imageDataUrl = await convertPreviewToImage()
      onSubmit(data, imageDataUrl)
    },
    [convertPreviewToImage, onSubmit],
  )

  const handleFormPreview = useCallback(
    (data: z.infer<typeof evidenceSchema>) => {
      if (txState !== TransactionStates.none) {
        return <TransactionLoading state={txState} />
      }

      const enrichTextValues: EnrichTextValues = {
        '{displayName}': '',
        '{expirationTime}': '',
        '{address}': address as string,
      }

      const backgroundType = badgeModelMetadata?.attributes?.find(
        (at) => at.trait_type === BadgeNFTAttributesType.Background,
      )

      const textContrast = badgeModelMetadata?.attributes?.find(
        (at) => at.trait_type === BadgeNFTAttributesType.TextContrast,
      )

      return (
        <Stack alignItems={'center'} gap={3} margin={1}>
          <Typography>{t('badge.type.mint.previewTitle')}</Typography>
          <Box ref={badgePreviewRef}>
            <BadgePreview
              animationEffects={['wobble', 'grow', 'glare']}
              animationOnHover
              badgeBackgroundUrl={getBackgroundBadgeUrl(backgroundType?.value)}
              badgeUrl={`${APP_URL}/${modelId}/${address}`}
              category={badgeModelMetadata?.name}
              description={enrichTextWithValues(badgeModelMetadata.description, enrichTextValues)}
              imageUrl={badgeLogoImage?.s3Url}
              size="medium"
              textContrast={textContrast?.value || 'light-withTextBackground'}
            />
          </Box>
          <MintCost costs={costs} />
        </Stack>
      )
    },
    [txState, address, badgeModelMetadata, t, modelId, badgeLogoImage?.s3Url, costs],
  )

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.blue} textAlign="center" variant="title2">
          {t('badge.type.mint.title')}
        </Typography>

        <MarkdownTypography textAlign="justify" variant="body3" width="85%">
          {t(`badge.type.mint.steps.${currentStep}.subTitle`, {
            badgeName: badgeModelMetadata.name,
            creatorContact: `mailto:${badgeCreatorMetadata.data?.content?.email}`,
            badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
            curationDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
            costDocsUrls: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
          })}
        </MarkdownTypography>
      </Stack>

      <FormWithSteps
        color={'blue'}
        formFieldProps={[
          {
            help: {
              agreementText: t('badge.type.mint.helpSteps', {
                badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
                badgeCreatorProfileLink: '/profile/' + badgeModelData.data?.badgeModel?.creator.id,
                curationDocsUrl: DOCS_URL + '/thebadge-documentation/protocol-mechanics/challenge',
                curationCriteriaUrl: badgeCriteria,
                challengePeriodDuration: klerosBadgeModel?.data?.challengePeriodDuration / 60 / 60,
                timeUnit: 'days',
              }),
              color: 'blue',
            },
          },
        ]}
        formLayout={'flex'}
        formSubmitReview={handleFormPreview}
        hideSubmit={txState !== TransactionStates.none}
        onStepChanged={(sn) => setCurrentStep(sn)}
        onSubmit={handleOnSubmit}
        stepNames={steps}
        stepSchemas={[MintSchemaStep1, evidenceSchema]}
      />
    </>
  )
}
