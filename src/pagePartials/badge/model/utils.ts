import { APP_URL } from '@/src/constants/common'

const STEP_0 = ['howItWorks']
const STEP_1 = [
  'name',
  'description',
  'badgeModelLogoUri',
  'textContrast',
  'backgroundImage',
  'template',
]
const STEP_2 = ['criteriaFileUri', 'criteria', 'rigorousness', 'mintCost', 'validFor']
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
      challengePeriodDuration: 2,
      rigorousness: {
        amountOfJurors: 1,
        challengeBounty: '0',
      },
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

/**
 *  Default Acceptance Criteria based on the Google File -> https://docs.google.com/document/d/1NVZ8f9EKoA0jNG4xIbKAAzSXL_luq1qBybnUswDj7zI/edit?usp=sharing
 *  The image used on the header is linked directly to the Google doc, please update it if you edit the doc
 */
export function getCriteriaTemplate() {
  return `
<p>
  <span style="background-color: transparent; color: rgb(0, 0, 0)">
    <img src="${APP_URL}/shareable/acceptance-header.png"/>
  </span>
</p>
<p><br /></p>
<h2>
  VERIFICATION GUIDELINES FOR PROOF OF .....
</h2>
<p><br /></p>
<p>
  <strong style="background-color: transparent"
    >The evidence uploaded by the applicant should prove the following:</strong
  >
</p>
<ul>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Fill in what is intended to verify)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Fill in what is intended to verify)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Fill in what is intended to verify)</em
    >
  </li>
</ul>
<p><br /></p>
<p>
  <strong style="background-color: transparent"
    >Information requested to upload:</strong
  >
</p>
<ol>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Fill in what the user needs to upload)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Fill in what the user needs to upload)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Fill in what the user needs to upload)</em
    >
  </li>
</ol>
<p><br /></p>
<p>
  <strong style="background-color: transparent">Verification procedure:</strong>
</p>
<ol>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Provide a step-by-step guide on how the curator needs to verify the
      veracity of the information required)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Provide a step-by-step guide on how the curator needs to verify the
      veracity of the information required)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Provide a step-by-step guide on how the curator needs to verify the
      veracity of the information required)</em
    >
  </li>
</ol>
<p><br /></p>
<p>
  <strong style="background-color: transparent"
    >Rejection criteria (challenge if):</strong
  >
</p>
<ul>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Provide guidelines on when curator must challenge)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Provide guidelines on when curator must challenge)</em
    >
  </li>
  <li>
    <em style="background-color: transparent; color: rgb(153, 153, 153)"
      >(Provide guidelines on when curator must challenge)</em
    >
  </li>
</ul>
  `
}
