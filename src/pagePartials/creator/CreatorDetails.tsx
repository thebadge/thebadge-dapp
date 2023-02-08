import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'

type Props = {
  metadata: string
}
function CreatorDetails({ metadata }: Props) {
  const res = useS3Metadata(metadata)
  console.log({ res })
  return <SafeSuspense>CreatorInfo</SafeSuspense>
}

export default CreatorDetails
