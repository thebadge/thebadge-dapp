import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal, Skeleton, Stack, Tooltip, Typography, styled } from '@mui/material'
import { ButtonV2, colors } from '@thebadge/ui-library'
import { gradients } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import { Address } from '@/src/components/helpers/Address'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import TBSwiper from '@/src/components/helpers/TBSwiper'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useEvidenceBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
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
  badgeId: string
}
export default function CurateModal({ badgeId, onClose, open }: CurateModalProps) {
  return (
    <Modal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      onClose={onClose}
      open={open}
    >
      <Box>
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
              <CurateModalContent badgeId={badgeId} onClose={onClose} />
            </SafeSuspense>
          </ModalBody>
        </RequiredConnection>
      </Box>
    </Modal>
  )
}

function CurateModalContent({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { challenge } = useCurateProvider()

  const badgeById = useBadgeById(badgeId)
  const badge = badgeById.data

  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
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
          margin: 4,
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
          <SafeSuspense fallback={<Skeleton variant={'text'} width={500} />}>
            <CurationCriteriaLink badgeModelId={badgeModelId} />
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
                  challenge(badgeModelId)
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
