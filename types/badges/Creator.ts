import { BackendFileResponse } from '@/types/utils'

export type Creator = {
  name: string
  description: string
  email: string
  terms: boolean
  discord?: string
  twitter?: string
  logo?: BackendFileResponse
}
