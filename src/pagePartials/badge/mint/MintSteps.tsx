import { useRef } from 'react'
import * as React from 'react'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import domtoimage from 'dom-to-image'
import { useTranslation } from 'next-export-i18n'
import { BadgePreviewV2 } from 'thebadge-ui-library'
import { AnyZodObject, z } from 'zod'

import { DataGrid } from '@/src/components/form/customForms/type'
import { FormWithSteps } from '@/src/components/form/formWithSteps/FormWithSteps'
import { AgreementSchema } from '@/src/components/form/helpers/customSchemas'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import enrichTextWithValues from '@/src/utils/enrichTextWithValues'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

// eslint-disable-next-line @typescript-eslint/ban-types
type MintStepsProps<SchemaType extends z.ZodEffects<any, any, any> | AnyZodObject = any> = {
  onSubmit: (data: z.TypeOf<SchemaType>) => void
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
}: MintStepsProps) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const badgePreviewRef = useRef<HTMLDivElement>()

  const badgeLogoUri = badgeMetadata.metadata.logoURI
  const badgeLogoData = useS3Metadata<{ s3Url: string }>(badgeLogoUri as unknown as string)
  const badgeLogoUrl = badgeLogoData.data?.s3Url

  const handleOnSubmit = (data: z.infer<typeof evidenceSchema>) => {
    onSubmit(data)
  }

  const convertPreviewToImage = async () => {
    if (!badgePreviewRef.current) return
    let previewImageDataUrl
    try {
      previewImageDataUrl = await domtoimage.toPng(badgePreviewRef.current, {
        cacheBust: true,
      })
      console.log(previewImageDataUrl)
    } catch (e) {
      console.log(e)
      return
    }
    const link = document.createElement('a')
    link.download = 'my-badge-preview.jpeg'
    link.href = previewImageDataUrl
    link.click()
  }

  function handleFormPreview(data: z.infer<typeof evidenceSchema>) {
    if (!address) {
      throw Error('Please connect your wallet')
    }
    const enrichTextValues = {
      '{address}': address,
    }

    return (
      <Stack alignItems={'center'} gap={2} margin={1}>
        <Typography>This is how you Badge is going to look like</Typography>
        <Box ref={badgePreviewRef}>
          <BadgePreviewV2
            animationEffects={['wobble', 'grow', 'glare']}
            animationOnHover
            badgeBackgroundUrl="https://images.unsplash.com/photo-1512998844734-cd2cca565822?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTIyfHxhYnN0cmFjdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            badgeUrl="https://www.thebadge.xyz"
            category="Badge for Testing"
            description={enrichTextWithValues(badgeMetadata.description, enrichTextValues)}
            imageUrl={badgeLogoUrl}
            size="medium"
            textContrast="light-withTextBackground"
            title={badgeMetadata.name}
          />
        </Box>
        <Stack>
          <Typography>Mint cost: {costs.mintCost}.</Typography>
          <Box alignItems={'center'} display="flex">
            Deposit for Kleros: {costs.klerosCost}.
            <Tooltip title={'This will be returned if the evidence is valid'}>
              <InfoOutlinedIcon />
            </Tooltip>
          </Box>
          <Typography>Total (Native token) need: {costs.totalMintCost}.</Typography>
        </Stack>
        <Button onClick={convertPreviewToImage}>Convert Preview to Image</Button>
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
      onSubmit={handleOnSubmit}
      stepNames={steps}
      stepSchemas={[MintSchemaStep1, evidenceSchema]}
    />
  )
}
