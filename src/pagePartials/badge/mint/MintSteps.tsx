import { useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useRef } from 'react'

import { Box, Stack, Typography } from '@mui/material'
import domtoimage from 'dom-to-image'
import { useTranslation } from 'next-export-i18n'
import { BadgePreviewV2 } from 'thebadge-ui-library'
import { AnyZodObject, z } from 'zod'

import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import { AgreementSchema } from '@/src/components/form/helpers/customSchemas'
import { TransactionLoading } from '@/src/components/loading/TransactionLoading'
import { APP_URL } from '@/src/constants/common'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { TransactionStates } from '@/src/hooks/useTransaction'
import MintCost from '@/src/pagePartials/badge/mint/MintCost'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import enrichTextWithValues, { EnrichTextValues } from '@/src/utils/enrichTextWithValues'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

// eslint-disable-next-line @typescript-eslint/ban-types
type MintStepsProps<SchemaType extends z.ZodEffects<any, any, any> | AnyZodObject = any> = {
  txState: TransactionStates
  onSubmit: (data: z.TypeOf<SchemaType>, imageDataUrl: string) => void
  evidenceSchema: SchemaType
  badgeMetadata: KlerosListStructure
  costs: {
    mintCost: string
    klerosCost: string
    totalMintCost: string
  }
}

const steps = ['Help', 'Evidence form', 'Badge Preview']

const formGridLayout: DataGrid[][] = [
  [{ i: 'AgreementSchema', x: 0, y: 0, w: 12, h: 6, static: true }],
  [],
]

export const MintSchemaStep1 = z.object({
  help: AgreementSchema.describe(`How it works // ??`),
})

export default function MintSteps({
  badgeMetadata,
  costs,
  evidenceSchema,
  onSubmit,
  txState,
}: MintStepsProps) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const searchParams = useSearchParams()
  const typeId = searchParams.get('typeId')

  if (!typeId) {
    throw `No typeId provided as URL query param`
  }

  const badgePreviewRef = useRef<HTMLDivElement>()

  const badgeLogoUri = badgeMetadata.metadata.logoURI
  const badgeLogoData = useS3Metadata<{ s3Url: string }>(badgeLogoUri as unknown as string)
  const badgeLogoUrl = badgeLogoData.data?.s3Url

  const convertPreviewToImage = async (): Promise<string> => {
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
  }

  const handleOnSubmit = async (data: z.infer<typeof evidenceSchema>) => {
    const imageDataUrl = await convertPreviewToImage()
    onSubmit(data, imageDataUrl)
  }

  function handleFormPreview(data: z.infer<typeof evidenceSchema>) {
    if (!address) {
      throw Error('Please connect your wallet')
    }
    if (txState !== TransactionStates.none) {
      return <TransactionLoading state={txState} />
    }

    const enrichTextValues: EnrichTextValues = {
      '{displayName}': '',
      '{expirationTime}': '',
      '{address}': address,
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
            imageUrl={badgeLogoUrl}
            size="medium"
            textContrast="light-withTextBackground"
            title={badgeMetadata.name}
          />
        </Box>
        <MintCost costs={costs} />
      </Stack>
    )
  }

  return (
    <FormWithSteps
      formFieldProps={[
        {
          help: {
            agreementText: t('badge.type.mint.help-steps'),
          },
        },
      ]}
      formGridLayout={formGridLayout}
      formLayout={'gridResponsive'}
      formSubmitReview={handleFormPreview}
      hideSubmit={txState !== TransactionStates.none}
      onSubmit={handleOnSubmit}
      stepNames={steps}
      stepSchemas={[MintSchemaStep1, evidenceSchema]}
    />
  )
}
