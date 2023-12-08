export const ENRICH_TEXT_VARIABLES = [
  'address',
  'displayName',
  'expirationTime',
  'studentName',
] as const

export type EnrichTextVariables = (typeof ENRICH_TEXT_VARIABLES)[number]

export type TemplateVariable =
  | '{{address}}'
  | '{{displayName}}'
  | '{{expirationTime}}'
  | '{{studentName}}'

export const SUPPORTED_VARIABLES: TemplateVariable[] = [
  '{{address}}',
  '{{displayName}}',
  '{{expirationTime}}',
  '{{studentName}}',
]

export type EnrichTextValues = {
  [key in EnrichTextVariables]: string
}

export default function enrichTextWithValues(
  textToEnrich: string | undefined,
  values: EnrichTextValues | undefined,
) {
  if (!textToEnrich || !values) return ''
  const enrichTextKeys = Object.keys(values) as EnrichTextVariables[]

  enrichTextKeys.forEach((key) => {
    // If the key is on the given values, we replace it, if not we let the text as it was
    if (values[key]) {
      textToEnrich = textToEnrich?.replace(`{{${key}}}`, values[key])
    }
  })
  return textToEnrich
}
