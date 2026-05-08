import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import toast from 'react-hot-toast'
import Icon from 'src/core/components/icon'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomAutocomplete from 'src/core/components/mui/autocomplete'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/components/media/GlobalImageUploader'
import { uploadPendingFromRef } from 'src/components/media/uploadOnSubmit'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { stateFromHTML } from 'draft-js-import-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type HiringOption = { id: string; title: string; slug: string }
type ServiceOption = { title: string; slug: string }
type ActionItem = { title: string; description: string }
type HowCanHireItem = { title: string; description: string }
type PriceListItem = { pkgTitle: string; priceRange: string; description: string }
type SolutionBusinessItem = { title: string; description: string }
type HowWeHireDeveloperItem = { title: string; description: string }
type HireBestDeveloperItem = { title: string; description: string; icon: string }
type ChoiceBestModelItem = { title: string; description: string }
type AdvantageHiringItem = { title: string; description: string }
type FaqItem = { question: string; answer: string }
type TemplateForm = {
  actionSection: {
    title: string
    subtitle: string
    description: string
    items: ActionItem[]
  }
  howCanHire: {
    title: string
    subtitle: string
    description: string
    items: HowCanHireItem[]
  }
  cta: {
    title: string
    description: string
    buttonLabel: string
    buttonLink: string
    image: string
  }
  typeOfServices: {
    title: string
    middleTitle: string
    lastTitle: string
    description: string
    image: string
    services: ServiceOption[]
  }
  priceList: {
    title: string
    description: string
    items: PriceListItem[]
  }
  solutionsForBusiness: {
    title: string
    description: string
    items: SolutionBusinessItem[]
  }
  howWeHireDeveloper: {
    title: string
    subtitle: string
    description: string
    items: HowWeHireDeveloperItem[]
  }
  hireBestDeveloper: {
    title: string
    subtitle: string
    lastTitle: string
    description: string
    items: HireBestDeveloperItem[]
  }
  footerCta: {
    title: string
    description: string
    buttonLabel: string
    buttonLink: string
    image: string
  }
  choiceBestModel: {
    title: string
    subtitle: string
    lastTitle: string
    description: string
    items: ChoiceBestModelItem[]
  }
  advantageOfHiring: {
    title: string
    description: string
    items: AdvantageHiringItem[]
  }
  faq: FaqItem[]
}

type FormState = {
  parentHiringSlug: string
  title: string
  slug: string
  middleTitle: string
  lastTitle: string
  description: string
  imageUrl: string
  isActive: boolean
  hasPage: boolean
  metaTitle: string
  metaDescription: string
  metadataSection: string
  template: TemplateForm
}

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})

const toEditorState = (html: string) => {
  if (typeof window === 'undefined') return EditorState.createWithContent(ContentState.createFromText(''))
  try {
    return EditorState.createWithContent(stateFromHTML(html || ''))
  } catch (_error) {
    return EditorState.createWithContent(ContentState.createFromText(''))
  }
}

const normalizeDefaultInlineTextColor = (html: string) =>
  `${html || ''}`
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000000\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000\s*;?/gi, 'color: rgb(255,255,255);')

const HtmlEditorField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [editorState, setEditorState] = useState(() => toEditorState(value || ''))
  const localUpdateRef = useRef(false)

  useEffect(() => {
    if (localUpdateRef.current) {
      localUpdateRef.current = false
      return
    }
    setEditorState(toEditorState(value || ''))
  }, [value])

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, '& .rdw-editor-toolbar': { border: 'none', borderBottom: '1px solid', borderColor: 'divider', mb: 0 }, '& .rdw-editor-main': { minHeight: 120, px: 2, py: 1 } }}>
      <RichEditor
        editorState={editorState}
        onEditorStateChange={state => {
          setEditorState(state)
          localUpdateRef.current = true
          onChange(normalizeDefaultInlineTextColor(draftToHtml(convertToRaw(state.getCurrentContent()))))
        }}
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'history', 'link'],
          inline: { options: ['bold', 'italic', 'underline'] },
          list: { options: ['unordered', 'ordered'] }
        }}
      />
    </Box>
  )
}

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const defaultTemplate = (): TemplateForm => ({
  actionSection: {
    title: '',
    subtitle: '',
    description: '',
    items: [{ title: '', description: '' }]
  },
  howCanHire: {
    title: '',
    subtitle: '',
    description: '',
    items: [{ title: '', description: '' }]
  },
  cta: {
    title: '',
    description: '',
    buttonLabel: '',
    buttonLink: '',
    image: ''
  },
  typeOfServices: {
    title: '',
    middleTitle: '',
    lastTitle: '',
    description: '',
    image: '',
    services: []
  },
  priceList: {
    title: '',
    description: '',
    items: [{ pkgTitle: '', priceRange: '', description: '' }]
  },
  solutionsForBusiness: {
    title: '',
    description: '',
    items: [{ title: '', description: '' }]
  },
  howWeHireDeveloper: {
    title: '',
    subtitle: '',
    description: '',
    items: [{ title: '', description: '' }]
  },
  hireBestDeveloper: {
    title: '',
    subtitle: '',
    lastTitle: '',
    description: '',
    items: [{ title: '', description: '', icon: '' }]
  },
  footerCta: {
    title: '',
    description: '',
    buttonLabel: '',
    buttonLink: '',
    image: ''
  },
  choiceBestModel: {
    title: '',
    subtitle: '',
    lastTitle: '',
    description: '',
    items: [{ title: '', description: '' }]
  },
  advantageOfHiring: {
    title: '',
    description: '',
    items: [{ title: '', description: '' }]
  },
  faq: [{ question: '', answer: '' }]
})

