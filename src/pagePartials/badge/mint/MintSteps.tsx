import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useCallback, useRef, useState } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import domtoimage from 'dom-to-image'
import { useTranslation } from 'next-export-i18n'
import { BadgePreviewV2, colors } from 'thebadge-ui-library'
import { AnyZodObject, z } from 'zod'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import { AgreementSchema } from '@/src/components/form/helpers/customSchemas'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { APP_URL, DOCS_URL } from '@/src/constants/common'
import useBadgeType from '@/src/hooks/subgraph/useBadgeType'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { TransactionStates } from '@/src/hooks/useTransaction'
import MintCost from '@/src/pagePartials/badge/mint/MintCost'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
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

const formGridLayout: DataGrid[][] = [
  [{ i: 'AgreementSchema', x: 0, y: 0, w: 12, h: 8, static: true }],
  [],
]

export const MintSchemaStep1 = z.object({
  help: AgreementSchema.describe(`Mint badge quick tutorial.`),
})

export default function MintSteps({ costs, evidenceSchema, onSubmit, txState }: MintStepsProps) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')
  const [currentStep, setCurrentStep] = useState(0)

  if (!typeId) {
    throw `No typeId provided us URL query param`
  }
  const badgePreviewRef = useRef<HTMLDivElement>()

  const badgeTypeData = useBadgeType(typeId)

  if (
    badgeTypeData.error ||
    !badgeTypeData.data?.badgeType ||
    !badgeTypeData.data?.badgeTypeMetadata
  ) {
    throw `There was an error trying to fetch the metadata for the badge type`
  }

  const klerosBadge = badgeTypeData.data?.badgeType.klerosBadge
  const badgeMetadata = badgeTypeData.data?.badgeTypeMetadata

  const badgeLogoData = useS3Metadata<{ s3Url: string }>(
    badgeMetadata.metadata.logoURI as unknown as string,
  )
  const badgeCreatorMetadata = useS3Metadata<{ content: Creator }>(
    badgeTypeData.data?.badgeType?.creator.creatorMetadata || '',
  )

  const badgeCriteria = 's3Url' in badgeMetadata.fileURI ? badgeMetadata.fileURI.s3Url : ''

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

      return (
        <Stack alignItems={'center'} gap={3} margin={1}>
          <Typography>{t('badge.type.mint.previewTitle')}</Typography>
          <Box ref={badgePreviewRef}>
            <BadgePreviewV2
              animationEffects={['wobble', 'grow', 'glare']}
              animationOnHover
              badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              badgeUrl={`${APP_URL}/${typeId}/${address}`}
              category="Badge for Testing"
              description={enrichTextWithValues(badgeMetadata.description, enrichTextValues)}
              imageUrl={badgeLogoData.data?.s3Url}
              size="medium"
              textContrast="light-withTextBackground"
              title={badgeMetadata.name}
            />
          </Box>
          <MintCost costs={costs} />
        </Stack>
      )
    },
    [
      address,
      badgeLogoData.data?.s3Url,
      badgeMetadata.description,
      badgeMetadata.name,
      costs,
      t,
      txState,
      typeId,
    ],
  )

  return (
    <>
      <Stack sx={{ mb: 6, gap: 4, alignItems: 'center' }}>
        <Typography color={colors.blue} textAlign="center" variant="title2">
          {t('badge.type.mint.title')}
        </Typography>

        <MarkdownTypography textAlign="justify" variant="body3" width="85%">
          {t(`badge.type.mint.steps.${currentStep}.sub-title`, {
            badgeName: badgeMetadata.name,
            creatorContact: `mailto:${badgeCreatorMetadata.data?.content?.email}`,
            badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
            curationDocsUrl: DOCS_URL + '/thebadge-documentation/overview/how-it-works/challenge',
            costDocsUrls: DOCS_URL + '/thebadge-documentation/overview/how-it-works/challenge',
          })}
        </MarkdownTypography>
      </Stack>

      <FormWithSteps
        color={'blue'}
        formFieldProps={[
          {
            help: {
              agreementText: t('badge.type.mint.help-steps', {
                badgeCreatorName: badgeCreatorMetadata.data?.content?.name,
                badgeCreatorProfileLink: '/profile/' + badgeTypeData.data?.badgeType?.creator.id,
                curationDocsUrl:
                  DOCS_URL + '/thebadge-documentation/overview/how-it-works/challenge',
                curationCriteriaUrl: badgeCriteria,
                challengePeriodDuration: klerosBadge?.challengePeriodDuration / 60 / 60,
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
