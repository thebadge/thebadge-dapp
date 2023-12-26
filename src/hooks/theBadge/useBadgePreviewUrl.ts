import { useEffect, useMemo, useState } from 'react'

import axios from 'axios'

import { APP_URL, BACKEND_URL, SHORT_APP_URL } from '@/src/constants/common'
import {
  generateBadgePreviewShareableUrl,
  generateBadgePreviewUrl,
  generateOpenseaUrl,
} from '@/src/utils/navigation/generateUrl'
import { ChainsValues } from '@/types/chains'
const { useWeb3Connection } = await import('@/src/providers/web3ConnectionProvider')

export default function useBadgePreviewUrl(
  badgeId: string,
  badgeContractAddress: string,
  userChainId?: ChainsValues,
) {
  const { readOnlyChainId } = useWeb3Connection()
  const [shortPreviewURl, setShortPreviewUrl] = useState<string>('')
  const [shortPreviewShareableUrl, setShortPreviewShareableUrl] = useState<string>('')

  const badgePreviewUrl = useMemo(
    () =>
      APP_URL +
      generateBadgePreviewUrl(badgeId, {
        theBadgeContractAddress: badgeContractAddress,
        connectedChainId: userChainId ? userChainId : readOnlyChainId,
      }),
    [badgeContractAddress, badgeId, userChainId, readOnlyChainId],
  )

  const badgePreviewShareableUrl = useMemo(
    () =>
      APP_URL +
      generateBadgePreviewShareableUrl(badgeId, {
        theBadgeContractAddress: badgeContractAddress,
        connectedChainId: userChainId ? userChainId : readOnlyChainId,
      }),
    [badgeContractAddress, badgeId, userChainId, readOnlyChainId],
  )

  const badgeOpenseaUrl = useMemo(
    () =>
      generateOpenseaUrl({
        badgeId,
        contractAddress: badgeContractAddress,
        networkId: userChainId ? userChainId : readOnlyChainId,
      }),
    [badgeContractAddress, badgeId, userChainId, readOnlyChainId],
  )

  useEffect(() => {
    const getShortPreviewURL = async (): Promise<void> => {
      let shortPreviewUrl = ''
      let shortPreviewShareableUrl = ''

      try {
        const [shortedUrl, shortedShareableUrl] = await Promise.all([
          axios.post(`${BACKEND_URL}/api/appConfigs/shortenUrl`, {
            url: badgePreviewUrl,
          }),
          axios.post(`${BACKEND_URL}/api/appConfigs/shortenUrl`, {
            url: badgePreviewShareableUrl,
          }),
        ])
        if (shortedUrl.data.error || shortedShareableUrl.data.error) {
          throw new Error(shortedUrl.data.message)
        }
        shortPreviewUrl = `${SHORT_APP_URL}/${shortedUrl.data.result}`
        shortPreviewShareableUrl = `${SHORT_APP_URL}/${shortedShareableUrl.data.result}`
      } catch (error) {
        console.warn('There was an error generating the short version of the url...')
        shortPreviewUrl = badgePreviewUrl
      }
      setShortPreviewUrl(shortPreviewUrl)
      setShortPreviewShareableUrl(shortPreviewShareableUrl)
    }
    getShortPreviewURL()
  }, [badgePreviewShareableUrl, badgePreviewUrl])

  return {
    badgePreviewUrl,
    badgeOpenseaUrl,
    shortPreviewURl,
    badgePreviewShareableUrl,
    shortPreviewShareableUrl,
  }
}
