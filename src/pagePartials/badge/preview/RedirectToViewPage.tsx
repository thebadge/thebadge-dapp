'use client'
import { redirect, useParams } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Client component that redirects the user to the real view page
 * @constructor
 */
export default function RedirectToViewPage() {
  const params = useParams()
  // const badgeId = params?.badgeId as string
  // const contract = searchParams?.contract as string
  //

  useEffect(() => {
    const badgeId = params?.badgeId as string
    const contract = params?.contract as string

    redirect(`/badge/${badgeId}?contract=${contract}`)
  }, [params?.badgeId, params?.contract])
  return <></>
}
