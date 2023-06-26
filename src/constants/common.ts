export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'letsHopeWeCanAvoidNameClashingThen'
export const appTier = process.env.NEXT_PUBLIC_APP_TIER || 'staging'

export const cookiesWarningEnabled =
  process.env.NEXT_PUBLIC_COOKIES_WARNING_ENABLED === 'true' || ''
export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

export const PAPER_URL =
  process.env.NEXT_PAPER_URL || 'https://thebadge.xyz/The_Badge_WhitePaper.pdf'
export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/thebadgexyz'
export const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/FTxtkgbAC4'
export const MEDIUM_URL = process.env.NEXT_PUBLIC_MEDIUM_URL || 'https://medium.com/@TheBadge'
export const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/thebadge'
export const EMAIL_URL = process.env.NEXT_PUBLIC_EMAIL_URL || 'mailto:hello@thebadge.xyz'
export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.thebadge.xyz'

export const APP_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

export const IS_DEVELOP = process.env.NEXT_PUBLIC_DEV_MODE || false

export const WEB3_AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || ''
