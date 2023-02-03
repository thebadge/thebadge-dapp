import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'

type Props = {
  metadata: string
}

function BadgeTypeMetadata({ metadata }: Props) {
  const res: any = useS3Metadata(metadata)
  console.log({ res })
  console.log({ n: res.data.file.name })
  console.log({ d: res.data.file.description })
  // console.log({ res.data.file.name })
  return <div>Details</div>
}

export default withGenericSuspense(BadgeTypeMetadata)
