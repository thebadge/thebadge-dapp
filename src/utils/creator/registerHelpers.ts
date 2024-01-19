import { CreatorRegisterSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { Creator } from '@/types/badges/Creator'

export async function createAndUploadCreatorMetadata(
  data: CreatorRegisterSchemaType,
  withLogo = true,
) {
  const creatorMetadataIPFSUploaded = await ipfsUpload<Creator>({
    attributes: {
      ...data,
    },
    filePaths: withLogo ? ['logo'] : undefined,
  })

  return `ipfs://${creatorMetadataIPFSUploaded.result?.ipfsHash}`
}
