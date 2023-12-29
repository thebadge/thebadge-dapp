import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { Box, Divider, Skeleton, Stack, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useIsBadgeModelOwner } from '@/src/hooks/subgraph/useIsBadgeOwner'
import useTBStore from '@/src/hooks/theBadge/useTBStore'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useSizeSM } from '@/src/hooks/useSize'
import useTransaction from '@/src/hooks/useTransaction'
import BadgeMintCost from '@/src/pagePartials/badge/explorer/addons/BadgeMintCost'
import CreatorInfoSmallPreview from '@/src/pagePartials/badge/explorer/addons/CreatorInfoSmallPreview'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateMintUrl, generateModelExplorerUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeModel } from '@/types/generated/subgraph'
import { TheBadgeModels__factory } from '@/types/generated/typechain'

export default function BadgeModelInfoPreview({ badgeModel }: { badgeModel: BadgeModel }) {
  const { t } = useTranslation()
  const router = useRouter()
  const isMobile = useSizeSM()
  const { address } = useWeb3Connection()
  const resBadgeModelMetadata = useS3Metadata<{ content: BadgeModelMetadata }>(badgeModel.uri || '')
  const badgeMetadata = resBadgeModelMetadata.data?.content
  const isBadgeOwner = useIsBadgeModelOwner(badgeModel.id, address)
  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')
  const theBadgeStore = useTBStore()
  const { sendTx } = useTransaction()
  const [disabledButtons, setDisabledButtons] = useState(false)

  const renderManagementOptions = () => {
    if (!isBadgeOwner) {
      return null
    }
    const onPauseBadgeModel = async (pause: boolean) => {
      try {
        const currentBadgeModel = await theBadgeStore.getBadgeModel(badgeModel.id)
        const transaction = await sendTx(async () => {
          setDisabledButtons(true)
          return theBadgeModels.updateBadgeModel(
            badgeModel.id,
            currentBadgeModel.mintCreatorFee,
            pause,
          )
        })

        if (transaction) {
          await transaction.wait()
          router.refresh()
        }
      } catch (error) {
        console.warn('Error pausing badge model...', error)
        setDisabledButtons(false)
      }
    }

    const onEditBadgeModel = async () => {
      console.log('Edit badge model')
    }

    return (
      <Stack gap={2}>
        <Divider color={colors.white} />
        <Box display="flex" flex="1" justifyContent="space-evenly" mt={2}>
          {badgeModel.paused ? (
            <ButtonV2
              backgroundColor={colors.darkGreen}
              disabled={disabledButtons}
              onClick={() => onPauseBadgeModel(false)}
              sx={{ textTransform: 'uppercase' }}
              variant="contained"
            >
              {t('explorer.preview.badge.unpause')}
            </ButtonV2>
          ) : (
            <ButtonV2
              backgroundColor={colors.redError}
              disabled={disabledButtons}
              onClick={() => onPauseBadgeModel(true)}
              sx={{ textTransform: 'uppercase' }}
              variant="contained"
            >
              {t('explorer.preview.badge.pause')}
            </ButtonV2>
          )}
          <ButtonV2
            backgroundColor={colors.blue}
            disabled={disabledButtons}
            onClick={() => onEditBadgeModel()}
            sx={{ textTransform: 'uppercase' }}
            variant="contained"
          >
            {t('explorer.preview.badge.edit')}
          </ButtonV2>
        </Box>
      </Stack>
    )
  }

  return (
    <Stack gap={4} mt={4}>
      {/* Badge Model info */}
      <Stack gap={2}>
        <Typography variant="titleLarge">{badgeMetadata?.name}</Typography>

        <Typography variant="bodyMedium">{badgeMetadata?.description}</Typography>
      </Stack>

      <Divider color={colors.white} />

      {/* Mint info */}
      <Stack gap={1}>
        <SafeSuspense fallback={<Skeleton variant="text" width={100} />}>
          <BadgeMintCost modelId={badgeModel.id} />
        </SafeSuspense>

        {isMobile && <Divider color={colors.white} sx={{ my: 2 }} />}

        <Typography fontWeight="bold" variant="titleMedium">
          {t('explorer.preview.badge.totalMinted')}
          <Typography component="span" sx={{ ml: 1 }} variant="dAppTitle2">
            {badgeModel.badgesMintedAmount}
          </Typography>
        </Typography>
      </Stack>

      <Box display="flex" flex="1" justifyContent="space-between">
        <ButtonV2
          backgroundColor={colors.transparent}
          disabled={disabledButtons}
          onClick={() =>
            router.push(generateModelExplorerUrl(badgeModel.id, badgeModel.controllerType))
          }
          sx={{ textTransform: 'uppercase' }}
          variant="outlined"
        >
          {t('explorer.preview.badge.showOthers')}
        </ButtonV2>

        <ButtonV2
          backgroundColor={colors.blue}
          disabled={disabledButtons}
          onClick={() => router.push(generateMintUrl(badgeModel.controllerType, badgeModel.id))}
          sx={{ ml: 'auto', textTransform: 'uppercase' }}
          variant="contained"
        >
          {t('explorer.preview.badge.mint')}
        </ButtonV2>
      </Box>

      {renderManagementOptions()}

      {/* Creator info */}
      <SafeSuspense>
        <CreatorInfoSmallPreview creator={badgeModel.creator} />
      </SafeSuspense>
    </Stack>
  )
}
