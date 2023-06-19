const STEP_0 = ['howItWorks']
const STEP_1 = [
  'name',
  'description',
  'badgeModelLogoUri',
  'textContrast',
  'backgroundImage',
  'template',
]
const STEP_2 = [
  'criteriaFileUri',
  'criteriaDeltaText',
  'challengePeriodDuration',
  'rigorousness',
  'mintCost',
  'validFor',
]
const STEP_3 = ['badgeMetadataColumns']
export const FIELDS_TO_VALIDATE_ON_STEP = [STEP_0, STEP_1, STEP_2, STEP_3]

export const FORM_STORE_KEY = 'badge-model-creation'
/**
 * Retrieve stored values, in case that the user refresh the page or something
 * happens
 */
export function defaultValues() {
  if (checkIfHasOngoingModelCreation()) {
    const storedValues = JSON.parse(localStorage.getItem(FORM_STORE_KEY) as string)
    return storedValues.values
  } else {
    return {
      textContrast: 'Black',
      backgroundImage: 'White Waves',
      template: 'Classic',
    }
  }
}

export function checkIfHasOngoingModelCreation() {
  const item = localStorage.getItem(FORM_STORE_KEY)
  return !!item && Date.now() < JSON.parse(item).expirationTime
}

export function saveFormValues(values: Record<string, any>) {
  const ONE_DAY = 24 * 60 * 60 * 1000 /* ms */

  localStorage.setItem(
    FORM_STORE_KEY,
    JSON.stringify({ expirationTime: Date.now() + ONE_DAY, values }),
  )
}
