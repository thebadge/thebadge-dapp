import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import MarkdownTypography from '@/src/components/common/MarkdownTypography'
import { HintContainer } from '@/src/components/form/formWithSteps/StepHeaderSubtitle'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useIsBadgeModelOwner } from '@/src/hooks/subgraph/useIsBadgeOwner'
import useTBStore from '@/src/hooks/theBadge/useTBStore'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useS3Metadata, { DEFAULT_FALLBACK_CONTENT_METADATA } from '@/src/hooks/useS3Metadata'
import useTransaction from '@/src/hooks/useTransaction'
import BadgeIdDisplay from '@/src/pagePartials/badge/explorer/addons/BadgeIdDisplay'
import CreatorInfoSmallPreview from '@/src/pagePartials/badge/explorer/addons/CreatorInfoSmallPreview'
import { useWeb3Connection } from '@/src/providers/web3/web3ConnectionProvider'
import { generateMintUrl, generateModelExplorerUrl } from '@/src/utils/navigation/generateUrl'
import { BadgeModelMetadata } from '@/types/badges/BadgeMetadata'
import { BadgeModel } from '@/types/generated/subgraph'
import { TheBadgeModels__factory } from '@/types/generated/typechain'

export default function ThirdPartyBadgeModelInfoPreview({
  badgeModel,
}: {
  badgeModel: BadgeModel
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const { address } = useWeb3Connection()
  const theBadgeStore = useTBStore()
  const { sendTx } = useTransaction()

  const isBadgeModelOwner = useIsBadgeModelOwner(badgeModel.id, address)
  const theBadgeModels = useContractInstance(TheBadgeModels__factory, 'TheBadgeModels')

  const [disabledButtons, setDisabledButtons] = useState(false)
  const [disableMint, setDisabledMint] = useState(false)

  const resBadgeModelMetadata = useS3Metadata<{ content: BadgeModelMetadata }>(
    badgeModel.uri || '',
    {
      content: DEFAULT_FALLBACK_CONTENT_METADATA,
    },
  )
  const badgeMetadata = resBadgeModelMetadata.data?.content

  useEffect(() => {
    if (badgeModel.paused) {
      setDisabledMint(true)
    }
  }, [badgeModel.paused, setDisabledMint])

  const renderManagementOptions = () => {
    if (!isBadgeModelOwner) {
      return null
    }
    const onPauseBadgeModel = async (pause: boolean) => {
      try {
        const currentBadgeModel = await theBadgeStore.getBadgeModel(badgeModel.id)
        const transaction = await sendTx(async () => {
          setDisabledButtons(true)
          setDisabledMint(true)
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
        setDisabledMint(false)
      }
    }

    return (
      <Stack gap={2}>
        <Divider color={colors.white} />
        <Box display="flex" flex="1" justifyContent="space-evenly" mt={2}>
          {badgeModel.paused ? (
            <Stack gap={3} mt={6}>
              <HintContainer>
                <TipsAndUpdatesOutlinedIcon color="info" />
                <MarkdownTypography variant="caption">
                  {t('explorer.preview.badge.unArchiveTooltip')}
                </MarkdownTypography>
              </HintContainer>

              <ButtonV2
                backgroundColor={colors.darkGreen}
                disabled={disabledButtons}
                onClick={() => onPauseBadgeModel(false)}
                sx={{ textTransform: 'uppercase' }}
                variant="contained"
              >
                {t('explorer.preview.badge.unpause')}
              </ButtonV2>
            </Stack>
          ) : (
            <Stack gap={3} mt={6}>
              <HintContainer>
                <WarningAmberOutlinedIcon color="warning" />
                <MarkdownTypography variant="caption">
                  {t('explorer.preview.badge.archiveTooltip')}
                </MarkdownTypography>
              </HintContainer>
              <ButtonV2
                backgroundColor={colors.redError}
                disabled={disabledButtons}
                onClick={() => onPauseBadgeModel(true)}
                sx={{ textTransform: 'uppercase', margin: 'auto' }}
                variant="contained"
              >
                {t('explorer.preview.badge.pause')}
              </ButtonV2>
            </Stack>
          )}
        </Box>
      </Stack>
    )
  }

  return (
    <Stack gap={4} mt={4}>
      {/* Badge Model info */}
      <BadgeIdDisplay
        id={badgeModel.id}
        isBadgeModel={true}
        mintTxHash={badgeModel.createdTxHash}
      />
      <Stack gap={2}>
        <Typography variant="titleLarge">{badgeMetadata?.name}</Typography>

        <Typography variant="bodyMedium">{badgeMetadata?.description}</Typography>
      </Stack>

      <Divider color={colors.white} />

      {/* Mint info */}
      <Stack gap={1}>
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
          onClick={() =>
            router.push(generateModelExplorerUrl(badgeModel.id, badgeModel.controllerType))
          }
          sx={{
            textTransform: 'uppercase',
          }}
          variant="outlined"
        >
          {t('explorer.preview.badge.thirdParty.showOthers')}
        </ButtonV2>

        <Tooltip arrow title={disableMint ? t('explorer.preview.badge.mintPausedTooltip') : ''}>
          <Box>
            <ButtonV2
              backgroundColor={colors.blue}
              disabled={disableMint}
              onClick={() => router.push(generateMintUrl(badgeModel.controllerType, badgeModel.id))}
              sx={{ ml: 'auto', textTransform: 'uppercase' }}
              variant="contained"
            >
              {t('explorer.preview.badge.mint')}
            </ButtonV2>
          </Box>
        </Tooltip>
      </Box>

      {renderManagementOptions()}

      {/* Creator info */}
      {!isBadgeModelOwner && (
        <SafeSuspense>
          <CreatorInfoSmallPreview creator={badgeModel.creator} />
        </SafeSuspense>
      )}
    </Stack>
  )
}
