import axios from 'axios'
import useSWR from 'swr'

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

  return useSWR([badgeId, badgeContractAddress, userChainId], async (params) => {
    if (!params[0]) {
      return {
        badgePreviewUrl: '',
        badgeOpenseaUrl: '',
        shortPreviewUrl: '',
        badgePreviewShareableUrl: '',
        shortPreviewShareableUrl: '',
      }
    }
    let shortPreviewUrl = ''
    let shortPreviewShareableUrl = ''

    const badgePreviewUrl =
      APP_URL +
      generateBadgePreviewUrl(badgeId, {
        theBadgeContractAddress: badgeContractAddress,
        connectedChainId: userChainId ? userChainId : readOnlyChainId,
      })

    const badgePreviewShareableUrl =
      APP_URL +
      generateBadgePreviewShareableUrl(badgeId, {
        theBadgeContractAddress: badgeContractAddress,
        connectedChainId: userChainId ? userChainId : readOnlyChainId,
      })

    const badgeOpenseaUrl = generateOpenseaUrl({
      badgeId,
      contractAddress: badgeContractAddress,
      networkId: userChainId ? userChainId : readOnlyChainId,
    })

    const storedShortUrl = getStoredShortUrl(badgePreviewUrl)
    const storedPreviewShortUrl = getStoredShortUrl(badgePreviewShareableUrl)

    if (!storedShortUrl || !storedPreviewShortUrl) {
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
        saveShortUrl(badgePreviewUrl, shortedUrl.data.result)
        saveShortUrl(badgePreviewShareableUrl, shortedShareableUrl.data.result)

        shortPreviewUrl = `${SHORT_APP_URL}/${shortedUrl.data.result}`
        shortPreviewShareableUrl = `${SHORT_APP_URL}/${shortedShareableUrl.data.result}`
      } catch (error) {
        console.warn('There was an error generating the short version of the url...')
        shortPreviewUrl = badgePreviewUrl
      }
    } else {
      shortPreviewUrl = `${SHORT_APP_URL}/${storedShortUrl}`
      shortPreviewShareableUrl = `${SHORT_APP_URL}/${storedPreviewShortUrl}`
    }

    return {
      badgePreviewUrl,
      badgeOpenseaUrl,
      shortPreviewUrl,
      badgePreviewShareableUrl,
      shortPreviewShareableUrl,
    }
  })
}

/**
 * Store shorted url to be re-used later, because every previewUrl will have the same shortUrl each time
 * @param previewUrl
 * @param shortUrl
 */
function saveShortUrl(previewUrl: string, shortUrl: string) {
  localStorage.setItem(previewUrl, shortUrl)
}

/**
 * Get stored shorted url to be re-used
 * @param previewUrl
 */
function getStoredShortUrl(previewUrl: string) {
  return localStorage.getItem(previewUrl)
}
