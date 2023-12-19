import { notify } from '@/src/components/toast/Toast'
import { ToastStates } from '@/types/toast'

export const handleShare = (url?: string) => {
  navigator.clipboard.writeText(url || window.location.href)
  notify({ message: 'URL Copied to clipboard', type: ToastStates.info })
}
