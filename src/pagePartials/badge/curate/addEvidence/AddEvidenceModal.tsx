import React from 'react'

import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import { useTranslation } from 'next-export-i18n'
import { z } from 'zod'

import TBModal from '@/src/components/common/TBModal'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useTCRContractInstance from '@/src/hooks/kleros/useTCRContractInstance'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import useTransaction from '@/src/hooks/useTransaction'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import EvidenceForm, {
  EvidenceSchema,
} from '@/src/pagePartials/badge/curate/evidenceForm/EvidenceForm'
import { BadgeStatus } from '@/types/generated/subgraph'

type AddEvidenceModalProps = {
  open: boolean
  onClose: () => void
  badgeId: string
}
export default function AddEvidenceModal({ badgeId, onClose, open }: AddEvidenceModalProps) {
  return (
    <TBModal closeButtonAriaLabel="Close add evidence modal" onClose={onClose} open={open}>
      <AddEvidenceModalContent badgeId={badgeId} onClose={onClose} />
    </TBModal>
  )
}

function AddEvidenceModalContent({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const { t } = useTranslation()
  const { sendTx } = useTransaction()

  const badgeById = useBadgeById(badgeId)
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId)

  const badge = badgeById.data
  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }

  const badgeModelId = badge.badgeModel.id
  const tcrContractInstance = useTCRContractInstance(badgeModelId)

  async function onSubmit(data: z.infer<typeof EvidenceSchema>) {
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
      switch (badge.status) {
        case BadgeStatus.Absent:
          throw 'There was an error fetching the badge status, try again in some minutes.'
        case BadgeStatus.Challenged:
          // If the badge is already challenged or a removal request was generated, only adding more evidence is possible.
          return tcrContractInstance.submitEvidence(
            badgeKlerosMetadata.data?.itemID,
            evidenceIPFSHash,
          )
        default:
          throw new Error(
            'The badge status doesnt allow add more evidence, make a challenge first.',
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
        gap: 3,
        width: '100%',
      }}
    >
      <Typography color="error" id="tbmodal-title" textAlign="center" variant="dAppHeadline2">
        {t('badge.addEvidence.modal.title')}
      </Typography>
      <SafeSuspense fallback={<Skeleton sx={{ margin: 'auto' }} variant={'text'} width={500} />}>
        <CurationCriteriaLink badgeModelId={badgeModelId} type="addEvidence" />
      </SafeSuspense>
      <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'left', gap: 1 }}>
        <FindInPageOutlinedIcon />
        <Typography component="p" variant="body2">
          {badge.status === BadgeStatus.Approved
            ? t('badge.addEvidence.modal.explainWhyRemoval')
            : t('badge.addEvidence.modal.explainWhyChallenge')}
        </Typography>
      </Box>
      <EvidenceForm onSubmit={onSubmit} type="addEvidence" />
    </Stack>
  )
}
