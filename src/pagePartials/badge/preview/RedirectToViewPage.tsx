'use client'

import { redirect, useParams, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Client component that redirects the user to the real view page
 * @constructor
 */
export default function RedirectToViewPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    const badgeId = params?.badgeId as string
    const contract = searchParams?.get('contract') as string

    redirect(`/badge/${badgeId}?contract=${contract}`)
  }, [params?.badgeId, searchParams])
  return <></>
}
