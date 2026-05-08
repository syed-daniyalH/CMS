import { ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Box, Button, Chip, Grid, Typography } from '@mui/material'
import toast from 'react-hot-toast'
import Icon from 'src/core/components/icon'
import axiosInstance from 'src/core/utils/axiosInstence'

export type UploadedMediaItem = {
  url: string
  secureUrl?: string
  publicId?: string
  originalFilename?: string
  bytes?: number
  format?: string
}

interface GlobalImageUploaderProps {
  label?: string
  folder?: string
  type?: string
  entityId?: string
  multiple?: boolean
  uploadOnSubmit?: boolean
  altText?: string
  disabled?: boolean
  value?: string
  values?: string[]
  onUploaded?: (items: UploadedMediaItem[]) => void
  onClear?: () => void
}

export type GlobalImageUploaderRef = {
  uploadPending: () => Promise<UploadedMediaItem[]>
}

const publicBaseRaw = `${process.env.NEXT_PUBLIC_IMAGE_URL_R2 || ''}`.trim()

const getPublicOrigin = () => {
  if (!publicBaseRaw) return ''
  try {
    const parsed = new URL(publicBaseRaw)
    return parsed.origin
  } catch (_error) {
    return publicBaseRaw.replace(/\/+$/g, '')
  }
}

const getPublicUrl = (item: any) => {
  const directUrl = `${item?.secureUrl || item?.url || ''}`.trim()
  if (directUrl) {
    if (directUrl.startsWith('http://') || directUrl.startsWith('https://')) return directUrl
    const origin = getPublicOrigin()
    if (origin) return `${origin}/${directUrl.replace(/^\/+/, '')}`
    return directUrl.replace(/^\/+/, '')
  }
  const key = `${item?.publicId || ''}`.trim()
  const origin = getPublicOrigin()
  if (origin && key) return `${origin}/${key.replace(/^\/+/, '')}`
  if (key) return key.replace(/^\/+/, '')
  return ''
}

const toMediaItem = (item: any): UploadedMediaItem => ({
  url: getPublicUrl(item),
  secureUrl: getPublicUrl(item),
  publicId: item?.publicId || '',
  originalFilename: item?.originalFilename || '',
  bytes: item?.bytes || 0,
  format: item?.format || ''
})

