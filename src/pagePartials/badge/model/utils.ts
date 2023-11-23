import { APP_URL, MODEL_CREATION_CACHE_EXPIRATION_MS } from '@/src/constants/common'
import { BadgeModelControllerType, BadgeModelTemplate } from '@/types/badges/BadgeModel'

const STEP_0_COMMUNITY = ['howItWorks']
const STEP_1_COMMUNITY = [
  'name',
  'description',
  'badgeModelLogoUri',
  'textContrast',
  'backgroundImage',
  'template',
]
const STEP_2_COMMUNITY = ['rigorousness', 'mintFee', 'validFor']
const STEP_3_COMMUNITY = ['criteriaFileUri', 'criteria', 'badgeMetadataColumns']

const STEP_0_TP = [
  'name',
  'description',
  'badgeModelLogoUri',
  'textContrast',
  'backgroundImage',
  'template',
]

const STEP_0_TP_DIPLOMA = [
  'name',
  'description',
  'footerEnabled',
  'courseName',
  'achievementDescription',
  'achievementDate',
  'signatureEnabled',
  'template',
]

const STEP_1_TP = ['mintFee', 'validFor', 'administrators']

const communityValidationSteps = [
  STEP_0_COMMUNITY,
  STEP_1_COMMUNITY,
  STEP_2_COMMUNITY,
  STEP_3_COMMUNITY,
]
const thirdPartyValidationSteps = [STEP_0_TP, STEP_1_TP]
const thirdPartyDiplomaValidationSteps = [STEP_0_TP_DIPLOMA, STEP_1_TP]

export function getFieldsToValidateOnStep(
  controllerType: BadgeModelControllerType,
  template?: BadgeModelTemplate,
): string[][] {
  switch (controllerType.toLowerCase()) {
    case BadgeModelControllerType.Community.toLowerCase(): {
      return communityValidationSteps
    }
    case BadgeModelControllerType.ThirdParty.toLowerCase(): {
      switch (template) {
        case BadgeModelTemplate.Diploma: {
          return thirdPartyDiplomaValidationSteps
        }
        case BadgeModelTemplate.Classic:
        default: {
          return thirdPartyValidationSteps
        }
      }
    }
    default: {
      return communityValidationSteps
    }
  }
}

export const FORM_STORE_KEY = 'badge-model-creation'

export function getCreateModelStepsAmount(controllerType: BadgeModelControllerType): number {
  switch (controllerType.toLowerCase()) {
    case BadgeModelControllerType.Community.toLowerCase(): {
      return 5
    }
    case BadgeModelControllerType.ThirdParty.toLowerCase(): {
      return 3
    }
    default: {
      return 5
    }
  }
}

/**
 * Retrieve stored values, in case that the user refresh the page or something
 * happens
 */
export function defaultValues(controllerType?: BadgeModelControllerType) {
  switch (controllerType?.toLowerCase()) {
    case BadgeModelControllerType.ThirdParty.toLowerCase(): {
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
    case BadgeModelControllerType.Community.toLowerCase():
    default: {
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
  }
}

export function checkIfHasOngoingModelCreation() {
  const item = localStorage.getItem(FORM_STORE_KEY)
  return !!item && Date.now() < JSON.parse(item).expirationTime
}

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

export function cleanCreateModelFormValues() {
  localStorage.removeItem(FORM_STORE_KEY)
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
