import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ContentState, EditorState, RawDraftContentState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import toast from 'react-hot-toast'
import Icon from 'src/core/components/icon'
import axiosInstance from 'src/core/utils/axiosInstence'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomBackdrop from 'src/core/components/loading'
import TypoLabel from 'src/components/inputs/TypoLabel'
import FormSaveButton from 'src/components/form-save-button'
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/components/media/GlobalImageUploader'
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'
import ReactDraftWysiwyg from 'src/core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/core/styles/libs/react-draft-wysiwyg'
import { saveCloseKey, saveNewKey } from 'src/core/utils/translation-file'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getData } from 'src/store/case-study'
import {
  getCaseStudyCategoriesDropdown,
  getCaseStudySubCategoriesDropdown,
  getCaseStudyTagsDropdown,
  getIndustryLinksDropdown,
  getServiceLinksDropdown
} from 'src/store/dropdowns/cms'
import CaseStudyCategorySelector from 'src/core/dropdown-selectors/CaseStudyCategorySelector'
import CaseStudySubCategorySelector from 'src/core/dropdown-selectors/CaseStudySubCategorySelector'
import IndustrySlugSelector from 'src/core/dropdown-selectors/IndustrySlugSelector'
import ServiceSlugSelector from 'src/core/dropdown-selectors/ServiceSlugSelector'
import SubServiceSlugSelector from 'src/core/dropdown-selectors/SubServiceSlugSelector'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type CaseStudyState = {
  _id?: string
  title: string
  slug: string
  shortDescription: string
  layout: 'image-top' | 'image-right' | 'image-bottom' | 'image-left'
  publishStatus: 'draft' | 'published' | 'scheduled'
  scheduledAt: string
  categoryId: string
  subCategoryId: string
  serviceSlug: string
  subServiceSlug: string
  industrySlug: string
  tagIds: string[]
  authorId: string
  seoTitle: string
  seoDescription: string
  seoCanonicalUrl: string
  seoOgImage: string
  seoRobots: string
  seoTwitterCard: string
  seoKeywordsText: string
}

const defaultState: CaseStudyState = {
  title: '',
  slug: '',
  shortDescription: '',
  layout: 'image-top',
  publishStatus: 'draft',
  scheduledAt: '',
  categoryId: '',
  subCategoryId: '',
  serviceSlug: '',
  subServiceSlug: '',
  industrySlug: '',
  tagIds: [],
  authorId: '',
  seoTitle: '',
  seoDescription: '',
  seoCanonicalUrl: '',
  seoOgImage: '',
  seoRobots: 'index,follow',
  seoTwitterCard: 'summary_large_image',
  seoKeywordsText: ''
}

const toDateTimeLocal = (value: string | Date | undefined) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const hh = `${d.getHours()}`.padStart(2, '0')
  const mm = `${d.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${day}T${hh}:${mm}`
}

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const publicR2Raw = `${process.env.NEXT_PUBLIC_IMAGE_URL_R2 || ''}`.trim()
const getPublicOrigin = () => {
  if (!publicR2Raw) return ''
  try {
    return new URL(publicR2Raw).origin
  } catch (_error) {
    return publicR2Raw.replace(/\/+$/g, '')
  }
}

const normalizeImageUrl = (value: string) => {
  const raw = `${value || ''}`.trim()
  if (!raw) return ''
  const embeddedDataIndex = raw.toLowerCase().indexOf('data:image/')
  if (embeddedDataIndex >= 0) return raw.slice(embeddedDataIndex)
  if (raw.startsWith('data:image/')) return raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const origin = getPublicOrigin()
  if (!origin) return raw
  return `${origin}/${raw.replace(/^\/+/, '')}`
}

const normalizeHtmlAssetUrls = (html: string) =>
  `${html || ''}`.replace(/(src|href)="([^"]+)"/g, (_m, attr, rawUrl) => {
    const trimmed = `${rawUrl || ''}`.trim().replace(/\\+$/g, '')
    const isAbsolute =
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('mailto:') ||
      trimmed.startsWith('tel:') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('/')
    const nextUrl = isAbsolute ? trimmed : normalizeImageUrl(trimmed)
    return `${attr}="${nextUrl}"`
  })

