import { useEnsReverseLookup } from '@/src/hooks/useEnsLookup'
import useS3Metadata from '@/src/hooks/useS3Metadata'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { CreatorMetadata } from '@/types/badges/Creator'
import { WCAddress } from '@/types/utils'

/**
 * Hook that use useSWR with disabled revalidation to reduce the API usage. After fetching the hash data one, it won't
 * re-fetched twice after the user close the app, this should be fine, si it's a IFS File.
 * @param metadataUri
 * @param address
 */
export default function useUserMetadata(
  address: WCAddress | string | undefined,
  metadataUri?: string,
) {
  const { address: connectedWalletAddress } = useWeb3Connection()
  const resCreatorMetadata = useS3Metadata<{ content: CreatorMetadata }>(metadataUri || '')
  const ensMetadata = useEnsReverseLookup(address || connectedWalletAddress)
  const creatorMetadata = resCreatorMetadata.data?.content
  const ensMetadataResult = ensMetadata.data?.metadata

  const ensNameOrAddress = ensMetadata?.data
    ? ensMetadata?.data.ensNameOrAddress
    : address || connectedWalletAddress
  const isEnsName = ensMetadata?.data ? ensMetadata.data.isEnsName : false
  return {
    name: creatorMetadata?.name || ensMetadataResult?.name,
    description: creatorMetadata?.description || ensMetadataResult?.description,
    email: creatorMetadata?.email || ensMetadataResult?.email,
    website: creatorMetadata?.website || ensMetadataResult?.website,
    twitter: creatorMetadata?.twitter || ensMetadataResult?.twitter,
    discord: creatorMetadata?.discord || ensMetadataResult?.discord,
    linkedin: creatorMetadata?.linkedin || ensMetadataResult?.linkedin,
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
  }
}
