import useS3Metadata from '@/src/hooks/useS3Metadata'
import { KlerosListStructure } from '@/src/utils/kleros/generateKlerosListMetaEvidence'

export default function useBadgeModelRegistrationMetadata(registrationUri: string) {
  return useS3Metadata<KlerosListStructure>(registrationUri)
}
