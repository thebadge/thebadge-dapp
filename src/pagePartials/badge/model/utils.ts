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
  const storedValues = localStorage.getItem(FORM_STORE_KEY)
  if (storedValues) {
    return JSON.parse(storedValues)
  } else {
    return {
      textContrast: 'Black',
      backgroundImage: 'White Waves',
      template: 'Classic',
    }
  }
}

export function saveFormValues(values: Record<string, any>) {
  localStorage.setItem(FORM_STORE_KEY, JSON.stringify(values))
}
