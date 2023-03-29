import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal, Skeleton, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from 'thebadge-ui-library'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeById from '@/src/hooks/useBadgeById'
import ListingCriteriaLink from '@/src/pagePartials/badge/curate/ListingCriteriaLink'
import { useCurateProvider } from '@/src/providers/curateProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  background: theme.palette.background.paper,
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

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: 4,
        width: '100%',
      }}
    >
      <Typography color={'#24F3D2'} id="modal-modal-title" variant="dAppHeadline2">
        {t('badge.curate.modal.evidence')}
      </Typography>

      <Box ml={'auto'} mt={'auto'}>
        <Typography fontSize={14} sx={{ textDecoration: 'underline !important' }} variant="body4">
          <a href={badgeById.data?.rawBadgeEvidenceUrl} rel="noreferrer" target="_blank">
            {t('badge.curate.modal.viewEvidence')}
          </a>
        </Typography>
      </Box>

      {badgeEvidence?.columns.map((column) => {
        return (
          <Box
            display="flex"
            gap={3}
            justifyContent={'start'}
            key={'evidence-' + column.label}
            sx={{
              width: '75%',
              '& > *': {
                display: 'flex',
                flex: '1',
              },
            }}
          >
            <DisplayEvidenceField columnItem={column} value={badgeEvidence.values[column.label]} />
          </Box>
        )
      })}

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
            <ListingCriteriaLink badgeTypeId={badgeTypeId} />
          </SafeSuspense>
        </Box>

        <Box mt={2}>
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
      </Stack>
    </Stack>
  )
}
