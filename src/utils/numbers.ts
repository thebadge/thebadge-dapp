export function percentage(partialValue: number, totalValue: number) {
  if (!totalValue || !partialValue) return 0
  return ((100 * partialValue) / totalValue).toFixed(2)
}
