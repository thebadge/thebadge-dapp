import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'

import SharedProfile from '@/src/pagePartials/profile/SharedProfile'
import { NextPageWithLayout } from '@/types/next'

const SharedProfilePage: NextPageWithLayout = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const addressOnUrl = searchParams.get('address')?.toLowerCase()

  if (!addressOnUrl) {
    router.replace(`/profile`)
    return null
  }

  return <SharedProfile address={addressOnUrl} />
}

export default SharedProfilePage
