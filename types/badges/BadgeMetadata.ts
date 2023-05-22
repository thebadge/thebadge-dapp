import { MetadataColumn } from '@/types/kleros/types'
import { BackendFileResponse } from '@/types/utils'

export type BadgeMetadata = {
  columns: MetadataColumn[]
  image: BackendFileResponse
  values: Record<string, any>
}

export type BadgeModelMetadata = {
  name: string
  image: BackendFileResponse
  description: string
}
