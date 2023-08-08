import domtoimage from 'dom-to-image'

import { MODEL_CREATION_CACHE_EXPIRATION_MS } from '@/src/constants/common'

const STEP_0 = ['howItWorks']
const STEP_1: string[] = []
const STEP_2 = ['previewImage']

export const FIELDS_TO_VALIDATE_ON_STEP = [STEP_0, STEP_1, STEP_2]
export const MINT_STEPS_AMOUNT = 3

export const FORM_STORE_KEY = 'mint-badge'

export function saveFormValues(values: Record<string, any>) {
  const ONE_DAY = 24 * 60 * 60 * 1000 /* ms */
  const expiration = MODEL_CREATION_CACHE_EXPIRATION_MS
    ? +MODEL_CREATION_CACHE_EXPIRATION_MS
    : ONE_DAY

  localStorage.setItem(
    FORM_STORE_KEY,
    JSON.stringify({ expirationTime: Date.now() + expiration, values }),
  )
}

/**
 * Retrieve stored values, in case that the user refresh the page or something
 * happens
 */
export function defaultValues() {
  if (checkIfHasOngoingBadgeMint()) {
    const storedValues = JSON.parse(localStorage.getItem(FORM_STORE_KEY) as string)
    return storedValues.values
  } else {
    return {}
  }
}

export function checkIfHasOngoingBadgeMint() {
  const item = localStorage.getItem(FORM_STORE_KEY)
  return !!item && Date.now() < JSON.parse(item).expirationTime
}

export function cleanFormValues() {
  localStorage.removeItem(FORM_STORE_KEY)
}

export async function convertPreviewToImage(
  badgePreviewRef: React.MutableRefObject<HTMLDivElement | undefined>,
): Promise<string> {
  if (!badgePreviewRef?.current) return ''
  let previewImageDataUrl
  try {
    previewImageDataUrl = await domtoimage.toPng(badgePreviewRef.current, {
      cacheBust: true,
    })
    return previewImageDataUrl
  } catch (e) {
    console.warn('convertPreviewToImage', e)
    return ''
  }
}
