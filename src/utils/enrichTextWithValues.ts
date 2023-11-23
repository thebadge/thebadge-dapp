export const ENRICH_TEXT_VARIABLES = [
  'address',
  'displayName',
  'expirationTime',
  'studentName',
] as const

export type EnrichTextVariables = (typeof ENRICH_TEXT_VARIABLES)[number]

export type EnrichTextValues = {
  [key in EnrichTextVariables]: string
}

export default function enrichTextWithValues(badgeDescription: string, values: EnrichTextValues) {
  const enrichTextKeys = Object.keys(values) as EnrichTextVariables[]
  enrichTextKeys.forEach((key) => badgeDescription.replace(`{{${key}}`, values[key] || ''))
  return badgeDescription
}
