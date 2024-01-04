import { useUserById } from '@/src/hooks/subgraph/useUserById'
import { useEnsReverseLookup } from '@/src/hooks/useEnsLookup'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { CONTACT_METHODS_ENUM } from '@/src/pagePartials/creator/register/schema/CreatorRegisterSchema'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { extractGitHubUsername, extractTwitterUsername } from '@/src/utils/strings'
import { CreatorMetadata } from '@/types/badges/Creator'
import { WCAddress } from '@/types/utils'

export type UserMetadata = {
  name?: string
  logo: {
    mimeType?: string
    s3Url?: string
    base64File?: string
    extension?: string
    ipfsUrl?: string
    ipfs?: string
  }
  preferContactMethod?: typeof CONTACT_METHODS_ENUM
  ensNameOrAddress?: string
  isEnsName: boolean
  terms?: boolean
  hasAboutData: boolean
  hasSocialData: boolean
}

/**
 * Hook that use useSWR with disabled revalidation to reduce the API usage. After fetching the hash data one, it won't
 * re-fetched twice after the user close the app, this should be fine, si it's a IFS File.
 * @param metadataUri
 * @param address
 * @param targetContract
 */
export default function useUserMetadata(
  address?: WCAddress | string,
  metadataUri?: string,
  targetContract?: string,
) {
  const { address: connectedWalletAddress } = useWeb3Connection()

  const owner = useUserById((address as WCAddress) || connectedWalletAddress, targetContract)
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(
    metadataUri || owner.data?.metadataUri || '',
  )
  const ensMetadata = useEnsReverseLookup(address || connectedWalletAddress)

  const creatorMetadata = resCreatorMetadata.data?.content
  const ensMetadataResult = ensMetadata.data?.metadata

  const ensNameOrAddress = ensMetadata?.data
    ? ensMetadata?.data.ensNameOrAddress
    : address || connectedWalletAddress
  const isEnsName = ensMetadata?.data ? ensMetadata.data.isEnsName : false

  const socialData = {
    twitter: extractTwitterUsername(creatorMetadata?.twitter || ensMetadataResult?.twitter),
    discord: creatorMetadata?.discord || ensMetadataResult?.discord,
    linkedin: creatorMetadata?.linkedin || ensMetadataResult?.linkedin,
    github: extractGitHubUsername(creatorMetadata?.github || ensMetadataResult?.github),
    telegram: creatorMetadata?.telegram || ensMetadataResult?.telegram,
  }

  const aboutData = {
    description: creatorMetadata?.description || ensMetadataResult?.description,
    email: creatorMetadata?.email || ensMetadataResult?.email,
    website: creatorMetadata?.website || ensMetadataResult?.website,
  }

  return {
    name: creatorMetadata?.name || ensMetadataResult?.name,
    ...aboutData,
    ...socialData,
    logo: {
      mimeType: 'image/jpeg',
      s3Url: creatorMetadata?.logo?.s3Url || ensMetadata.data?.avatar,
      base64File: creatorMetadata?.logo?.s3Url || ensMetadata.data?.avatar,
      extension: creatorMetadata?.extension,
      ipfsUrl: creatorMetadata?.ipfsUrl,
      ipfs: creatorMetadata?.ipfs,
    },
    preferContactMethod: creatorMetadata?.preferContactMethod,
    ensNameOrAddress,
    isEnsName,
    terms: resCreatorMetadata.data?.terms,
    hasAboutData: aboutData.description || aboutData.email || aboutData.website,
    hasSocialData:
      socialData.twitter ||
      socialData.discord ||
      socialData.linkedin ||
      socialData.github ||
      socialData.telegram,
  }
}
