/**
 * Helper function to have the Date.Now() in Seconds to be used as filter on the SG queries.
 */
export function nowInSeconds() {
  return Math.floor(Date.now() / 1000)
}

export const ADDRESS_PREFIX = '0x'
