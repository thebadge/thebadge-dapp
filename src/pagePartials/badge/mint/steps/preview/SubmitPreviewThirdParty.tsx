import * as React from 'react'

import { Box, Stack } from '@mui/material'
import { formatUnits } from 'ethers/lib/utils'
import { useTranslation } from 'next-export-i18n'
import { useFormContext } from 'react-hook-form'

import { APP_URL } from '@/src/constants/common'
import useModelIdParam from '@/src/hooks/nextjs/useModelIdParam'
import useMintValue from '@/src/hooks/theBadge/useMintValue'
import { MintBadgeSchemaType } from '@/src/pagePartials/badge/mint/schema/MintBadgeSchema'
import MintCostThirdParty from '@/src/pagePartials/badge/mint/steps/preview/MintCostThirdParty'
import { BadgePreviewGenerator } from '@/src/pagePartials/badge/preview/BadgePreviewGenerator'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export default function SubmitPreviewThirdParty({
  badgePreviewRef,
}: {
  badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>
}) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { setValue } = useFormContext<MintBadgeSchemaType>() // retrieve all hook methods
  const modelId = useModelIdParam()

  // Get kleros deposit value for the badge model
  const { data: mintValue } = useMintValue(modelId)
  if (!mintValue) {
    throw `There was not possible to get the value to mint a badge for the badge model: ${modelId}`
  }

  return (
    <Stack alignItems={'center'} gap={3} margin={1}>
      <Box ref={badgePreviewRef}>
        <BadgePreviewGenerator
          badgePreviewRef={badgePreviewRef}
          badgeUrl={`${APP_URL}/${modelId}/${address}`}
          modelId={modelId}
          setValue={setValue}
          title={t('badge.model.mint.previewTitle')}
        />
      </Box>
      <MintCostThirdParty
        costs={{
          totalMintCost: formatUnits(mintValue, 18),
        }}
      />
    </Stack>
  )
}
