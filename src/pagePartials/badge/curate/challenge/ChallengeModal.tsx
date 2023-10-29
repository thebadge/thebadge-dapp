import React from 'react'

import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import useTranslation from 'next-translate/useTranslation'
import { z } from 'zod'

import TBModal from '@/src/components/common/TBModal'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useChallengeCost } from '@/src/hooks/kleros/useChallengeCost'
import { useRemovalCost } from '@/src/hooks/kleros/useRemovalCost'
import useBadgeById from '@/src/hooks/subgraph/useBadgeById'
import { useBadgeKlerosMetadata } from '@/src/hooks/subgraph/useBadgeKlerosMetadata'
import useBadgeHelpers, { ReviewBadge } from '@/src/hooks/theBadge/useBadgeHelpers'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import CurationCriteriaLink from '@/src/pagePartials/badge/curate/CurationCriteriaLink'
import ChallengeCost from '@/src/pagePartials/badge/curate/challenge/ChallengeCost'
import EvidenceForm, {
  EvidenceSchema,
} from '@/src/pagePartials/badge/curate/evidenceForm/EvidenceForm'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import {
  removeChallengedBadgeId,
  saveChallengedBadgeId,
} from '@/src/utils/badges/challengeBadgesHelpers'
import { encodeIpfsEvidence } from '@/src/utils/badges/createBadgeModelHelpers'
import { BadgeStatus } from '@/types/generated/subgraph'
import { TheBadge__factory } from '@/types/generated/typechain'

type ChallengeModalProps = {
  open: boolean
  onClose: () => void
  badgeId: string
}

export default function ChallengeModal({ badgeId, onClose, open }: ChallengeModalProps) {
  return (
    <TBModal closeButtonAriaLabel="Close challenge modal" onClose={onClose} open={open}>
      <ChallengeModalContent badgeId={badgeId} onClose={onClose} />
    </TBModal>
  )
}

function ChallengeModalContent({ badgeId, onClose }: { badgeId: string; onClose: () => void }) {
  const { t } = useTranslation()
  const { address } = useWeb3Connection()
  const { sendTx } = useTransaction()

  const badgeById = useBadgeById(badgeId)
  const badgeKlerosMetadata = useBadgeKlerosMetadata(badgeId)
  const challengeCost = useChallengeCost(badgeId)
  const removalCost = useRemovalCost(badgeId)
  const { getBadgeReviewStatus } = useBadgeHelpers()

  const badge = badgeById.data
  if (!badge) {
    throw 'There was an error fetching the badge, try again in some minutes.'
  }

  const badgeModelId = badge.badgeModel.id
  const theBadge = useContractInstance(TheBadge__factory, 'TheBadge')

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
      const { reviewTimeFinished } = getBadgeReviewStatus(badge as ReviewBadge)
      switch (badge.status) {
        case BadgeStatus.Requested:
          // If the badge finished its reviewPeriod but it was not claimed they are in an intermediate status: "Claimable", therefore neither challenge or removeItem is possible
          // This logic should never be executed, the frontend should filter badges in this intermediate state, but I throw an exception here just in case.
          if (reviewTimeFinished) {
            throw new Error(
              'The badge was not claimed, challenge an unclaimed badge is not possible.',
            )
          }
          // If the badge is on review period, we generate a challenge request in TCR
          return theBadge.challenge(badgeId, encodeIpfsEvidence(evidenceIPFSHash), {
            value: challengeCost.data,
          })
        case BadgeStatus.Approved:
          // If the badge is on the list, we generate a removeItem request in TCR
          return theBadge.removeItem(badgeId, encodeIpfsEvidence(evidenceIPFSHash), {
            value: removalCost.data,
          })
        case BadgeStatus.Absent:
          throw 'There was an error fetching the badge status, try again in some minutes.'
        case BadgeStatus.RequestRemoval:
        case BadgeStatus.Challenged:
          throw new Error('The badge is already challenged. You cant challenge it again')
      }
    })

    onClose()
    if (transaction) {
      saveChallengedBadgeId(badgeId, address)
      // If the TX fails, we remove the badge from the array
      await transaction.wait().catch(() => removeChallengedBadgeId(badgeId, address))
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
        {badge.status === BadgeStatus.Approved
          ? t('badge.challenge.modal.remove')
          : t('badge.challenge.modal.challenge')}
      </Typography>
      <SafeSuspense fallback={<Skeleton sx={{ margin: 'auto' }} variant={'text'} width="75%" />}>
        <CurationCriteriaLink
          badgeModelId={badgeModelId}
          isRemoval={badge.status === BadgeStatus.Approved}
          type="challenge"
        />
      </SafeSuspense>
      <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'left', gap: 1 }}>
        <FindInPageOutlinedIcon />
        <Typography component="p" variant="body2">
          {badge.status === BadgeStatus.Approved
            ? t('badge.challenge.modal.explainWhyRemoval')
            : t('badge.challenge.modal.explainWhyChallenge')}
        </Typography>
      </Box>
      <EvidenceForm
        onSubmit={onSubmit}
        showCostComponent={
          <SafeSuspense>
            <ChallengeCost badgeId={badge.id} badgeModelId={badgeModelId} />
          </SafeSuspense>
        }
        type="challenge"
      />
    </Stack>
  )
}