const sanitizeEditorHtml = (html: string) =>
  `${html || ''}`
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<title[\s\S]*?<\/title>/gi, '')
    .replace(/\\\r?\n/g, '')
    .replace(/\r?\n/g, '\n')
    .replace(/src="([^"]*?)\\+"/g, 'src="$1"')
    .replace(/href="([^"]*?)\\+"/g, 'href="$1"')
    .replace(/src="https?:\/\/[^"]*?(data:image\/[^"]+)"/gi, 'src="$1"')

const normalizeDefaultInlineTextColor = (html: string) =>
  `${html || ''}`
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000000\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000\s*;?/gi, 'color: rgb(255,255,255);')

// Keep legacy white text readable inside editor while preserving save-time normalization rules.
const normalizeEditorPreviewTextColor = (html: string) =>
  `${html || ''}`
    .replace(/color:\s*rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)\s*;?/gi, 'color: rgb(0,0,0);')
    .replace(/color:\s*#ffffff\s*;?/gi, 'color: rgb(0,0,0);')
    .replace(/color:\s*#fff\s*;?/gi, 'color: rgb(0,0,0);')

const htmlToText = (html: string) => {
  if (typeof window !== 'undefined') {
    const el = window.document.createElement('div')
    el.innerHTML = html
    return `${el.textContent || ''}`.trim()
  }
  return `${html || ''}`.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const normalizeDraftColor = (raw: string) => {
  const value = `${raw || ''}`.trim()
  if (!value) return ''
  if (value.startsWith('#')) return value
  if (/^rgb/i.test(value)) return value.toLowerCase()
  if (/^\d+\s*,\s*\d+\s*,\s*\d+/.test(value)) return `rgb(${value})`
  return value
}

const extractStyleColor = (styleKey: string, prefixes: string[]) => {
  const normalized = `${styleKey || ''}`
  const upper = normalized.toUpperCase()
  const prefix = prefixes.find(item => upper.startsWith(item.toUpperCase()))
  if (!prefix) return ''
  const raw = normalized.slice(prefix.length)
  return normalizeDraftColor(raw.replace(/^[-:]/, '').trim())
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(`${reader.result || ''}`)
    reader.onerror = () => reject(new Error('Failed to convert image to base64'))
    reader.readAsDataURL(file)
  })

const toEditorHtml = (raw: RawDraftContentState) => {
  return (draftToHtml as any)(
    raw,
    undefined,
    undefined,
    (entity: { type?: string; data?: any; mutability?: string }) => {
      if (entity?.type !== 'IMAGE') return undefined
      const src = `${entity?.data?.src || ''}`.trim()
      if (!src) return undefined
      const alt = `${entity?.data?.alt || ''}`.trim()
      const altAttr = alt ? ` alt="${alt.replace(/"/g, '&quot;')}"` : ''
      return `<img src="${src}"${altAttr} />`
    }
  )
}

const CaseStudyForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const caseStudyId = searchParams.get('id') || ''
  const caseStudySlug = searchParams.get('slug') || ''
  const isEdit = !!caseStudyId

  const [state, setState] = useState<CaseStudyState>(defaultState)
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false)
  const [didSelectSubCategory, setDidSelectSubCategory] = useState<boolean>(false)
  const featuredUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const tags = useSelector((store: RootState) => store.cmsDropdowns?.caseStudyTags ?? [])
  const customStyleMap = useMemo(() => {
    const raw = convertToRaw(editorState.getCurrentContent())
    const styles = new Set<string>()
    ;(raw?.blocks || []).forEach((block: any) => {
      ;(block?.inlineStyleRanges || []).forEach((range: any) => {
        if (range?.style) styles.add(`${range.style}`)
      })
    })

    const map: Record<string, any> = {}
    styles.forEach(style => {
      const color = extractStyleColor(style, ['COLOR-', 'color-']) || extractStyleColor(style, ['COLOR', 'color'])
      if (color) map[style] = { ...(map[style] || {}), color }

      const backgroundColor =
        extractStyleColor(style, ['BGCOLOR-', 'bgcolor-', 'HIGHLIGHT-', 'highlight-', 'BACKGROUND-COLOR-', 'background-color-']) ||
        extractStyleColor(style, ['BGCOLOR', 'bgcolor', 'HIGHLIGHT', 'highlight', 'BACKGROUND-COLOR', 'background-color'])
      if (backgroundColor) map[style] = { ...(map[style] || {}), backgroundColor }
    })
    return map
  }, [editorState])

  const loadTaxonomy = async () => {
    const [authorsRes] = await Promise.all([axiosInstance.get('/api/authors')])
    setAuthors(authorsRes?.data?.data ?? [])
  }

  const createEditorStateFromHtml = async (html: string) => {
    const cleanedHtml = normalizeEditorPreviewTextColor(normalizeHtmlAssetUrls(sanitizeEditorHtml(html)))
    if (!cleanedHtml.trim()) return EditorState.createWithContent(ContentState.createFromText(''))
    if (typeof window !== 'undefined') {
      try {
        const draftModule = await import('html-to-draftjs')
        const htmlToDraft =
          (draftModule as any)?.default ||
          (typeof (draftModule as any) === 'function' ? (draftModule as any) : null)
        if (typeof htmlToDraft === 'function') {
          const parsed = htmlToDraft(cleanedHtml)
          const blocks = Array.isArray(parsed?.contentBlocks) ? parsed.contentBlocks : []
          const entities = { ...(parsed?.entityMap || {}) }
          Object.keys(entities).forEach(key => {
            const entity = entities[key]
            if (`${entity?.type || ''}`.toUpperCase() !== 'IMAGE') return
            const nextSrc = normalizeImageUrl(`${entity?.data?.src || ''}`.trim())
            if (!nextSrc) return
            entities[key] = {
              ...entity,
              data: {
                ...(entity?.data || {}),
                src: nextSrc,
                alt: `${entity?.data?.alt || ''}`.trim()
              }
            }
          })
          if (blocks.length > 0) {
            // Keep parser output untouched so text/image/text order remains exact in edit mode.
            const contentState = ContentState.createFromBlockArray(blocks, entities)
            return EditorState.createWithContent(contentState)
          }

        }
      } catch (_error) {
        // fallback below
      }
    }
    return EditorState.createWithContent(ContentState.createFromText(htmlToText(cleanedHtml)))
  }

  const handleEditorStateChange = (nextState: EditorState) => {
    setEditorState(nextState)
  }

  const loadCaseStudy = async (slug: string) => {
    if (!slug) return
    const res = await axiosInstance.get(`/api/case-studies/slug/${encodeURIComponent(slug)}`)
    const record = res?.data?.data || null
    if (!record) return

    setState({
      _id: record?._id,
      title: record?.title ?? '',
      slug: record?.slug ?? '',
      shortDescription: record?.shortDescription ?? '',
      layout: record?.layout ?? 'image-top',
      publishStatus: record?.publishStatus ?? 'draft',
      scheduledAt: toDateTimeLocal(record?.scheduledAt),
      categoryId: record?.categories?.[0]?.id ?? '',
      subCategoryId: record?.subCategories?.[0]?.id ?? '',
      serviceSlug: record?.serviceSlug ?? record?.categories?.[0]?.slug ?? '',
      subServiceSlug: record?.subServiceSlug ?? record?.subCategories?.[0]?.slug ?? '',
      industrySlug: record?.industrySlug ?? '',
      tagIds: Array.isArray(record?.tags) ? record.tags.map((item: any) => item?.id || item?._id).filter(Boolean) : [],
      authorId: record?.author?.id ?? record?.author?._id ?? '',
      seoTitle: record?.seo?.title ?? '',
      seoDescription: record?.seo?.description ?? '',
      seoCanonicalUrl: record?.seo?.canonicalUrl ?? '',
      seoOgImage: normalizeImageUrl(record?.seo?.ogImage ?? ''),
      seoRobots: record?.seo?.robots ?? 'index,follow',
      seoTwitterCard: record?.seo?.twitterCard ?? 'summary_large_image',
      seoKeywordsText: Array.isArray(record?.seo?.keywords) ? record.seo.keywords.join(', ') : ''
    })
    setIsSlugManuallyEdited(true)
    setDidSelectSubCategory(false)

    const hydrated = await createEditorStateFromHtml(record?.content || '')
    setEditorState(hydrated)
  }

  useEffect(() => {
    let active = true
    const init = async () => {
      try {
        setLoading(true)
        await loadTaxonomy()
        if (isEdit && active) {
          await loadCaseStudy(caseStudySlug)
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load data.')
      } finally {
        if (active) setLoading(false)
      }
    }
    init().then(() => null)
    return () => {
      active = false
    }
  }, [caseStudySlug, isEdit])

  useEffect(() => {
    dispatch(getCaseStudyCategoriesDropdown())
    dispatch(getCaseStudySubCategoriesDropdown({ parentCategory: state.categoryId || undefined }))
    dispatch(getCaseStudyTagsDropdown())
    dispatch(getServiceLinksDropdown({}))
    dispatch(getIndustryLinksDropdown())
  }, [dispatch, state.categoryId])

  useEffect(() => {
    if (isEdit || isSlugManuallyEdited) return
    setState(prev => ({ ...prev, slug: slugify(prev.title) }))
  }, [state.title, isEdit, isSlugManuallyEdited])

  const onSubmit = async (event: any, option: number) => {
    event.preventDefault()
    const seoKeywords = state.seoKeywordsText
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    try {
      setLoading(true)
      let htmlContent = normalizeDefaultInlineTextColor(
        normalizeHtmlAssetUrls(toEditorHtml(convertToRaw(editorState.getCurrentContent())).trim())
      )
      let seoOgImage = normalizeImageUrl(state.seoOgImage)

      const featuredUploaded = (await featuredUploaderRef.current?.uploadPending()) || []
      if (featuredUploaded.length) seoOgImage = featuredUploaded[0]?.secureUrl || featuredUploaded[0]?.url || seoOgImage

      if (!state.title.trim()) return toast.error('Please enter title.')
      if (!state.shortDescription.trim()) return toast.error('Please enter short description.')
      if (state.shortDescription.length > 500) return toast.error('Short description cannot exceed 500 characters.')
      if (!htmlContent || htmlContent === '<p></p>') return toast.error('Please enter content.')
      if (!state.layout) return toast.error('Please select layout.')
      if (!state.categoryId && !state.serviceSlug) return toast.error('Please select category or service.')
      if (state.publishStatus === 'scheduled' && !state.scheduledAt) return toast.error('Please select scheduled date.')

      const payload: any = {
        title: state.title.trim(),
        slug: state.slug.trim() || undefined,
        shortDescription: state.shortDescription.trim(),
        content: htmlContent,
        layout: state.layout,
        publishStatus: state.publishStatus,
        seo: {
          title: state.seoTitle.trim(),
          description: state.seoDescription.trim(),
          canonicalUrl: state.seoCanonicalUrl.trim(),
          ogImage: seoOgImage,
          robots: state.seoRobots.trim() || 'index,follow',
          keywords: seoKeywords,
          twitterCard: state.seoTwitterCard.trim() || 'summary_large_image'
        }
      }
      if (state.categoryId) payload.categoryId = state.categoryId
      if (didSelectSubCategory && state.subCategoryId) payload.subCategoryId = state.subCategoryId
      if (state.serviceSlug) payload.serviceSlug = state.serviceSlug
      if (state.subServiceSlug) payload.subServiceSlug = state.subServiceSlug
      if (state.industrySlug) payload.industrySlug = state.industrySlug
      if (state.tagIds.length > 0) payload.tags = state.tagIds
      if (state.authorId) payload.author = state.authorId
      if (state.publishStatus === 'scheduled') payload.scheduledAt = new Date(state.scheduledAt).toISOString()

      if (isEdit && state._id) {
        await axiosInstance.put(`/api/case-studies/${state._id}`, payload)
        toast.success('Case study updated successfully.')
      } else {
        await axiosInstance.post('/api/case-studies', payload)
        toast.success('Case study created successfully.')
      }

      dispatch(getData({ page: 1, limit: 10, search: '' }))
      if (option === 0) {
        router.push('/case-study/list')
      } else {
        setState({ ...defaultState, seoOgImage: '' })
        const emptyState = EditorState.createEmpty()
        setEditorState(emptyState)
        setIsSlugManuallyEdited(false)
        setDidSelectSubCategory(false)
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save case study.')
    } finally {
      setLoading(false)
    }
  }

  const uploadEditorImage = async (file: File) => {
    const submitUpload = async (fieldName: 'objfile' | 'file') => {
      const uploadNonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const formData = new FormData()
      formData.append(fieldName, file)
      formData.append('altText', state.title || file.name || 'case-study-content-image')
      formData.append('folder', 'images/case-studies')
      formData.append('type', 'case-study')
      const entityBase = state._id || caseStudyId || state.slug || 'case-study'
      formData.append('entityId', `${entityBase}-${uploadNonce}`)

      const res = await axiosInstance.post('/api/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const uploaded = Array.isArray(res?.data?.data) ? res?.data?.data?.[0] : res?.data?.data
      const imageUrl = normalizeImageUrl(`${uploaded?.secureUrl || uploaded?.url || uploaded?.publicId || ''}`.trim())
      if (!imageUrl) throw new Error('Image upload failed')
      return { data: { link: imageUrl } }
    }

    try {
      return await submitUpload('objfile')
    } catch (_error) {
      try {
        return await submitUpload('file')
      } catch (_fallbackError) {
        const dataUrl = await fileToDataUrl(file)
        return { data: { link: dataUrl } }
      }
    }
  }

  return (
    <DatePickerWrapper sx={{ position: 'relative', height: 'calc(100vh - 50px)', overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 12, overflow: 'auto', height: 'calc(100vh - 50px)' }}>
        <Box sx={{ mx: 'auto' }}>
          <Card>
            <Box sx={{ px: 4, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant='h5'>{isEdit ? 'Update Case Study' : 'Add Case Study'}</Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Create Case Studies
                </Typography>
              </Box>
              <Stack direction='row' spacing={1.5} alignItems='center'>
                <Chip size='small' label={state.publishStatus} color={state.publishStatus === 'published' ? 'success' : state.publishStatus === 'scheduled' ? 'warning' : 'default'} variant='outlined' />
                <IconButton onClick={() => router.back()}>
                  <Icon icon='tabler:x' />
                </IconButton>
              </Stack>
            </Box>
            <Divider />
            <Box sx={{ p: 4 }}>
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary' }}>
                Case Study Images
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <GlobalImageUploader
                    ref={featuredUploaderRef}
                    label='Parent / Featured Image'
                    folder='images/case-studies'
                    type='case-study'
                    entityId={state._id || caseStudyId || state.slug}
                    uploadOnSubmit
                    multiple={false}
                    altText={state.title || 'case-study-featured-image'}
                    value={normalizeImageUrl(state.seoOgImage)}
                    onUploaded={items => {
                      const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                      if (url) setState(prev => ({ ...prev, seoOgImage: url }))
                    }}
                    onClear={() => setState(prev => ({ ...prev, seoOgImage: '' }))}
                  />
                  <Typography variant='caption' sx={{ mt: 1, display: 'block', color: state.seoOgImage ? 'success.main' : 'warning.main' }}>
                    {state.seoOgImage ? 'Featured image ready.' : 'Featured image not selected.'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} />
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary' }}>
                Basic Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomTextField autoFocus fullWidth label={<TypoLabel name='Title' important />} value={state.title} onChange={e => setState(prev => ({ ...prev, title: e.target.value ?? '' }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label={<TypoLabel name='Slug' />}
                    value={state.slug}
                    onChange={e => {
                      setIsSlugManuallyEdited(true)
                      setState(prev => ({ ...prev, slug: slugify(e.target.value ?? '') }))
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField select fullWidth label={<TypoLabel name='Author' />} value={state.authorId} onChange={e => setState(prev => ({ ...prev, authorId: e.target.value ?? '' }))}>
                    <MenuItem value=''>Default logged in user</MenuItem>
                    {authors.map(item => (
                      <MenuItem key={item?.id ?? item?._id} value={item?.id ?? item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={3}
                    label={<TypoLabel name='Short Description' important />}
                    value={state.shortDescription}
                    onChange={e => setState(prev => ({ ...prev, shortDescription: (e.target.value ?? '').slice(0, 500) }))}
                    helperText={`${state.shortDescription.length}/500`}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <ServiceSlugSelector
                    selectedValue={state.serviceSlug}
                    handleChange={value =>
                      setState(prev => ({
                        ...prev,
                        serviceSlug: value?.slug || '',
                        subServiceSlug: ''
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SubServiceSlugSelector
                    selectedValue={state.subServiceSlug}
                    serviceSlug={state.serviceSlug}
                    handleChange={value => setState(prev => ({ ...prev, subServiceSlug: value?.slug || '' }))}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <IndustrySlugSelector
                    selectedValue={state.industrySlug}
                    handleChange={value => setState(prev => ({ ...prev, industrySlug: value?.slug || '' }))}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    select
                    fullWidth
                    label={<TypoLabel name='Case Study Position Layout' important />}
                    value={state.layout}
                    onChange={e =>
                      setState(prev => ({
                        ...prev,
                        layout: (e.target.value as CaseStudyState['layout']) ?? 'image-top'
                      }))
                    }
                  >
                    <MenuItem value='image-top'>Image Top</MenuItem>
                    <MenuItem value='image-right'>Image Right</MenuItem>
                    <MenuItem value='image-bottom'>Image Bottom</MenuItem>
                    <MenuItem value='image-left'>Image Left</MenuItem>
                  </CustomTextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary' }}>
                Taxonomy & Publish
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CaseStudyCategorySelector
                    selectedValue={state.categoryId}
                    important
                    handleChange={value =>
                      {
                        setDidSelectSubCategory(false)
                        setState(prev => ({
                          ...prev,
                          categoryId: value?.id ?? value?._id ?? '',
                          subCategoryId: ''
                        }))
                      }
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CaseStudySubCategorySelector
                    selectedValue={state.subCategoryId}
                    parentCategoryId={state.categoryId}
                    handleChange={value => {
                      setDidSelectSubCategory(true)
                      setState(prev => ({ ...prev, subCategoryId: value?.id ?? value?._id ?? '' }))
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    select
                    fullWidth
                    label={<TypoLabel name='Tags' />}
                    SelectProps={{
                      multiple: true,
                      value: state.tagIds,
                      onChange: e => setState(prev => ({ ...prev, tagIds: (e.target.value as string[]) ?? [] })),
                      renderValue: selected => (selected as string[]).map(id => tags.find((tag: any) => `${tag?.id ?? tag?._id}` === `${id}`)?.name || id).join(', ')
                    }}
                  >
                    {tags.map((item: any) => (
                      <MenuItem key={item?.id ?? item?._id} value={item?.id ?? item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField select fullWidth label={<TypoLabel name='Publish Status' important />} value={state.publishStatus} onChange={e => setState(prev => ({ ...prev, publishStatus: e.target.value as any }))}>
                    <MenuItem value='draft'>Draft</MenuItem>
                    <MenuItem value='published'>Published</MenuItem>
                    <MenuItem value='scheduled'>Scheduled</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    type='datetime-local'
                    label={<TypoLabel name='Scheduled At' important={state.publishStatus === 'scheduled'} />}
                    value={state.scheduledAt}
                    disabled={state.publishStatus !== 'scheduled'}
                    onChange={e => setState(prev => ({ ...prev, scheduledAt: e.target.value ?? '' }))}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary' }}>
                SEO
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomTextField fullWidth label={<TypoLabel name='SEO Title' />} value={state.seoTitle} onChange={e => setState(prev => ({ ...prev, seoTitle: e.target.value ?? '' }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField fullWidth label={<TypoLabel name='SEO Canonical URL' />} value={state.seoCanonicalUrl} onChange={e => setState(prev => ({ ...prev, seoCanonicalUrl: e.target.value ?? '' }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField fullWidth label={<TypoLabel name='SEO OG Image URL' />} value={state.seoOgImage} onChange={e => setState(prev => ({ ...prev, seoOgImage: e.target.value ?? '' }))} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField fullWidth label={<TypoLabel name='SEO Robots' />} value={state.seoRobots} onChange={e => setState(prev => ({ ...prev, seoRobots: e.target.value ?? '' }))} placeholder='index,follow' />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField fullWidth label={<TypoLabel name='SEO Twitter Card' />} value={state.seoTwitterCard} onChange={e => setState(prev => ({ ...prev, seoTwitterCard: e.target.value ?? '' }))} placeholder='summary_large_image' />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField fullWidth label={<TypoLabel name='SEO Keywords (comma separated)' />} value={state.seoKeywordsText} onChange={e => setState(prev => ({ ...prev, seoKeywordsText: e.target.value ?? '' }))} placeholder='case-study, cms, seo' />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField fullWidth multiline rows={2} label={<TypoLabel name='SEO Description' />} value={state.seoDescription} onChange={e => setState(prev => ({ ...prev, seoDescription: e.target.value ?? '' }))} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />
              <Typography variant='subtitle2' sx={{ mb: 2, color: 'text.secondary' }}>
                HTML Content
              </Typography>
              <EditorWrapper
                sx={{
                  '& .rdw-editor-toolbar': {
                    border: theme => `1px solid ${theme.palette.divider}`,
                    mb: 0
                  },
                  '& .rdw-editor-main': {
                    border: theme => `1px solid ${theme.palette.divider}`,
                    borderTop: 'none',
                    minHeight: 320,
                    px: 2
                  },
                  '& .rdw-editor-main .rdw-image-imagewrapper': {
                    display: 'inline-block',
                    maxWidth: '100%'
                  },
                  '& .rdw-editor-main .public-DraftStyleDefault-block': {
                    clear: 'none'
                  },
                  '& .rdw-editor-main a': {
                    color: theme => theme.palette.primary.main,
                    textDecoration: 'underline'
                  }
                }}
              >
                <ReactDraftWysiwyg
                  editorState={editorState}
                  onEditorStateChange={handleEditorStateChange}
                  customStyleMap={customStyleMap}
                  wrapperClassName='demo-wrapper'
                  editorClassName='demo-editor'
                  toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
                    image: {
                      uploadEnabled: true,
                      uploadCallback: uploadEditorImage,
                      previewImage: true,
                      inputAccept: 'image/*',
                      alignmentEnabled: true,
                      defaultImageAlignment: 'left',
                      showImageLoading: true,
                      alt: { present: true, mandatory: false },
                      defaultSize: { width: '100%', height: 'auto' }
                    }
                  }}
                />
              </EditorWrapper>
            </Box>
          </Card>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          zIndex: 10,
          width: '100%',
          borderTop: theme => `1px solid ${theme.palette.divider}`,
          backgroundColor: theme => theme.palette.background.paper,
          backdropFilter: 'blur(8px)',
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={() => router.back()}
            variant='outlined'
            color='error'
            size='small'
            sx={{ minWidth: 120, height: 34, borderRadius: 1.5 }}
            startIcon={<Icon fontSize='1rem' icon='tabler:x' />}
          >
            Cancel
          </Button>
          <Box sx={{ minWidth: 220 }}>
            <FormSaveButton
              fullWidth={false}
              options={isEdit ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
              onClick={(option: number, event: any) => onSubmit(event, option)}
            />
          </Box>
        </Box>
      </Box>
      <CustomBackdrop open={loading} />
    </DatePickerWrapper>
  )
}

export default CaseStudyForm