const GlobalImageUploader = ({
  label = 'Upload Image',
  folder = 'images',
  type = 'file',
  entityId = '',
  multiple = false,
  uploadOnSubmit = false,
  altText = '',
  disabled = false,
  value = '',
  values = [],
  onUploaded,
  onClear
}: GlobalImageUploaderProps, ref: ForwardedRef<GlobalImageUploaderRef>) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<UploadedMediaItem[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([])

  const previews = useMemo(() => {
    const fromProps = multiple ? values : value ? [value] : []
    const fromUploaded = uploaded.map(item => item.url).filter(Boolean)
    return [...pendingPreviews, ...fromUploaded, ...fromProps].filter(Boolean)
  }, [multiple, pendingPreviews, uploaded, value, values])

  const mapResponseItems = (payload: any): UploadedMediaItem[] => {
    const rawItems = Array.isArray(payload) ? payload : payload ? [payload] : []
    return rawItems.map(toMediaItem).filter(item => !!item.url)
  }

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return [] as UploadedMediaItem[]
    setUploading(true)
    try {
      const formData = new FormData()
      const uploadNonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      files.forEach(file => formData.append('objfile', file))
      formData.append('altText', altText || '')
      formData.append('folder', folder)
      formData.append('type', type || 'file')
      const entityBase = entityId?.trim()
      formData.append('entityId', entityBase ? `${entityBase}-${uploadNonce}` : uploadNonce)

      let uploadedItems: UploadedMediaItem[] = []
      try {
        const res = await axiosInstance.post('/api/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        uploadedItems = mapResponseItems(res?.data?.data)
      } catch (batchError: any) {
        if (files.length !== 1) throw batchError
        const singleFormData = new FormData()
        const singleNonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        singleFormData.append('file', files[0])
        singleFormData.append('altText', altText || files[0]?.name || '')
        singleFormData.append('folder', folder)
        singleFormData.append('type', type || 'file')
        singleFormData.append('entityId', entityBase ? `${entityBase}-${singleNonce}` : singleNonce)
        const singleRes = await axiosInstance.post('/api/media/upload', singleFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        uploadedItems = mapResponseItems(singleRes?.data?.data)
      }

      if (!uploadedItems.length && files.length === 1) {
        const fallbackPerFile = await Promise.all(
          files.map(async file => {
            const singleFormData = new FormData()
            const singleNonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
            singleFormData.append('file', file)
            singleFormData.append('altText', altText || file?.name || '')
            singleFormData.append('folder', folder)
            singleFormData.append('type', type || 'file')
            singleFormData.append('entityId', entityBase ? `${entityBase}-${singleNonce}` : singleNonce)
            const singleRes = await axiosInstance.post('/api/media/upload', singleFormData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            return mapResponseItems(singleRes?.data?.data)?.[0]
          })
        )
        uploadedItems = fallbackPerFile.filter(Boolean) as UploadedMediaItem[]
      }

      if (!uploadedItems.length && files.length > 1) {
        const fallbackPerFile = await Promise.all(
          files.map(async file => {
            const singleFormData = new FormData()
            const singleNonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
            singleFormData.append('file', file)
            singleFormData.append('altText', altText || file?.name || '')
            singleFormData.append('folder', folder)
            singleFormData.append('type', type || 'file')
            singleFormData.append('entityId', entityBase ? `${entityBase}-${singleNonce}` : singleNonce)
            const singleRes = await axiosInstance.post('/api/media/upload', singleFormData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            return mapResponseItems(singleRes?.data?.data)?.[0]
          })
        )
        uploadedItems = fallbackPerFile.filter(Boolean) as UploadedMediaItem[]
      }
      if (!uploadedItems.length) return [] as UploadedMediaItem[]

      const finalItems = multiple ? uploadedItems : [uploadedItems[uploadedItems.length - 1]]
      setUploaded(prev => (multiple ? [...finalItems, ...prev] : finalItems))
      setPendingFiles([])
      setPendingPreviews([])
      onUploaded?.(finalItems)
      toast.success(`${finalItems.length} image${finalItems.length > 1 ? 's' : ''} uploaded.`)
      return finalItems
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Image upload failed.')
      return [] as UploadedMediaItem[]
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    const files = fileList ? Array.from(fileList) : []
    if (!files.length) return
    if (uploadOnSubmit) {
      const selected = multiple ? files : [files[files.length - 1]]
      setPendingFiles(selected)
      setPendingPreviews(selected.map(file => URL.createObjectURL(file)))
    } else {
      await uploadFiles(files)
    }
    if (event.target) event.target.value = ''
  }

  useImperativeHandle(ref, () => ({
    uploadPending: async () => {
      if (!pendingFiles.length) return []
      return await uploadFiles(pendingFiles)
    }
  }))

  return (
    <Box
      sx={{
        p: 2.5,
        border: theme => `1px dashed ${theme.palette.divider}`,
        borderRadius: 1.5,
        backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.02)`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => theme.palette.primary.light
            }}
          >
            <Icon icon='tabler:photo-plus' />
          </Box>
          <Typography variant='subtitle2'>{label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!!previews.length && !multiple && (
            <Button
              variant='outlined'
              color='error'
              size='small'
              disabled={disabled || uploading}
              startIcon={<Icon icon='tabler:trash' />}
              onClick={() => {
                setUploaded([])
                setPendingFiles([])
                setPendingPreviews([])
                onClear?.()
              }}
            >
              Remove
            </Button>
          )}
          <Button
            variant='outlined'
            size='small'
            disabled={disabled || uploading}
            startIcon={<Icon icon='tabler:upload' />}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Uploading...' : multiple ? 'Select Images' : previews.length ? 'Replace Image' : 'Select Image'}
          </Button>
          <input ref={fileInputRef} type='file' accept='image/*' multiple={multiple} hidden onChange={handleFileChange} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: previews.length ? 1.5 : 0 }}>
        {uploadOnSubmit && !!pendingFiles.length && (
          <Chip
            size='small'
            color='warning'
            variant='outlined'
            label={`${pendingFiles.length} selected `}
            icon={<Icon icon='tabler:clock-hour-4' />}
          />
        )}
        {!!uploaded.length && (
          <Chip
            size='small'
            color='success'
            variant='outlined'
            label={`${uploaded.length} uploaded`}
            icon={<Icon icon='tabler:circle-check' />}
          />
        )}
      </Box>

      {!!previews.length && (
        <Grid container spacing={2}>
          {previews.slice(0, multiple ? previews.length : 1).map((src, index) => (
            <Grid item xs={12} sm={multiple ? 4 : 12} key={`${src}-${index}`}>
              <Box
                component='img'
                src={src}
                alt={`uploaded-${index}`}
                sx={{
                  width: '100%',
                  maxHeight: 140,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: theme => `1px solid ${theme.palette.divider}`
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default forwardRef(GlobalImageUploader)
