import { useRouter } from 'next/navigation'
import React from 'react'

import { Box, Divider, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import BadgeRequesterPreview from '@/src/pagePartials/badge/explorer/addons/BadgeRequesterPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateBadgePreviewUrl, generateMintUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeModelControllerType } from '@/types/badges/BadgeModel'
import { Badge } from '@/types/generated/subgraph'
import { WCAddress } from '@/types/utils'

export default function BadgeInfoPreview({ badge }: { badge: Badge }) {
  const { t } = useTranslation()
  const router = useRouter()

  const { readOnlyChainId } = useWeb3Connection()
  const resBadgeModelMetadata = useS3Metadata<{ content: BadgeModelMetadata }>(
    badge.badgeModel.uri || '',
  )
  const badgeMetadata = resBadgeModelMetadata.data?.content

  return (
    <Stack gap={4} mt={4}>
      {/* Badge Model info */}
      <Stack gap={2}>
        <Typography variant="titleLarge">{badgeMetadata?.name}</Typography>

        <Typography variant="bodyMedium">{badgeMetadata?.description}</Typography>
      </Stack>

      <Divider color={colors.white} />

      <Box display="flex" flex="1" justifyContent="space-between">
        {badge.badgeModel.controllerType === BadgeModelControllerType.Community ? (
          <ButtonV2
            backgroundColor={colors.transparent}
            onClick={() =>
              router.push(generateMintUrl(badge.badgeModel.controllerType, badge.badgeModel.id))
            }
            variant="outlined"
          >
            {t('explorer.badges.preview.badge.applyForIt')}
          </ButtonV2>
        ) : null}
        <ButtonV2
          backgroundColor={colors.green}
          onClick={() =>
            router.push(
              generateBadgePreviewUrl(badge.id, {
                theBadgeContractAddress: badge.contractAddress,
                connectedChainId: readOnlyChainId,
              }),
            )
          }
          sx={{ ml: 'auto' }}
          variant="contained"
        >
          {t('explorer.badges.preview.badge.view')}
        </ButtonV2>
      </Box>

      {/* Minter info */}
      <SafeSuspense>
        <BadgeRequesterPreview ownerAddress={badge.account.id as WCAddress} />
      </SafeSuspense>
    </Stack>
  )
}
