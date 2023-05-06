import { KLEROS_LIST_TYPES, MetadataColumn } from '@/types/kleros/types'

export function getEvidenceValue(
  evidenceValues: Record<string, any>,
  evidenceColumns: MetadataColumn[],
  columnName: string,
  columnType: KLEROS_LIST_TYPES,
) {
  const isPresent = !!evidenceValues[columnName]
  if (isPresent) return evidenceValues[columnName]

  const isPresentAsType = !!evidenceValues[columnType]
  if (isPresentAsType) return evidenceValues[columnType]

  const evidencesWithSameType = evidenceColumns.filter((c) => c.type === columnType)
  const index = evidencesWithSameType.findIndex((c) => c.label === columnName)

  const isPresentAsRepeatedType = !!evidenceValues[`${columnType}-${index}`]
  if (isPresentAsRepeatedType) return evidenceValues[`${columnType}-${index}`]

  return 'Undefined value.'
}
