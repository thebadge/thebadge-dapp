export const ENRICH_TEXT_VARIABLES = ['{address}', '{displayName}', '{expirationTime}'] as const

export type EnrichTextValues = {
  [key in typeof ENRICH_TEXT_VARIABLES[number]]: string
}

export default function enrichTextWithValues(badgeDescription: string, values: EnrichTextValues) {
  return badgeDescription
    .replace('{address}', values['{address}'] || '')
    .replace('{displayName}', values['{displayName}'] || '')
    .replace('{expirationTime}', values['{expirationTime}'] || '')
}
