import React from 'react'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  IconButton,
  Modal,
  Skeleton,
  Stack,
  Typography,
  keyframes,
  styled,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { A11y, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { ButtonV2, colors } from 'thebadge-ui-library'

import DisplayEvidenceField from '@/src/components/displayEvidence/DisplayEvidenceField'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useBadgeById from '@/src/hooks/useBadgeById'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
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

const growEffect = keyframes`
  0% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
`

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
  const theme = useTheme()

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

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <ArrowBackIosIcon
          className={'badges-swiper-button-prev'}
          sx={{
            mr: '1rem',
            height: '35px',
            width: '35px',
            animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
          }}
        />
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          navigation={{
            nextEl: '.badges-swiper-button-next',
            prevEl: '.badges-swiper-button-prev',
          }}
          pagination={{ clickable: true }}
          slidesPerView={1}
        >
          {badgeEvidence?.columns.map((column) => {
            return (
              <SwiperSlide
                key={'evidence-' + column.label}
                style={{ height: 'auto', padding: '46px' }}
              >
                <Box
                  alignItems={'center'}
                  display="flex"
                  gap={3}
                  height={'100%'}
                  justifyContent={'center'}
                  sx={{
                    '> *': {
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    },
                  }}
                >
                  <DisplayEvidenceField
                    columnItem={column}
                    value={badgeEvidence.values[column.label]}
                  />
                </Box>
              </SwiperSlide>
            )
          })}
        </Swiper>
        <ArrowForwardIosIcon
          className={'badges-swiper-button-next'}
          sx={{
            ml: '1rem',
            height: '35px',
            width: '35px',
            animation: `${growEffect} 1s infinite alternate ${theme.transitions.easing.easeInOut}`,
          }}
        />
      </Box>

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
