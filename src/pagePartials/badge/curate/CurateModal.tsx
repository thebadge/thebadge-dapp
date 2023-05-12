import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal, Skeleton, Stack, Tooltip, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from 'thebadge-ui-library'
import { gradients } from 'thebadge-ui-library'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getEvidenceValue } from '@/src/utils/kleros/getEvidenceValue'

const ModalBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  maxWidth: '850px',
  minHeight: '50%',
  background:
    theme.palette.mode === 'light'
      ? gradients.gradientBackgroundLight
      : gradients.gradientBackgroundDark,
  borderRadius: theme.spacing(1),
  boxShadow: `0px 0px 20px rgba(255, 255, 255, 0.6)`,
  padding: theme.spacing(4),
  '& .MuiContainer-root': {
    maxWidth: '100%',
  },
}))

type CurateModalProps = {
  open: boolean
  onClose: () => void
  badgeTypeId: string
  ownerAddress: string
}
export default function CurateModal({
  badgeTypeId,
  onClose,
  open,
  ownerAddress,
}: CurateModalProps) {
  return (
    <Modal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      onClose={onClose}
      open={open}
    >
      <RequiredConnection noCloseButton>
        <ModalBody>
          <IconButton
            aria-label="close curate modal"
            color="secondary"
            component="label"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon color="white" />
          </IconButton>

          <SafeSuspense>
            <CurateModalContent
              badgeTypeId={badgeTypeId}
              onClose={onClose}
              ownerAddress={ownerAddress}
            />
          </SafeSuspense>
        </ModalBody>
      </RequiredConnection>
    </Modal>
  )
}

function CurateModalContent({
  badgeTypeId,
  onClose,
  ownerAddress,
}: {
  badgeTypeId: string
  ownerAddress: string
  onClose: () => void
}) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { challenge } = useCurateProvider()

  const badgeById = useBadgeById(badgeTypeId, ownerAddress)

  const badge = badgeById.data?.badge
  const badgeEvidence = badgeById.data?.badgeEvidence

  if (!badge) {
    return null
  }

  const evidenceItems: React.ReactNode[] =
    badgeEvidence?.columns.map((column, index) => (
      <Box
        key={'evidence-' + index}
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: 4,
          width: '100%',
          '> *': {
            width: '90%',
            display: 'flex',
          },
        }}
      >
        <DisplayEvidenceField
          columnItem={column}
          value={getEvidenceValue(
            badgeEvidence?.values,
            badgeEvidence?.columns,
            column.label,
            column.type,
          )}
        />
      </Box>
    )) || []

  return (
    <Stack
      sx={{
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography color={'#24F3D2'} id="modal-modal-title" variant="dAppHeadline2">
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
            <a href={badgeById.data?.rawBadgeEvidenceUrl} rel="noreferrer" target="_blank">
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
          <SafeSuspense fallback={<Skeleton variant={'text'} width={500} />}>
            <CurationCriteriaLink badgeTypeId={badgeTypeId} />
          </SafeSuspense>
        </Box>

        <Box mt={2}>
          <Tooltip
            arrow
            title={address === ownerAddress ? t('badge.curate.modal.ownBadgeChallenge') : ''}
          >
            {/* A disabled element does not fire events. So we need a wrapper to use the tooltip, also ButtonV2 doesn't forward the ref */}
            <Box>
              <ButtonV2
                backgroundColor={colors.redError}
                disabled={address === ownerAddress}
                fontColor={colors.white}
                onClick={() => {
                  challenge(badgeTypeId, ownerAddress)
                  onClose()
                }}
              >
                <Typography>{t('badge.curate.modal.challengeButton')}</Typography>
              </ButtonV2>
            </Box>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  )
}
