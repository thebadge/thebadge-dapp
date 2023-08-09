import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import CloseIcon from '@mui/icons-material/Close'
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined'
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Modal,
  Skeleton,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { colors, gradients } from '@thebadge/ui-library'
import { useTranslation } from 'next-export-i18n'
import { Controller, useForm } from 'react-hook-form'
import { ImageType } from 'react-images-uploading'
import { z } from 'zod'

import { FileInput } from '@/src/components/form/FileInput'
import { TextArea } from '@/src/components/form/TextArea'
import { TextField } from '@/src/components/form/TextField'
import { LongTextSchema, OptionalFileSchema } from '@/src/components/form/helpers/customSchemas'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useChallengeCost } from '@/src/hooks/kleros/useChallengeCost'
import { useRemovalCost } from '@/src/hooks/kleros/useRemovalCost'
import useTCRContractInstance from '@/src/hooks/kleros/useTCRContractInstance'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import { TimeLeft, useDate } from '@/src/hooks/useDate'
import useTransaction from '@/src/hooks/useTransaction'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import ChallengeCost from '@/src/pagePartials/badge/curate/challenge/ChallengeCost'
import { RequiredConnection } from '@/src/pagePartials/errors/requiredConnection'
import { BadgeStatus } from '@/types/generated/subgraph'

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

export const ChallengeSchema = z.object({
  title: z.string(),
  description: LongTextSchema,
  attachment: OptionalFileSchema,
})

type ChallengeModalProps = {
  open: boolean
  onClose: () => void
  badgeId: string
}
export default function ChallengeModal({ badgeId, onClose, open }: ChallengeModalProps) {
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
              aria-label="close challenge modal"
              color="secondary"
              component="label"
              onClick={onClose}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon color="white" />
            </IconButton>

            <SafeSuspense>
              <ChallengeModalContent badgeId={badgeId} onClose={onClose} />
            </SafeSuspense>
          </ModalBody>
        </RequiredConnection>
      </Box>
    </Modal>
  )
}

function ChallengeModalContent({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const { t } = useTranslation()
  const { sendTx } = useTransaction()

  const { control, handleSubmit } = useForm<z.infer<typeof ChallengeSchema>>({
    resolver: zodResolver(ChallengeSchema),
  })

  const badgeById = useBadgeById(badgeId)
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId)
  const challengeCost = useChallengeCost(badgeId)
  const removalCost = useRemovalCost(badgeId)
  const { getTimeLeftToExpire, timestampToDate } = useDate()

  const badge = badgeById.data
  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }

  const badgeModelId = badge.badgeModel.id
  const tcrContractInstance = useTCRContractInstance(badgeModelId)

  async function onSubmit(data: z.infer<typeof ChallengeSchema>) {
    if (!badge || !badge.status) {
      throw 'There was an error fetching the badge, try again in some minutes.'
    }

    const { description, title } = data
    // Use NextJs dynamic import to reduce the bundle size
    const { createAndUploadChallengeEvidence } = await import(
      '@/src/utils/badges/challengeBadgesHelpers'
    )

    const evidenceIPFSHash = await createAndUploadChallengeEvidence(
      title,
      description,
      data.attachment,
    )

    const transaction = await sendTx(() => {
      if (!badgeKlerosMetadata || !badgeKlerosMetadata.data) {
        throw 'There was an error fetching the badge metadata or the badge is not a klerosBadge, try again in some minutes.'
      }
      const dueDate: Date = timestampToDate(badgeKlerosMetadata.data.reviewDueDate)
      const timeLeft: TimeLeft = getTimeLeftToExpire(dueDate)
      switch (badge.status) {
        case BadgeStatus.Absent:
          throw 'There was an error fetching the badge status, try again in some minutes.'
        case BadgeStatus.Requested:
          // If the badge finished its reviewPeriod but it was not claimed they are in an intermediate status: "Claimable", therefore neither challenge or removeItem is possible
          // This logic should never be executed, the frontend should filter badges in this intermediate state, but I throw an exception here just in case.
          if (timeLeft.quantity === 0) {
            throw new Error(
              'The badge was not claimed, challenge an unclaimed badge is not possible.',
            )
          }
          // If the badge is on review period, we generate a challenge request in TCR
          return tcrContractInstance.challengeRequest(
            badgeKlerosMetadata.data.itemID,
            evidenceIPFSHash,
            {
              value: challengeCost.data,
            },
          )
        case BadgeStatus.Approved:
          // If the badge is on the list, we generate a removeItem request in TCR
          return tcrContractInstance.removeItem(badgeKlerosMetadata.data.itemID, evidenceIPFSHash, {
            value: removalCost.data,
          })
        case BadgeStatus.RequestRemoval:
        case BadgeStatus.Challenged:
          // If the badge is already challenged or a removal request was generated, only adding more evidence is possible.
          return tcrContractInstance.submitEvidence(
            badgeKlerosMetadata.data?.itemID,
            evidenceIPFSHash,
          )
      }
    })

    onClose()
    if (transaction) {
      await transaction.wait()
    }
  }

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: 4,
        width: '100%',
      }}
    >
      <Typography color="error" id="modal-modal-title" variant="dAppHeadline2">
        {t('badge.challenge.modal.challenge')}
      </Typography>
      <SafeSuspense fallback={<Skeleton variant={'text'} width={500} />}>
        <CurationCriteriaLink badgeModelId={badgeModelId} />
      </SafeSuspense>
      <Container sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', gap: 1 }}>
        <FindInPageOutlinedIcon />
        <Typography component="p" variant="body2">
          {t('badge.challenge.modal.explainWhy')}
        </Typography>
      </Container>
      <Stack
        sx={{
          width: '100%',
        }}
      >
        <Controller
          control={control}
          name={'title'}
          render={({ field: { name, onChange, value }, fieldState: { error } }) => (
            <TextField error={error} label={name} onChange={onChange} value={value} />
          )}
        />
        <Box display="flex" gap={3} mb={4}>
          <Box display="flex" flex={1} sx={{ '& > *': { flex: 1 } }}>
            <Controller
              control={control}
              name={'description'}
              render={({ field: { name, onChange, value }, fieldState: { error } }) => (
                <TextArea error={error} label={name} onChange={onChange} value={value} />
              )}
            />
          </Box>
          <Box display="flex" flex={1} mb={2}>
            <Controller
              control={control}
              name={'attachment'}
              render={({ field: { name, onChange, value }, fieldState: { error } }) => (
                <FileInput
                  error={error}
                  label={name}
                  onChange={(value: ImageType | null) => {
                    if (value) {
                      // We change the structure a little bit to have it ready to push to the backend
                      onChange({
                        mimeType: value.file?.type,
                        base64File: value.data_url,
                      })
                    } else onChange(null)
                  }}
                  value={value}
                />
              )}
            />
          </Box>
        </Box>

        <SafeSuspense>
          <ChallengeCost badgeId={badge.id} badgeModelId={badgeModelId} />
        </SafeSuspense>
        <Divider color={colors.white} sx={{ mt: 8 }} />
        <Box display="flex" mt={4}>
          <Button
            color="error"
            onClick={handleSubmit(onSubmit)}
            sx={{ borderRadius: 3, ml: 'auto', color: colors.black }}
            variant="contained"
          >
            Send
          </Button>
        </Box>
      </Stack>
    </Stack>
  )
}
