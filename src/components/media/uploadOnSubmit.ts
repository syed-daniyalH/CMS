import type { GlobalImageUploaderRef, UploadedMediaItem } from './GlobalImageUploader'

export const getUploadedFileUrl = (items: UploadedMediaItem[] = [], fallback = '') => {
  if (!Array.isArray(items) || !items.length) return fallback
  const first = items[0]
  return `${first?.secureUrl || first?.url || fallback}`.trim()
}

export const uploadPendingFromRef = async (ref: GlobalImageUploaderRef | null, fallback = '') => {
  if (!ref) return fallback
  const items = (await ref.uploadPending()) || []
  return getUploadedFileUrl(items, fallback)
}
