/**
 * Dividing the periodDuration (in seconds) by 60 (to convert seconds to minutes),
 * then by 60 again (to convert minutes to hours), and finally by 24
 * (to convert hours to days).
 * @param periodDuration
 */
export function secondsToDays(periodDuration: number) {
  return periodDuration ? periodDuration / 60 / 60 / 24 : 0
}
