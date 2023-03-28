import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton, Modal, Skeleton, Stack, Typography, styled } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { ButtonV2, colors } from 'thebadge-ui-library'

import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import ChallengeCost from '@/src/pagePartials/badge/challenge/ChallengeCost'
import ListingCriteriaLink from '@/src/pagePartials/badge/challenge/ListingCriteriaLink'
import { useChallengeProvider } from '@/src/providers/challengeProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { SubgraphName, getSubgraphSdkByNetwork } from '@/src/subgraph/subgraph'

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
  const { address, appChainId } = useWeb3Connection()
  const { challenge } = useChallengeProvider()

  const gql = getSubgraphSdkByNetwork(appChainId, SubgraphName.TheBadge)
  const badgeId = `${ownerAddress}-${badgeTypeId}`
  const response = gql.useBadgeById({ id: badgeId })
  const badge = response.data?.badge || null

  const evidenceRes: any = useS3Metadata(badge?.evidenceMetadataUrl || '')
  const badgeEvidence = evidenceRes.data.content
  const badgeEvidenceUrl = evidenceRes.data.s3Url

  if (!badge) {
    return <div></div>
  }

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: 4,
        width: '100%',
      }}
    >
      <Typography color={'#42FF00'} id="modal-modal-title" variant="dAppHeadline2">
        {t('badge.curate.modal.evidence')}
      </Typography>

      <Box ml={'auto'} mt={'auto'}>
        <Typography fontSize={14} sx={{ textDecoration: 'underline !important' }} variant="body4">
          <a href={badgeEvidenceUrl} rel="noreferrer" target="_blank">
            {t('badge.curate.modal.viewEvidence')}
          </a>
        </Typography>
      </Box>

      {badgeEvidence.columns.map((column: any) => {
        return (
          <Box
            display="flex"
            gap={3}
            justifyContent={'start'}
            key={'evidence-' + column.label}
            width={'100%'}
          >
            <Box>
              <Typography variant={'h4'}>{column.label}</Typography>
              {column.type === 'image' ? (
                <img
                  alt={'evidence-' + column.label + '-image'}
                  src={badgeEvidence.values[column.label].data_url}
                  width={'100px'}
                />
              ) : (
                <Typography fontSize={12} variant={'inherit'}>
                  {badgeEvidence.values[column.label].toString()}
                </Typography>
              )}
            </Box>
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
            Challenge
          </ButtonV2>
        </Box>
      </Stack>
    </Stack>
  )
}