const ensureFaqAnswerString = (value: any) => `${value ?? ''}`
const mapFaqItems = (items: any[]): FaqItem[] =>
  items.map(item => ({
    question: `${item?.question ?? ''}`,
    answer: ensureFaqAnswerString(item?.answer)
  }))

const defaultForm = (): FormState => ({
  parentHiringSlug: '',
  title: '',
  slug: '',
  middleTitle: '',
  lastTitle: '',
  description: '',
  imageUrl: '',
  isActive: true,
  hasPage: true,
  metaTitle: '',
  metaDescription: '',
  metadataSection: 'sub-hiring',
  template: defaultTemplate()
})

const fromTemplateData = (data: any): TemplateForm => ({
  actionSection: {
    title: `${data?.actionSection?.title ?? ''}`,
    subtitle: `${data?.actionSection?.subtitle ?? ''}`,
    description: `${data?.actionSection?.description ?? ''}`,
    items: Array.isArray(data?.actionSection?.items) && data.actionSection.items.length
      ? data.actionSection.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ title: '', description: '' }]
  },
  howCanHire: {
    title: `${data?.howCanHire?.title ?? ''}`,
    subtitle: `${data?.howCanHire?.subtitle ?? ''}`,
    description: `${data?.howCanHire?.description ?? ''}`,
    items: Array.isArray(data?.howCanHire?.items) && data.howCanHire.items.length
      ? data.howCanHire.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ title: '', description: '' }]
  },
  cta: {
    title: `${data?.cta?.title ?? ''}`,
    description: `${data?.cta?.description ?? ''}`,
    buttonLabel: `${data?.cta?.buttonLabel ?? ''}`,
    buttonLink: `${data?.cta?.buttonLink ?? ''}`,
    image: `${data?.cta?.image ?? ''}`
  },
  typeOfServices: {
    title: `${data?.typeOfServices?.title ?? ''}`,
    middleTitle: `${data?.typeOfServices?.middleTitle ?? ''}`,
    lastTitle: `${data?.typeOfServices?.lastTitle ?? ''}`,
    description: `${data?.typeOfServices?.description ?? ''}`,
    image: `${data?.typeOfServices?.image ?? ''}`,
    services: Array.isArray(data?.typeOfServices?.services)
      ? data.typeOfServices.services
          .map((item: any) => ({
            title: `${item?.title ?? item?.name ?? ''}`.trim(),
            slug: `${item?.slug ?? ''}`.trim()
          }))
          .filter((item: ServiceOption) => item.slug)
      : []
  },
  priceList: {
    title: `${data?.priceList?.title ?? ''}`,
    description: `${data?.priceList?.description ?? ''}`,
    items: Array.isArray(data?.priceList?.items) && data.priceList.items.length
      ? data.priceList.items.map((item: any) => ({
          pkgTitle: `${item?.pkgTitle ?? ''}`,
          priceRange: `${item?.priceRange ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ pkgTitle: '', priceRange: '', description: '' }]
  },
  solutionsForBusiness: {
    title: `${data?.solutionsForBusiness?.title ?? ''}`,
    description: `${data?.solutionsForBusiness?.description ?? ''}`,
    items: Array.isArray(data?.solutionsForBusiness?.items) && data.solutionsForBusiness.items.length
      ? data.solutionsForBusiness.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ title: '', description: '' }]
  },
  howWeHireDeveloper: {
    title: `${data?.howWeHireDeveloper?.title ?? ''}`,
    subtitle: `${data?.howWeHireDeveloper?.subtitle ?? ''}`,
    description: `${data?.howWeHireDeveloper?.description ?? ''}`,
    items: Array.isArray(data?.howWeHireDeveloper?.items) && data.howWeHireDeveloper.items.length
      ? data.howWeHireDeveloper.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ title: '', description: '' }]
  },
  hireBestDeveloper: {
    title: `${data?.hireBestDeveloper?.title ?? ''}`,
    subtitle: `${data?.hireBestDeveloper?.subtitle ?? ''}`,
    lastTitle: `${data?.hireBestDeveloper?.lastTitle ?? ''}`,
    description: `${data?.hireBestDeveloper?.description ?? ''}`,
    items: Array.isArray(data?.hireBestDeveloper?.items) && data.hireBestDeveloper.items.length
      ? data.hireBestDeveloper.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`,
          icon: `${item?.icon ?? ''}`
        }))
      : [{ title: '', description: '', icon: '' }]
  },
  footerCta: {
    title: `${data?.footerCta?.title ?? ''}`,
    description: `${data?.footerCta?.description ?? ''}`,
    buttonLabel: `${data?.footerCta?.buttonLabel ?? ''}`,
    buttonLink: `${data?.footerCta?.buttonLink ?? ''}`,
    image: `${data?.footerCta?.image ?? ''}`
  },
  choiceBestModel: {
    title: `${data?.choiceBestModel?.title ?? ''}`,
    subtitle: `${data?.choiceBestModel?.subtitle ?? ''}`,
    lastTitle: `${data?.choiceBestModel?.lastTitle ?? ''}`,
    description: `${data?.choiceBestModel?.description ?? ''}`,
    items: Array.isArray(data?.choiceBestModel?.items) && data.choiceBestModel.items.length
      ? data.choiceBestModel.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ title: '', description: '' }]
  },
  advantageOfHiring: {
    title: `${data?.advantageOfHiring?.title ?? ''}`,
    description: `${data?.advantageOfHiring?.description ?? ''}`,
    items: Array.isArray(data?.advantageOfHiring?.items) && data.advantageOfHiring.items.length
      ? data.advantageOfHiring.items.map((item: any) => ({
          title: `${item?.title ?? ''}`,
          description: `${item?.description ?? ''}`
        }))
      : [{ title: '', description: '' }]
  },
  faq: Array.isArray(data?.faq) && data.faq.length ? mapFaqItems(data.faq) : [{ question: '', answer: '' }]
})

