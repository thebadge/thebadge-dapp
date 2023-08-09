import { CreatorRegisterSchemaType } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import ipfsUpload from '@/src/utils/ipfsUpload'
import { Creator } from '@/types/badges/Creator'

export async function createAndUploadCreatorMetadata(data: CreatorRegisterSchemaType) {
  const creatorMetadataIPFSUploaded = await ipfsUpload<Creator>({
    // I know that we could do a destructuring, but it's better if we
    // can read clearly what data is sent on creator register
    attributes: {
      name: data.name,
      description: data.description,
      logo: data.logo,
      discord: data.discord,
      email: data.email,
      website: data.website,
      twitter: data.twitter,
      preferContactMethod: data.preferContactMethod,
      terms: data.terms,
    },
    filePaths: ['logo'],
  })

  return `ipfs://${creatorMetadataIPFSUploaded.result?.ipfsHash}`
}
