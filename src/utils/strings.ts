export const truncateStringInTheMiddle = (
  str: string,
  strPositionStart: number,
  strPositionEnd: number,
) => {
  const minTruncatedLength = strPositionStart + strPositionEnd
  if (minTruncatedLength < str.length) {
    return `${str.substr(0, strPositionStart)}...${str.substr(
      str.length - strPositionEnd,
      str.length,
    )}`
  }
  return str
}

export const hexToNumber = (hex?: string) => (hex ? parseInt(hex || '0', 16) : null)

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const shortenLinkedinString = (inputString: string, maxLength: number): string => {
  if (!inputString || inputString.length <= maxLength) {
    return inputString
  } else {
    const prefixToRemove = 'https://www.linkedin.com/'
    const replacedUrl = inputString
      .replace(new RegExp('^' + prefixToRemove), '')
      .slice(0, maxLength)
    return replacedUrl.slice(0, maxLength)
  }
}
