import React from 'react'

import CloseIcon from '@mui/icons-material/Close'
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined'
import {
  Box,
  Container,
  IconButton,
  Modal,
  Skeleton,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { z } from 'zod'

import { CustomFormFromSchemaWithoutSubmit } from '@/src/components/form/customForms/CustomForm'
import { DataGrid } from '@/src/components/form/customForms/type'
import { LongTextSchema, OptionalFileSchema } from '@/src/components/form/helpers/customSchemas'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import ChallengeCost from '@/src/pagePartials/badge/challenge/ChallengeCost'
import ListingCriteriaLink from '@/src/pagePartials/badge/challenge/ListingCriteriaLink'
import { useBadgeCost } from '@/src/pagePartials/badge/curate/useBadgeCost'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { KlerosBadgeTypeController__factory } from '@/types/generated/typechain'

const ModalBody = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  minHeight: '50%',
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: `0px 0px 20px rgba(255, 255, 255, 0.6);`,
  padding: theme.spacing(4),
  '& .MuiContainer-root': {
    maxWidth: '100%',
  },
}))

const formGridLayout: DataGrid[] = [
  { i: 'TextField', x: 0, y: 0, w: 7.5, h: 2, static: true },
  { i: 'LongTextSchema', x: 0, y: 2, w: 4, h: 4, static: true },
  { i: 'FileSchema', x: 4, y: 3.5, w: 4, h: 2, static: true },
]

export const ChallengeSchema = z.object({
  title: z.string().describe('Title // The title of the challenge'),
  description: LongTextSchema.describe(
    'Description // Explain why do you think that this badge need to be removed.',
  ),
  attachment: OptionalFileSchema,
})

type ChallengeModalProps = {
  open: boolean
  onClose: () => void
  badgeTypeId: string
  ownerAddress: string
}
export default function ChallengeModal({
  badgeTypeId,
  onClose,
  open,
  ownerAddress,
}: ChallengeModalProps) {
  return (
    <Modal
      aria-describedby="modal-modal-description"
      aria-labelledby="modal-modal-title"
      onClose={onClose}
      open={open}
    >
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

        <ChallengeModalContent
          badgeTypeId={badgeTypeId}
          onClose={onClose}
          ownerAddress={ownerAddress}
        />
      </ModalBody>
    </Modal>
  )
}

function ChallengeModalContent({
  badgeTypeId,
  onClose,
  ownerAddress,
}: {
  badgeTypeId: string
  ownerAddress: string
  onClose: () => void
}) {
  const klerosController = useContractInstance(
    KlerosBadgeTypeController__factory,
    'KlerosBadgeTypeController',
  )
  const challengeCost = useBadgeCost(badgeTypeId, ownerAddress)

  async function onSubmit(data: z.infer<typeof ChallengeSchema>) {
    const hasAttachment = data.attachment && data.attachment?.data_url

    const evidenceIPFSUploaded = await ipfsUpload({
      attributes: {
        title: data.title,
        description: data.description,
        ...(hasAttachment
          ? {
              fileURI: {
                mimeType: data.attachment?.file.type,
                base64File: data.attachment?.data_url,
              },
              fileTypeExtension: data.attachment?.file.type,
              type: data.attachment?.file.type.split('/')[1],
            }
          : {}),
      },
      filePaths: hasAttachment ? ['fileURI'] : [],
    })

    if (!evidenceIPFSUploaded.result) {
      throw 'There was no possible to upload evidence.'
    }

    klerosController.challengeBadge(
      badgeTypeId,
      ownerAddress,
      `ipfs://${evidenceIPFSUploaded.result?.ipfsHash}`,
      {
        value: challengeCost,
      },
    )

    onClose()
  }

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: 4,
        width: '100%',
      }}
    >
      <Typography color={'#42FF00'} id="modal-modal-title" variant="h3">
        Challenge Badge
      </Typography>
      <SafeSuspense fallback={<Skeleton variant={'text'} width={500} />}>
        <ListingCriteriaLink badgeTypeId={badgeTypeId} />
      </SafeSuspense>
      <Container sx={{ flexDirection: 'row', display: 'flex', gap: 2 }}>
        <FindInPageOutlinedIcon />
        <Typography>Explain de jurors why do you think this items should de removed.</Typography>
      </Container>
      <Stack
        sx={{
          width: '100%',
        }}
      >
        <CustomFormFromSchemaWithoutSubmit
          formProps={{
            rowHeight: 45,
            layout: 'gridResponsive',
            gridStructure: formGridLayout,
            buttonLabel: 'Send',
          }}
          onSubmit={onSubmit}
          props={{
            description: { rows: 4 },
          }}
          schema={ChallengeSchema}
        />
      </Stack>
      <SafeSuspense>
        <ChallengeCost badgeTypeId={badgeTypeId} ownerAddress={ownerAddress} />
      </SafeSuspense>
    </Stack>
  )
}
