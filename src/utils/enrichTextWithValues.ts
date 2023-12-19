export enum TemplateVariables {
  address = '{{address}}',
  displayName = '{{displayName}}',
  expirationDate = '{{expirationDate}}',
  studentName = '{{studentName}}',
  issueDate = '{{issueDate}}',
}

export enum ReplacementKeys {
  address = 'address',
  displayName = 'displayName',
  expirationDate = 'expirationDate',
  studentName = 'studentName',
  issueDate = 'issueDate',
}

/**
 * Variables that are automatically completed using the badge information
 */
export type AutocompletedTemplateVariable = '{{address}}' | '{{expirationDate}}' | '{{issueDate}}'
/**
 * Variables that need to be required to the user at mint time
 */
export type UserRequestedTemplateVariables = '{{displayName}}' | '{{studentName}}'

export type TemplateVariable = AutocompletedTemplateVariable | UserRequestedTemplateVariables

export const SUPPORTED_VARIABLES: TemplateVariable[] = [
  TemplateVariables.address,
  TemplateVariables.expirationDate,
  TemplateVariables.issueDate,
  TemplateVariables.studentName,
  TemplateVariables.displayName,
]

export const ENRICH_TEXT_VARIABLES = [
  ReplacementKeys.address,
  ReplacementKeys.expirationDate,
  ReplacementKeys.issueDate,
  ReplacementKeys.studentName,
  ReplacementKeys.displayName,
] as const

export type EnrichTextVariables = (typeof ENRICH_TEXT_VARIABLES)[number]

export type EnrichTextValues = {
  [key in EnrichTextVariables]: string
}

export default function enrichTextWithValues(
  textToEnrich: string | undefined,
  values: EnrichTextValues | undefined,
) {
  if (!textToEnrich) return ''
  if (!values) return textToEnrich
  const enrichTextKeys = Object.keys(values) as EnrichTextVariables[]

  enrichTextKeys.forEach((key) => {
    // If the key is on the given values, we replace it, if not we let the text as it was
    if (values[key]) {
      textToEnrich = textToEnrich?.replace(`{{${key}}}`, values[key])
    }
  })
  return textToEnrich
}
