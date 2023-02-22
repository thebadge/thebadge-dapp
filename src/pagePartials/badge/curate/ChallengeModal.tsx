import { Dispatch, SetStateAction } from 'react'

import { Dialog } from '@mui/material'
import { BigNumber } from 'ethers'
import { z } from 'zod'

import { CustomFormFromSchema } from '@/src/components/form/customForms/CustomForm'
import { FileSchema, LongTextSchema } from '@/src/components/form/helpers/customSchemas'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { BadgesInReviewQuery } from '@/types/generated/subgraph'
import { KlerosBadgeTypeController__factory } from '@/types/generated/typechain'

const EvidenceSchema = z.object({
  title: z.string().describe('Title // The title of the challenge'),
  description: LongTextSchema.describe(
    'Description // Describe why you thik this badge should not be granted',
  ),
  attachment: FileSchema.describe('Attachment // Label description'),
})
type Props = {
  badge: BadgesInReviewQuery['badges'][0]
  open: boolean
  closeModal: Dispatch<SetStateAction<boolean>>
  challengeCost: BigNumber
}
export function ChallengeModal({ badge, challengeCost, closeModal, open }: Props) {
  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )

  const onSubmit = async (data: z.infer<typeof EvidenceSchema>) => {
    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: {
        title: data.title,
        description: data.description,
        fileURI: { mimeType: data.attachment?.file.type, base64File: data.attachment?.data_url },
        fileTypeExtension: data.attachment?.file.type,
        type: data.attachment?.file.type.split('/')[1],
      },
      filePaths: ['fileURI'],
    })

    if (!evidenceIPFSUploaded.result) {
      throw 'There was no possible to upload evidence.'
    }

    klerosController.challengeBadge(
      badge.badgeType.id,
      badge.receiver.id,
      `ipfs://${evidenceIPFSUploaded.result?.ipfsHash}`,
      {
        value: challengeCost,
      },
    )
  }

  return (
    <Dialog onClose={closeModal} open={open} title="Submit evidence">
      <CustomFormFromSchema onSubmit={onSubmit} schema={EvidenceSchema} />
    </Dialog>
  )
}
