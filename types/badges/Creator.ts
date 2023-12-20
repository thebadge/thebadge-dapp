import { BackendFileResponse } from '@/types/utils'

export type Creator = {
  name: string
  description: string
  email: string
  terms: boolean
  discord?: string | null
  twitter?: string | null
  linkedin?: string | null
  website?: string | null
  logo?: BackendFileResponse
  preferContactMethod:
    | 'email'
    | 'website'
    | 'twitter'
    | 'discord'
    | 'linkedin'
    | 'github'
    | 'telegram'
}

export type CreatorMetadata = {
  name: string
  description: string
  email: string
  terms: boolean
  discord?: string | null
  twitter?: string | null
  linkedin?: string | null
  website?: string | null
  logo?: BackendFileResponse

  preferContactMethod:
    | 'email'
    | 'website'
    | 'twitter'
    | 'discord'
    | 'linkedin'
    | 'github'
    | 'telegram'
}
