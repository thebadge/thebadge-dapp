import React from 'react'

import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import TBModal from '@/src/components/common/TBModal'
import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import useIsClaimable from '@/src/hooks/subgraph/useIsClaimable'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getEvidenceValue } from '@/src/utils/kleros/getEvidenceValue'
import { BadgeStatus } from '@/types/generated/subgraph'

type CurateModalProps = {
  open: boolean
  onClose: () => void
  badgeId: string
}
export default function CurateModal({ badgeId, onClose, open }: CurateModalProps) {
  return (
    <TBModal closeButtonAriaLabel="Close curate modal" onClose={onClose} open={open}>
      <CurateModalContent badgeId={badgeId} onClose={onClose} />
    </TBModal>
  )
}

function CurateModalContent({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { addMoreEvidence, challenge } = useCurateProvider()

  const isClaimable = useIsClaimable(badgeId)
  const badgeById = useBadgeById(badgeId)
  const badge = badgeById.data

  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }

  const onButtonClick = () => {
    badge?.status === BadgeStatus.Challenged ? addMoreEvidence(badge.id) : challenge(badge.id)
    onClose()
  }

  const badgeModelId = badge.badgeModel.id
  const ownerAddress = badge.account.id

  const badgeKlerosMetadata = useEvidenceBadgeKlerosMetadata(badgeId)
  const badgeEvidence = badgeKlerosMetadata.data?.requestBadgeEvidence

  if (!badgeEvidence || !badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl) {
    throw 'There was an error fetching the badge evidence, try again in some minutes.'
  }

  const evidenceItems: React.ReactNode[] =
    badgeEvidence?.columns.map((column, index) => (
      <Box
        key={'evidence-' + index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: 4,
          marginBottom: 4,
          width: '100%',
          '> *': {
            width: '90%',
            display: 'flex',
          },
        }}
      >
        <SafeSuspense>
          <DisplayEvidenceField
            columnItem={column}
            value={getEvidenceValue(
              badgeEvidence?.values,
              badgeEvidence?.columns,
              column.label,
              column.type,
            )}
          />
        </SafeSuspense>
      </Box>
    )) || []

  const getTooltipText = () => {
    if (address === ownerAddress) {
      return t('badge.curate.modal.ownBadgeChallenge')
    }
    if (isClaimable) {
      return t('badge.curate.modal.notClaimedBadge')
    }
    return ''
  }
  return (
    <Stack
      sx={{
        alignItems: 'center',
        width: '100%',
        gap: 3,
      }}
    >
      <Typography color={colors.green} id="modal-modal-title" variant="dAppHeadline2">
        {t('badge.curate.modal.evidence')}
      </Typography>

      <Box
        alignContent="center"
        display="flex"
        flex={1}
        justifyContent="space-between"
        mt={4}
        width="100%"
      >
        <Box display="flex" gap={1}>
          <Typography fontSize={14} variant="body4">
            {t('badge.curate.modal.requester')}
          </Typography>
          <Address address={ownerAddress} />
        </Box>
        <Box display="flex">
          <Typography fontSize={14} sx={{ textDecoration: 'underline !important' }} variant="body4">
            <a
              href={badgeKlerosMetadata.data?.requestBadgeEvidenceRawUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t('badge.curate.modal.viewEvidence')}
            </a>
          </Typography>
        </Box>
      </Box>

      <TBSwiper items={evidenceItems} maxSlidesPerView={1} spaceBetween={8} />

      <Stack
        alignItems={'center'}
        display="flex"
        justifyContent={'center'}
        sx={{
          width: '100%',
        }}
      >
        <Box mt={4}>
          <SafeSuspense
            fallback={<Skeleton sx={{ margin: 'auto' }} variant={'text'} width={500} />}
          >
            <CurationCriteriaLink badgeModelId={badgeModelId} type="curate" />
          </SafeSuspense>
        </Box>

        <Box mt={2}>
          <Tooltip arrow title={getTooltipText()}>
            {/* A disabled element does not fire events. So we need a wrapper to use the tooltip, also ButtonV2 doesn't forward the ref */}
            <Box>
              <ButtonV2
                backgroundColor={colors.redError}
                disabled={address === ownerAddress || isClaimable}
                fontColor={colors.white}
                onClick={onButtonClick}
              >
                <Typography>
                  {badge?.status === BadgeStatus.Challenged
                    ? t('badge.curate.modal.addMoreEvidence')
                    : t('badge.curate.modal.challengeButton')}
                </Typography>
              </ButtonV2>
            </Box>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  )
}
