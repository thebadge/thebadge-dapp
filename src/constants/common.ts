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
export const LINKEDIN_URL = 'https://www.linkedin.com'
export const THE_BADGE_LINKEDIN_ID = process.env.NEXT_PUBLIC_THE_BADGE_LINKEDIN_ID || '86794678'
export const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || 'https://docs.thebadge.xyz'
export const DOCUMENTATION_URL = DOCS_URL + '/thebadge-documentation'

export const APP_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

export const KLEROS_COURT_URL = process.env.KLEROS_COURT_URL || 'https://court.kleros.io'

export const IS_DEVELOP = process.env.NEXT_PUBLIC_DEV_MODE || false

export const WEB3_MODAL_PROJECT_ID = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID || ''
export const WEB3_AUTH_CLIENT_ID_TESTNET = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID_TESTNET || ''
export const WEB3_AUTH_CLIENT_ID_PRODUCTION =
  process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID_PRODUCTION || ''

/**** Model Creation ****/

export const CRITERIA_TEMPLATE_URL =
  process.env.CRITERIA_TEMPLATE_URL ||
  'https://drive.google.com/uc?export=download&id=19ZngN2Ia-LKi5DRBnWzwffooVZ8un-39'

export const MODEL_CREATION_CACHE_EXPIRATION_MS = process.env.MODEL_CREATION_CACHE_EXPIRATION_MS

/**** Kleros *****/

export const DEFAULT_COURT_ID = process.env.NEXT_PUBLIC_KLEROS_DEFAULT_COURT || '1'

// Kleros Court Case display config
export const DYNAMIC_SCRIPT_IPFS_HASH =
  process.env.NEXT_PUBLIC_DYNAMIC_SCRIPT_IPFS_HASH ||
  'QmZ8gHDHenMHZ6WWCHTF3tn2NEhiP15Q5JK7kSCq1SM8x6'

// Kleros Court evidence display config
export const EVIDENCE_DISPLAY_INTERFACE_IPFS_HASH =
  process.env.NEXT_PUBLIC_EVIDENCE_DISPLAY_INTERFACE_IPFS_HASH ||
  'QmQjJio59WkrQDzPC5kSP3EiGaqrWxjGfkvhmD2mWwm41M'

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
