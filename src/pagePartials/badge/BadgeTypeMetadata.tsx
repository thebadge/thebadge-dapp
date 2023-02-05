import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import useS3Metadata from '@/src/hooks/useS3Metadata'

type Props = {
  metadata: string
}

function BadgeTypeMetadata({ metadata }: Props) {
  const res: any = useS3Metadata(metadata)
  console.log({ res })
  return (
    <div>
      <div>Name: {res.data.file.name}</div>
      <div>Desc: {res.data.file.description}</div>
    </div>
  )
}

export default withGenericSuspense(BadgeTypeMetadata)
