import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import { useEnsLookup } from '@/src/hooks/useEnsLookup'
import SharedProfile from '@/src/pagePartials/profile/SharedProfile'
import { generateProfileUrl } from '@/src/utils/navigation/generateUrl'
import { NextPageWithLayout } from '@/types/next'

const SharedProfilePage: NextPageWithLayout = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const addressOnUrl = searchParams?.get('address')?.toLowerCase()

  const addressFound = useEnsLookup(addressOnUrl)

  if (!addressFound.data) {
    router.replace(generateProfileUrl())
    return null
  }

  return <SharedProfile address={addressFound.data} />
}

export default SharedProfilePage
