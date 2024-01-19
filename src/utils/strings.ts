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

export const extractTwitterUsername = (url?: string): string | null => {
  if (!url) {
    return null
  }

  // Match patterns for Twitter URLs
  const twitterPattern = /^(?:https?:\/\/)?(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/i
  const xDotComPattern = /^(?:https?:\/\/)?(?:www\.)?x\.com\/([a-zA-Z0-9_]+)/i

  // Test the URL against both patterns
  const twitterMatch = url.match(twitterPattern)
  const xDotComMatch = url.match(xDotComPattern)

  // Extract the username from the matched pattern
  return twitterMatch ? `@${twitterMatch[1]}` : xDotComMatch ? `@${xDotComMatch[1]}` : url
}

export const getTwitterUrl = (username?: string): string => {
  if (!username) {
    return `https://twitter.com/${username}`
  }

  if (username.startsWith('https://twitter.com/') || username.startsWith('https://x.com/')) {
    return username
  }

  // Remove '@' symbol if present
  const cleanedUsername = username.startsWith('@') ? username.substring(1) : username

  // Construct the Twitter URL
  return `https://twitter.com/${cleanedUsername}`
}

export const extractGitHubUsername = (url?: string): string | null => {
  if (!url) {
    return null
  }
  // Match pattern for GitHub URLs
  const gitHubPattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)(\/|$)/i

  // Test the URL against the pattern
  const gitHubMatch = url.match(gitHubPattern)

  // Extract the username from the matched pattern
  return gitHubMatch ? gitHubMatch[1] : url
}

export const generateGitHubUrl = (username: string): string => {
  if (username.startsWith('https://github.com/')) {
    return username
  }

  // Remove leading 'https://github.com/' if present
  const cleanedUsername = username.startsWith('https://github.com/')
    ? username.substring(19)
    : username

  // Construct the GitHub URL
  return `https://github.com/${cleanedUsername}`
}
