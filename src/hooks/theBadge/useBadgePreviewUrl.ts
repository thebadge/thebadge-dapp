import { useEffect, useMemo, useState } from 'react'

import axios from 'axios'

import { APP_URL, BACKEND_URL, SHORT_APP_URL } from '@/src/constants/common'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { generateBadgePreviewUrl, generateOpenseaUrl } from '@/src/utils/navigation/generateUrl'
import { ChainsValues } from '@/types/chains'

export default function useBadgePreviewUrl(
  badgeId: string,
  badgeContractAddress: string,
  userChainId?: ChainsValues,
) {
  const { readOnlyChainId } = useWeb3Connection()
  const [shortPreviewURl, setShortPreviewUrl] = useState<string>('')

  const badgePreviewUrl = useMemo(
    () =>
      APP_URL +
      generateBadgePreviewUrl(badgeId, {
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
      let shortPreviewUrl = badgePreviewUrl
      try {
        const shortedUrl = await axios.post(`${BACKEND_URL}/api/appConfigs/shortenUrl`, {
          url: badgePreviewUrl,
        })
        if (shortedUrl.data.error) {
          throw new Error(shortedUrl.data.message)
        }
        shortPreviewUrl = `${SHORT_APP_URL}/${shortedUrl.data.result}`
      } catch (error) {
        console.warn('There was an error generating the short version of the url...')
        shortPreviewUrl = badgePreviewUrl
      }
      setShortPreviewUrl(shortPreviewUrl)
    }
    getShortPreviewURL()
  }, [badgePreviewUrl])

  return { badgePreviewUrl, badgeOpenseaUrl, shortPreviewURl }
}
