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

/**** Model Creation ****/

export const CRITERIA_TEMPLATE_URL =
  process.env.CRITERIA_TEMPLATE_URL ||
  'https://drive.google.com/uc?export=download&id=19ZngN2Ia-LKi5DRBnWzwffooVZ8un-39'

export const MODEL_CREATION_CACHE_EXPIRATION_MS = process.env.MODEL_CREATION_CACHE_EXPIRATION_MS

/**** Kleros *****/

export const DEFAULT_COURT_ID = process.env.NEXT_PUBLIC_KLEROS_DEFAULT_COURT || '1'

/**** Severity *****/
export const SEVERITY_NORMAL_JURORS = +(
  process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_NORMAL_JURORS || 1
)
export const SEVERITY_NORMAL_BOUNTY_MULTIPLIER = +(
  process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_NORMAL_BOUNTY || 1
)

export const SEVERITY_ABOVE_JURORS = +(
  process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_ABOVE_JURORS || 3
)
export const SEVERITY_ABOVE_BOUNTY_MULTIPLIER = +(
  process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_ABOVE_BOUNTY || 1
)

export const SEVERITY_HEAVY_JURORS = +(
  process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_HEAVY_JURORS || 3
)
export const SEVERITY_HEAVY_BOUNTY_MULTIPLIER = +(
  process.env.NEXT_PUBLIC_BADGE_MODEL_SEVERITY_HEAVY_BOUNTY || 2
)