const toTemplateData = (template: TemplateForm) => ({
  actionSection: {
    title: template.actionSection.title.trim(),
    subtitle: template.actionSection.subtitle.trim(),
    description: template.actionSection.description || '',
    items: template.actionSection.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  howCanHire: {
    title: template.howCanHire.title.trim(),
    subtitle: template.howCanHire.subtitle.trim(),
    description: template.howCanHire.description || '',
    items: template.howCanHire.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  cta: {
    title: template.cta.title.trim(),
    description: template.cta.description || '',
    buttonLabel: template.cta.buttonLabel.trim(),
    buttonLink: template.cta.buttonLink.trim(),
    image: template.cta.image.trim()
  },
  typeOfServices: {
    title: template.typeOfServices.title.trim(),
    middleTitle: template.typeOfServices.middleTitle.trim(),
    lastTitle: template.typeOfServices.lastTitle.trim(),
    description: template.typeOfServices.description || '',
    image: template.typeOfServices.image.trim(),
    services: template.typeOfServices.services
      .map(item => ({ title: item.title.trim(), slug: item.slug.trim() }))
      .filter(item => item.slug)
  },
  priceList: {
    title: template.priceList.title.trim(),
    description: template.priceList.description || '',
    items: template.priceList.items
      .map(item => ({ pkgTitle: item.pkgTitle.trim(), priceRange: item.priceRange.trim(), description: item.description.trim() }))
      .filter(item => item.pkgTitle || item.priceRange || item.description)
  },
  solutionsForBusiness: {
    title: template.solutionsForBusiness.title.trim(),
    description: template.solutionsForBusiness.description || '',
    items: template.solutionsForBusiness.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  howWeHireDeveloper: {
    title: template.howWeHireDeveloper.title.trim(),
    subtitle: template.howWeHireDeveloper.subtitle.trim(),
    description: template.howWeHireDeveloper.description || '',
    items: template.howWeHireDeveloper.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  hireBestDeveloper: {
    title: template.hireBestDeveloper.title.trim(),
    subtitle: template.hireBestDeveloper.subtitle.trim(),
    lastTitle: template.hireBestDeveloper.lastTitle.trim(),
    description: template.hireBestDeveloper.description || '',
    items: template.hireBestDeveloper.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim(), icon: item.icon.trim() }))
      .filter(item => item.title || item.description || item.icon)
  },
  footerCta: {
    title: template.footerCta.title.trim(),
    description: template.footerCta.description || '',
    buttonLabel: template.footerCta.buttonLabel.trim(),
    buttonLink: template.footerCta.buttonLink.trim(),
    image: template.footerCta.image.trim()
  },
  choiceBestModel: {
    title: template.choiceBestModel.title.trim(),
    subtitle: template.choiceBestModel.subtitle.trim(),
    lastTitle: template.choiceBestModel.lastTitle.trim(),
    description: template.choiceBestModel.description || '',
    items: template.choiceBestModel.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  advantageOfHiring: {
    title: template.advantageOfHiring.title.trim(),
    description: template.advantageOfHiring.description || '',
    items: template.advantageOfHiring.items
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  faq: template.faq
    .map(item => ({ question: item.question.trim(), answer: item.answer.trim() }))
    .filter(item => item.question || item.answer)
})

const SubHiringForm = () => {
  const router = useRouter()
  const mode = `${router.query?.mode ?? 'create'}` === 'edit' ? 'edit' : 'create'
  const slugParam = `${router.query?.slug ?? ''}`.trim()
  const hiringSlugParam = `${router.query?.hiringSlug ?? ''}`.trim()

  const [hirings, setHirings] = useState<HiringOption[]>([])
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [expanded, setExpanded] = useState<string | false>('actionSection')
  const [form, setForm] = useState<FormState>(defaultForm())
  const imageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const ctaImageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const typeOfServicesImageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const footerCtaImageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const hireBestDeveloperIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])

  useEffect(() => {
    if (slugTouched) return
    setForm(prev => ({ ...prev, slug: slugify(prev.title) }))
  }, [form.title, slugTouched])

  useEffect(() => {
    const loadHirings = async () => {
      try {
        const res = await axiosInstance.get('/api/dropdowns/hirings')
        const list = Array.isArray(res?.data?.data) ? res.data.data : []
        const options = list
          .map((item: any) => ({
            id: `${item?.id ?? item?._id ?? ''}`.trim(),
            title: `${item?.title ?? item?.name ?? ''}`.trim(),
            slug: `${item?.slug ?? ''}`.trim()
          }))
          .filter((item: HiringOption) => item.slug)
        setHirings(options)
        setForm(prev => ({
          ...prev,
          parentHiringSlug: prev.parentHiringSlug || hiringSlugParam || options?.[0]?.slug || ''
        }))
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load hirings.')
      }
    }
    loadHirings().then(() => null)
  }, [hiringSlugParam])

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await axiosInstance.get('/api/dropdowns/services')
        const list = Array.isArray(res?.data?.data) ? res.data.data : []
        const options = list
          .map((item: any) => ({
            title: `${item?.title ?? item?.name ?? ''}`.trim(),
            slug: `${item?.slug ?? ''}`.trim()
          }))
          .filter((item: ServiceOption) => item.slug)
        setServiceOptions(options)
      } catch (_error) {
        setServiceOptions([])
      }
    }
    loadServices().then(() => null)
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !slugParam || !hiringSlugParam) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(
          `/api/menu-structure/hirings/${encodeURIComponent(hiringSlugParam)}/sub-hirings/${encodeURIComponent(slugParam)}`
        )
        const item = res?.data?.data ?? res?.data ?? {}
        setForm({
          parentHiringSlug: hiringSlugParam,
          title: `${item?.title ?? item?.name ?? ''}`,
          slug: `${item?.slug ?? slugParam}`,
          middleTitle: `${item?.middleTitle ?? ''}`,
          lastTitle: `${item?.lastTitle ?? ''}`,
          description: `${item?.description ?? ''}`,
          imageUrl: `${item?.imageUrl ?? item?.image ?? ''}`,
          isActive: item?.isActive ?? true,
          hasPage: item?.hasPage ?? true,
          metaTitle: `${item?.metaTitle ?? ''}`,
          metaDescription: `${item?.metaDescription ?? ''}`,
          metadataSection: `${item?.metadata?.section ?? 'sub-hiring'}`,
          template: fromTemplateData(item?.templateData ?? {})
        })
        setSlugTouched(true)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load sub hiring.')
      } finally {
        setLoading(false)
      }
    }
    load().then(() => null)
  }, [mode, slugParam, hiringSlugParam])

  const save = async () => {
    if (!form.parentHiringSlug.trim()) return toast.error('Parent hiring is required.')
    if (!form.title.trim()) return toast.error('Sub hiring title is required.')
    if (!form.slug.trim()) return toast.error('Sub hiring slug is required.')

    setLoading(true)
    const uploadedImageUrl = await uploadPendingFromRef(imageUploaderRef.current, form.imageUrl)
    const uploadedCtaImage = await uploadPendingFromRef(ctaImageUploaderRef.current, form.template.cta.image)
    const uploadedTypeOfServicesImage = await uploadPendingFromRef(typeOfServicesImageUploaderRef.current, form.template.typeOfServices.image)
    const uploadedFooterCtaImage = await uploadPendingFromRef(footerCtaImageUploaderRef.current, form.template.footerCta.image)
    const uploadedHireBestDeveloperItems = await Promise.all(
      form.template.hireBestDeveloper.items.map((item, index) =>
        uploadPendingFromRef(hireBestDeveloperIconRefs.current[index] ?? null, item.icon).then(icon => ({ ...item, icon: icon.trim() }))
      )
    )
    const nextTemplate = {
      ...form.template,
      cta: { ...form.template.cta, image: uploadedCtaImage.trim() },
      typeOfServices: { ...form.template.typeOfServices, image: uploadedTypeOfServicesImage.trim() },
      footerCta: { ...form.template.footerCta, image: uploadedFooterCtaImage.trim() },
      hireBestDeveloper: { ...form.template.hireBestDeveloper, items: uploadedHireBestDeveloperItems }
    }
    const payload = {
      title: form.title.trim(),
      name: form.title.trim(),
      slug: form.slug.trim(),
      middleTitle: form.middleTitle.trim(),
      lastTitle: form.lastTitle.trim(),
      description: form.description.trim(),
      imageUrl: uploadedImageUrl.trim(),
      image: uploadedImageUrl.trim(),
      metadata: { section: form.metadataSection.trim() || 'sub-hiring' },
      templateData: toTemplateData(nextTemplate),
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      isActive: !!form.isActive,
      hasPage: !!form.hasPage
    }

    try {
      if (mode === 'edit') {
        await axiosInstance.put(
          `/api/menu-structure/hirings/${encodeURIComponent(form.parentHiringSlug)}/sub-hirings/${encodeURIComponent(slugParam)}`,
          payload
        )
        toast.success('Sub hiring updated successfully.')
      } else {
        await axiosInstance.post(
          `/api/menu-structure/hirings/${encodeURIComponent(form.parentHiringSlug)}/sub-hirings`,
          payload
        )
        toast.success('Sub hiring created successfully.')
      }
      router.push('/hirings/sub-hirings-list')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save sub hiring.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5'>{mode === 'edit' ? 'Edit Sub Hiring' : 'Add Sub Hiring'}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => router.push('/hirings/sub-hirings-list')}>
              Back
            </Button>
            <Button variant='contained' onClick={save}>
              {mode === 'edit' ? 'Update Sub Hiring' : 'Create Sub Hiring'}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                fullWidth
                label='Parent Hiring'
                value={form.parentHiringSlug}
                disabled={mode === 'edit'}
                onChange={e => setForm(prev => ({ ...prev, parentHiringSlug: e.target.value ?? '' }))}
              >
                {hirings.map(item => (
                  <MenuItem key={item.slug} value={item.slug}>
                    {item.title}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Title' value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Slug'
                value={form.slug}
                onChange={e => {
                  setSlugTouched(true)
                  setForm(prev => ({ ...prev, slug: slugify(e.target.value ?? '') }))
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Image URL' value={form.imageUrl} onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12}>
              <GlobalImageUploader
                ref={imageUploaderRef}
                label='Sub Hiring Image'
                folder='images/sub-hirings'
                type='sub-hiring'
                entityId={form.slug || form.title || 'sub-hiring'}
                uploadOnSubmit
                multiple={false}
                altText={form.title || 'sub-hiring-image'}
                value={form.imageUrl}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setForm(prev => ({ ...prev, imageUrl: url }))
                }}
                onClear={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Middle Title' value={form.middleTitle} onChange={e => setForm(prev => ({ ...prev, middleTitle: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Last Title' value={form.lastTitle} onChange={e => setForm(prev => ({ ...prev, lastTitle: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth multiline rows={3} label='Description' value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField select fullWidth label='Status' value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField select fullWidth label='Has Page' value={form.hasPage ? 'true' : 'false'} onChange={e => setForm(prev => ({ ...prev, hasPage: e.target.value === 'true' }))}>
                <MenuItem value='true'>True</MenuItem>
                <MenuItem value='false'>False</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField fullWidth label='Meta Title' value={form.metaTitle} onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField fullWidth label='Meta Description' value={form.metaDescription} onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='Metadata Section' value={form.metadataSection} onChange={e => setForm(prev => ({ ...prev, metadataSection: e.target.value ?? '' }))} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                Template Data
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiAccordion-root': {
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '10px !important',
                    boxShadow: 'none',
                    mb: 2,
                    '&:before': { display: 'none' }
                  },
                  '& .MuiAccordionSummary-root': { bgcolor: 'action.hover', minHeight: 54 },
                  '& .MuiAccordionSummary-content': { my: 1.25 },
                  '& .MuiAccordionDetails-root': { pt: 3 },
                  '& .MuiAccordionDetails-root > .MuiGrid-container': { rowGap: 0.5 },
                  '& .MuiAccordionDetails-root .MuiGrid-item': { display: 'flex', flexDirection: 'column' },
                  '& .MuiAccordionDetails-root .MuiFormControl-root': { width: '100%' },
                  '& .MuiAccordionDetails-root .MuiButton-root': { textTransform: 'none' },
                  '& .MuiAccordionDetails-root .MuiGrid-item > .MuiButton-root': { alignSelf: 'flex-start' },
                  '& .MuiAccordionDetails-root .MuiTypography-caption': { fontWeight: 600, color: 'text.secondary' }
                }}
              >
                <Accordion expanded={expanded === 'actionSection'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'actionSection' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Action Section</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Title'
                          value={form.template.actionSection.title}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, actionSection: { ...prev.template.actionSection, title: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Subtitle'
                          value={form.template.actionSection.subtitle}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, actionSection: { ...prev.template.actionSection, subtitle: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField
                          value={form.template.actionSection.description}
                          onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, actionSection: { ...prev.template.actionSection, description: nextValue } } }))}
                        />
                      </Grid>
                      {form.template.actionSection.items.map((item, index) => (
                        <Grid item xs={12} key={`action-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField
                                fullWidth
                                label='Item Title'
                                value={item.title}
                                onChange={e =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      actionSection: {
                                        ...prev.template.actionSection,
                                        items: prev.template.actionSection.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it))
                                      }
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField
                                value={item.description}
                                onChange={nextValue =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      actionSection: {
                                        ...prev.template.actionSection,
                                        items: prev.template.actionSection.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it))
                                      }
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button
                                color='error'
                                fullWidth
                                onClick={() =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      actionSection: {
                                        ...prev.template.actionSection,
                                        items:
                                          prev.template.actionSection.items.length > 1
                                            ? prev.template.actionSection.items.filter((_, idx) => idx !== index)
                                            : prev.template.actionSection.items
                                      }
                                    }
                                  }))
                                }
                              >
                                <Icon icon='tabler:trash' />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          variant='outlined'
                          onClick={() =>
                            setForm(prev => ({
                              ...prev,
                              template: {
                                ...prev.template,
                                actionSection: {
                                  ...prev.template.actionSection,
                                  items: [...prev.template.actionSection.items, { title: '', description: '' }]
                                }
                              }
                            }))
                          }
                        >
                          Add Action Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'howCanHire'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'howCanHire' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>How Can Hire</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Title'
                          value={form.template.howCanHire.title}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, howCanHire: { ...prev.template.howCanHire, title: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Subtitle'
                          value={form.template.howCanHire.subtitle}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, howCanHire: { ...prev.template.howCanHire, subtitle: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField
                          value={form.template.howCanHire.description}
                          onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, howCanHire: { ...prev.template.howCanHire, description: nextValue } } }))}
                        />
                      </Grid>
                      {form.template.howCanHire.items.map((item, index) => (
                        <Grid item xs={12} key={`how-can-hire-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField
                                fullWidth
                                label='Item Title'
                                value={item.title}
                                onChange={e =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      howCanHire: {
                                        ...prev.template.howCanHire,
                                        items: prev.template.howCanHire.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it))
                                      }
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField
                                value={item.description}
                                onChange={nextValue =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      howCanHire: {
                                        ...prev.template.howCanHire,
                                        items: prev.template.howCanHire.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it))
                                      }
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button
                                color='error'
                                fullWidth
                                onClick={() =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      howCanHire: {
                                        ...prev.template.howCanHire,
                                        items:
                                          prev.template.howCanHire.items.length > 1
                                            ? prev.template.howCanHire.items.filter((_, idx) => idx !== index)
                                            : prev.template.howCanHire.items
                                      }
                                    }
                                  }))
                                }
                              >
                                <Icon icon='tabler:trash' />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button
                          variant='outlined'
                          onClick={() =>
                            setForm(prev => ({
                              ...prev,
                              template: {
                                ...prev.template,
                                howCanHire: {
                                  ...prev.template.howCanHire,
                                  items: [...prev.template.howCanHire.items, { title: '', description: '' }]
                                }
                              }
                            }))
                          }
                        >
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'cta'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'cta' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>CTA Section</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Title'
                          value={form.template.cta.title}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, cta: { ...prev.template.cta, title: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField
                          value={form.template.cta.description}
                          onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, cta: { ...prev.template.cta, description: nextValue } } }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Button Label'
                          value={form.template.cta.buttonLabel}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, cta: { ...prev.template.cta, buttonLabel: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Button Link'
                          value={form.template.cta.buttonLink}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, cta: { ...prev.template.cta, buttonLink: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <GlobalImageUploader
                          ref={ctaImageUploaderRef}
                          label='CTA Image'
                          folder='images/sub-hirings'
                          type='sub-hiring'
                          entityId={`${form.slug || form.title || 'sub-hiring'}-cta`}
                          uploadOnSubmit
                          multiple={false}
                          altText={form.template.cta.title || 'sub-hiring-cta-image'}
                          value={form.template.cta.image}
                          onUploaded={items => {
                            const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                            if (url) setForm(prev => ({ ...prev, template: { ...prev.template, cta: { ...prev.template.cta, image: url } } }))
                          }}
                          onClear={() => setForm(prev => ({ ...prev, template: { ...prev.template, cta: { ...prev.template.cta, image: '' } } }))}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'typeOfServices'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'typeOfServices' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Type of Services</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          fullWidth
                          label='Title'
                          value={form.template.typeOfServices.title}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, typeOfServices: { ...prev.template.typeOfServices, title: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          fullWidth
                          label='Middle Title'
                          value={form.template.typeOfServices.middleTitle}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, typeOfServices: { ...prev.template.typeOfServices, middleTitle: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField
                          fullWidth
                          label='Last Title'
                          value={form.template.typeOfServices.lastTitle}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, typeOfServices: { ...prev.template.typeOfServices, lastTitle: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField
                          value={form.template.typeOfServices.description}
                          onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, typeOfServices: { ...prev.template.typeOfServices, description: nextValue } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <GlobalImageUploader
                          ref={typeOfServicesImageUploaderRef}
                          label='Type of Services Image'
                          folder='images/sub-hirings'
                          type='sub-hiring'
                          entityId={`${form.slug || form.title || 'sub-hiring'}-type-of-services`}
                          uploadOnSubmit
                          multiple={false}
                          altText={form.template.typeOfServices.title || 'sub-hiring-type-of-services-image'}
                          value={form.template.typeOfServices.image}
                          onUploaded={items => {
                            const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                            if (url) setForm(prev => ({ ...prev, template: { ...prev.template, typeOfServices: { ...prev.template.typeOfServices, image: url } } }))
                          }}
                          onClear={() => setForm(prev => ({ ...prev, template: { ...prev.template, typeOfServices: { ...prev.template.typeOfServices, image: '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomAutocomplete<ServiceOption, true, false, false>
                          multiple
                          disableCloseOnSelect
                          options={serviceOptions}
                          value={form.template.typeOfServices.services.map(selected => {
                            const option = serviceOptions.find(s => s.slug === selected.slug)
                            return option || selected
                          })}
                          isOptionEqualToValue={(option, value) => option.slug === value.slug}
                          getOptionLabel={option => option.title || option.slug}
                          onChange={(_, next) =>
                            setForm(prev => ({
                              ...prev,
                              template: {
                                ...prev.template,
                                typeOfServices: {
                                  ...prev.template.typeOfServices,
                                  services: next.map(item => ({ title: item.title, slug: item.slug }))
                                }
                              }
                            }))
                          }
                          renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                              <Chip {...getTagProps({ index })} key={option.slug} size='small' label={option.title || option.slug} />
                            ))
                          }
                          renderInput={params => <CustomTextField {...params} fullWidth label='Services (Multiple)' placeholder='Select services' />}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'priceList'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'priceList' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Price List</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Title'
                          value={form.template.priceList.title}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, priceList: { ...prev.template.priceList, title: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField
                          value={form.template.priceList.description}
                          onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, priceList: { ...prev.template.priceList, description: nextValue } } }))}
                        />
                      </Grid>
                      {form.template.priceList.items.map((item, index) => (
                        <Grid item xs={12} key={`price-list-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                fullWidth
                                label='Package Title'
                                value={item.pkgTitle}
                                onChange={e =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: { ...prev.template, priceList: { ...prev.template.priceList, items: prev.template.priceList.items.map((it, idx) => (idx === index ? { ...it, pkgTitle: e.target.value ?? '' } : it)) } }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField
                                fullWidth
                                label='Price Range'
                                value={item.priceRange}
                                onChange={e =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: { ...prev.template, priceList: { ...prev.template.priceList, items: prev.template.priceList.items.map((it, idx) => (idx === index ? { ...it, priceRange: e.target.value ?? '' } : it)) } }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField
                                value={item.description}
                                onChange={nextValue =>
                                  setForm(prev => ({
                                    ...prev,
                                    template: { ...prev.template, priceList: { ...prev.template.priceList, items: prev.template.priceList.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it)) } }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, priceList: { ...prev.template.priceList, items: prev.template.priceList.items.length > 1 ? prev.template.priceList.items.filter((_, idx) => idx !== index) : prev.template.priceList.items } } }))}>-</Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, priceList: { ...prev.template.priceList, items: [...prev.template.priceList.items, { pkgTitle: '', priceRange: '', description: '' }] } } }))}>
                          Add Price Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'solutionsForBusiness'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'solutionsForBusiness' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Solution for Business</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField
                          fullWidth
                          label='Title'
                          value={form.template.solutionsForBusiness.title}
                          onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsForBusiness: { ...prev.template.solutionsForBusiness, title: e.target.value ?? '' } } }))}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField
                          value={form.template.solutionsForBusiness.description}
                          onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsForBusiness: { ...prev.template.solutionsForBusiness, description: nextValue } } }))}
                        />
                      </Grid>
                      {form.template.solutionsForBusiness.items.map((item, index) => (
                        <Grid item xs={12} key={`solution-business-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField fullWidth label='Item Title' value={item.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsForBusiness: { ...prev.template.solutionsForBusiness, items: prev.template.solutionsForBusiness.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField value={item.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsForBusiness: { ...prev.template.solutionsForBusiness, items: prev.template.solutionsForBusiness.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={2}><Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsForBusiness: { ...prev.template.solutionsForBusiness, items: prev.template.solutionsForBusiness.items.length > 1 ? prev.template.solutionsForBusiness.items.filter((_, idx) => idx !== index) : prev.template.solutionsForBusiness.items } } }))}>-</Button></Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsForBusiness: { ...prev.template.solutionsForBusiness, items: [...prev.template.solutionsForBusiness.items, { title: '', description: '' }] } } }))}>
                          Add Solution Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'howWeHireDeveloper'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'howWeHireDeveloper' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>How We Hire Developer</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Title' value={form.template.howWeHireDeveloper.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, title: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Subtitle' value={form.template.howWeHireDeveloper.subtitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, subtitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField value={form.template.howWeHireDeveloper.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, description: nextValue } } }))} />
                      </Grid>
                      {form.template.howWeHireDeveloper.items.map((item, index) => (
                        <Grid item xs={12} key={`how-we-hire-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField fullWidth label='Item Title' value={item.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, items: prev.template.howWeHireDeveloper.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField value={item.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, items: prev.template.howWeHireDeveloper.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={2}><Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, items: prev.template.howWeHireDeveloper.items.length > 1 ? prev.template.howWeHireDeveloper.items.filter((_, idx) => idx !== index) : prev.template.howWeHireDeveloper.items } } }))}>-</Button></Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, howWeHireDeveloper: { ...prev.template.howWeHireDeveloper, items: [...prev.template.howWeHireDeveloper.items, { title: '', description: '' }] } } }))}>
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'hireBestDeveloper'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'hireBestDeveloper' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Hire The Best Developer</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Title' value={form.template.hireBestDeveloper.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, title: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Subtitle' value={form.template.hireBestDeveloper.subtitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, subtitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Last Title' value={form.template.hireBestDeveloper.lastTitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, lastTitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField value={form.template.hireBestDeveloper.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, description: nextValue } } }))} />
                      </Grid>
                      {form.template.hireBestDeveloper.items.map((item, index) => (
                        <Grid item xs={12} key={`hire-best-dev-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField fullWidth label='Item Title' value={item.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, items: prev.template.hireBestDeveloper.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField value={item.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, items: prev.template.hireBestDeveloper.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <GlobalImageUploader
                                ref={el => {
                                  hireBestDeveloperIconRefs.current[index] = el
                                }}
                                label={`Item ${index + 1} Icon`}
                                folder='images/sub-hirings'
                                type='sub-hiring'
                                entityId={`${form.slug || form.title || 'sub-hiring'}-hire-best-dev-${index}`}
                                uploadOnSubmit
                                multiple={false}
                                altText={`hire-best-dev-item-${index + 1}-icon`}
                                value={item.icon}
                                onUploaded={items => {
                                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                                  if (url) setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, items: prev.template.hireBestDeveloper.items.map((it, idx) => (idx === index ? { ...it, icon: url } : it)) } } }))
                                }}
                                onClear={() => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, items: prev.template.hireBestDeveloper.items.map((it, idx) => (idx === index ? { ...it, icon: '' } : it)) } } }))}
                              />
                            </Grid>
                            <Grid item xs={12} md={2}><Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, items: prev.template.hireBestDeveloper.items.length > 1 ? prev.template.hireBestDeveloper.items.filter((_, idx) => idx !== index) : prev.template.hireBestDeveloper.items } } }))}>-</Button></Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, hireBestDeveloper: { ...prev.template.hireBestDeveloper, items: [...prev.template.hireBestDeveloper.items, { title: '', description: '', icon: '' }] } } }))}>
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'footerCta'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'footerCta' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Footer CTA</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Title' value={form.template.footerCta.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, footerCta: { ...prev.template.footerCta, title: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField value={form.template.footerCta.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, footerCta: { ...prev.template.footerCta, description: nextValue } } }))} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Button Label' value={form.template.footerCta.buttonLabel} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, footerCta: { ...prev.template.footerCta, buttonLabel: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Button Link' value={form.template.footerCta.buttonLink} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, footerCta: { ...prev.template.footerCta, buttonLink: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <GlobalImageUploader
                          ref={footerCtaImageUploaderRef}
                          label='Footer CTA Image'
                          folder='images/sub-hirings'
                          type='sub-hiring'
                          entityId={`${form.slug || form.title || 'sub-hiring'}-footer-cta`}
                          uploadOnSubmit
                          multiple={false}
                          altText={form.template.footerCta.title || 'sub-hiring-footer-cta-image'}
                          value={form.template.footerCta.image}
                          onUploaded={items => {
                            const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                            if (url) setForm(prev => ({ ...prev, template: { ...prev.template, footerCta: { ...prev.template.footerCta, image: url } } }))
                          }}
                          onClear={() => setForm(prev => ({ ...prev, template: { ...prev.template, footerCta: { ...prev.template.footerCta, image: '' } } }))}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'choiceBestModel'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'choiceBestModel' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Choice Best Model</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Title' value={form.template.choiceBestModel.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, title: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Subtitle' value={form.template.choiceBestModel.subtitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, subtitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CustomTextField fullWidth label='Last Title' value={form.template.choiceBestModel.lastTitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, lastTitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField value={form.template.choiceBestModel.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, description: nextValue } } }))} />
                      </Grid>
                      {form.template.choiceBestModel.items.map((item, index) => (
                        <Grid item xs={12} key={`choice-best-model-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField fullWidth label='Item Title' value={item.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, items: prev.template.choiceBestModel.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField value={item.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, items: prev.template.choiceBestModel.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={2}><Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, items: prev.template.choiceBestModel.items.length > 1 ? prev.template.choiceBestModel.items.filter((_, idx) => idx !== index) : prev.template.choiceBestModel.items } } }))}>-</Button></Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, choiceBestModel: { ...prev.template.choiceBestModel, items: [...prev.template.choiceBestModel.items, { title: '', description: '' }] } } }))}>
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'advantageOfHiring'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'advantageOfHiring' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Advantage of Hiring</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Title' value={form.template.advantageOfHiring.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, advantageOfHiring: { ...prev.template.advantageOfHiring, title: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          Description (HTML)
                        </Typography>
                        <HtmlEditorField value={form.template.advantageOfHiring.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, advantageOfHiring: { ...prev.template.advantageOfHiring, description: nextValue } } }))} />
                      </Grid>
                      {form.template.advantageOfHiring.items.map((item, index) => (
                        <Grid item xs={12} key={`advantage-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <CustomTextField fullWidth label='Item Title' value={item.title} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, advantageOfHiring: { ...prev.template.advantageOfHiring, items: prev.template.advantageOfHiring.items.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Item Description (HTML)
                              </Typography>
                              <HtmlEditorField value={item.description} onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, advantageOfHiring: { ...prev.template.advantageOfHiring, items: prev.template.advantageOfHiring.items.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={2}><Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, advantageOfHiring: { ...prev.template.advantageOfHiring, items: prev.template.advantageOfHiring.items.length > 1 ? prev.template.advantageOfHiring.items.filter((_, idx) => idx !== index) : prev.template.advantageOfHiring.items } } }))}>-</Button></Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, advantageOfHiring: { ...prev.template.advantageOfHiring, items: [...prev.template.advantageOfHiring.items, { title: '', description: '' }] } } }))}>
                          Add Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion expanded={expanded === 'faq'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'faq' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>FAQs</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {form.template.faq.map((item, index) => (
                        <Grid item xs={12} key={`faq-item-${index}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={5}>
                              <CustomTextField fullWidth label='Question' value={item.question} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, faq: prev.template.faq.map((it, idx) => (idx === index ? { ...it, question: e.target.value ?? '' } : it)) } }))} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <CustomTextField fullWidth multiline rows={3} label='Answer' value={item.answer} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, faq: prev.template.faq.map((it, idx) => (idx === index ? { ...it, answer: e.target.value ?? '' } : it)) } }))} />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button color='error' fullWidth onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, faq: prev.template.faq.length > 1 ? prev.template.faq.filter((_, idx) => idx !== index) : prev.template.faq } }))}>
                                <Icon icon='tabler:trash' />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, faq: [...prev.template.faq, { question: '', answer: '' }] } }))}>
                          Add FAQ
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default SubHiringForm
