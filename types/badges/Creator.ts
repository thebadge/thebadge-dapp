import { BackendFileResponse } from '@/types/utils'

export type Creator = {
  name: string
  description: string
  email: string
  terms: boolean
  discord?: string
  twitter?: string
  website?: string
  logo?: BackendFileResponse
  preferContactMethod: 'email' | 'website' | 'twitter' | 'discord'
}

export type CreatorMetadata = {
  name: string
  description: string
  email: string
  logo?: BackendFileResponse
  discord?: string
  twitter?: string
  linkedin?: string
  website?: string

  terms: boolean
  preferContactMethod: 'email' | 'website' | 'twitter' | 'discord'
}
