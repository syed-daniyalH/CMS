import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/custom-components/media/GlobalImageUploader'
import TechnologyHeadsMultiSelect, { headIdsFromPopulated } from 'src/@core/dropdown-selectors/TechnologyHeadsMultiSelect'
import TechnologyServicesMultiSelect, { serviceIdsFromPopulated } from 'src/@core/dropdown-selectors/TechnologyServicesMultiSelect'
import { uploadPendingFromRef } from 'src/custom-components/media/uploadOnSubmit'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { stateFromHTML } from 'draft-js-import-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type WhyTechItem = { title: string; description: string; icon: string; iconAlt: string }
type WhyItem = { title: string; description: string }
type WhatItem = { title: string; description: string }
type CardItem = { title: string; description: string }
type FaqItem = { question: string; answer: string }

type HeroSlide = {
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  ctaText: string
  ctaLink: string
}

const fromHeroSlides = (data: any): HeroSlide[] => {
  if (Array.isArray(data?.heroSlides) && data.heroSlides.length) {
    return data.heroSlides.map((s: any) => ({
      title: `${s?.title ?? ''}`,
      subtitle: `${s?.subtitle ?? ''}`,
      description: `${s?.description ?? ''}`,
      image: `${s?.image ?? ''}`,
      imageAlt: `${s?.imageAlt ?? ''}`,
      ctaText: `${s?.ctaText ?? ''}`,
      ctaLink: `${s?.ctaLink ?? ''}`
    }))
  }
  const h = data?.hero ?? {}
  return [
    {
      title: `${h?.title ?? ''}`,
      subtitle: `${h?.subtitle ?? ''}`,
      description: `${h?.description ?? ''}`,
      image: `${h?.image ?? ''}`,
      imageAlt: `${h?.imageAlt ?? ''}`,
      ctaText: `${h?.ctaText ?? ''}`,
      ctaLink: `${h?.ctaLink ?? ''}`
    }
  ]
}

type TemplateForm = {
  heroSlides: HeroSlide[]
  whyTechTitle: string
  whyTechDescription: string
  whyTechItems: WhyTechItem[]
  whyTitle: string
  whyDescription: string
  whyItems: WhyItem[]
  whatTitle: string
  whatDescription: string
  whatItems: WhatItem[]
  solutionsTitle: string
  solutionsDescription: string
  solutionCards: CardItem[]
  outsourcingTitle: string
  outsourcingDescription: string
  outsourcingItems: CardItem[]
  extraSectionTitle: string
  extraSectionDescription: string
  extraSectionButtonLabel: string
  extraSectionButtonUrl: string
  faq: FaqItem[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonLabel: string
  ctaButtonUrl: string
  ctaImageUrl: string
  ctaImageAlt: string
}

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), {
  ssr: false
})

const toEditorState = (html: string) => {
  if (typeof window === 'undefined') return EditorState.createWithContent(ContentState.createFromText(''))
  try {
    const content = stateFromHTML(html || '')
    return EditorState.createWithContent(content)
  } catch (_error) {
    return EditorState.createWithContent(ContentState.createFromText(''))
  }
}

const normalizeDefaultInlineTextColor = (html: string) =>
  `${html || ''}`
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000000\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000\s*;?/gi, 'color: rgb(255,255,255);')

const HtmlEditorField = ({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) => {
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
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        '& .rdw-editor-toolbar': { border: 'none', borderBottom: '1px solid', borderColor: 'divider', mb: 0 },
        '& .rdw-editor-main': { minHeight: 120, px: 2, py: 1 }
      }}
    >
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

type FormState = {
  name: string
  slug: string
  description: string
  shortDescription: string
  imageUrl: string
  iconUrl: string
  isActive: boolean
  sortOrder: number
  metaTitle: string
  metaDescription: string
  metaKeyWords: string
  metaId: number
  headIds: string[]
  serviceIds: string[]
  template: TemplateForm
}

const defaultTemplate = (): TemplateForm => ({
  heroSlides: [{ title: '', subtitle: '', description: '', image: '', imageAlt: '', ctaText: '', ctaLink: '' }],
  whyTechTitle: '',
  whyTechDescription: '',
  whyTechItems: [{ title: '', description: '', icon: '', iconAlt: '' }],
  whyTitle: '',
  whyDescription: '',
  whyItems: [{ title: '', description: '' }],
  whatTitle: '',
  whatDescription: '',
  whatItems: [{ title: '', description: '' }],
  solutionsTitle: '',
  solutionsDescription: '',
  solutionCards: [{ title: '', description: '' }],
  outsourcingTitle: '',
  outsourcingDescription: '',
  outsourcingItems: [{ title: '', description: '' }],
  extraSectionTitle: '',
  extraSectionDescription: '',
  extraSectionButtonLabel: '',
  extraSectionButtonUrl: '',
  faq: [{ question: '', answer: '' }],
  ctaTitle: '',
  ctaDescription: '',
  ctaButtonLabel: '',
  ctaButtonUrl: '',
  ctaImageUrl: '',
  ctaImageAlt: ''
})

const defaultForm = (): FormState => ({
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  imageUrl: '',
  iconUrl: '',
  isActive: true,
  sortOrder: 0,
  metaTitle: '',
  metaDescription: '',
  metaKeyWords: '',
  metaId: 0,
  headIds: [],
  serviceIds: [],
  template: defaultTemplate()
})

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const fromTemplateData = (data: any): TemplateForm => ({
  heroSlides: fromHeroSlides(data),
  whyTechTitle: `${data?.whyChooseTechnology?.title ?? ''}`,
  whyTechDescription: `${data?.whyChooseTechnology?.description ?? ''}`,
  whyTechItems: Array.isArray(data?.whyChooseTechnology?.items) && data.whyChooseTechnology.items.length
    ? data.whyChooseTechnology.items.map((item: any) => ({
      title: `${item?.title ?? ''}`,
      description: `${item?.description ?? ''}`,
      icon: `${item?.icon ?? ''}`,
      iconAlt: `${item?.iconAlt ?? ''}`
    }))
    : [{ title: '', description: '', icon: '', iconAlt: '' }],
  whyTitle: `${data?.whyChooseTechionik?.title ?? ''}`,
  whyDescription: `${data?.whyChooseTechionik?.description ?? ''}`,
  whyItems: Array.isArray(data?.whyChooseTechionik?.items) && data.whyChooseTechionik.items.length
    ? data.whyChooseTechionik.items.map((item: any) => ({ title: `${item?.title ?? ''}`, description: `${item?.description ?? ''}` }))
    : [{ title: '', description: '' }],
  whatTitle: `${data?.whatWeDo?.title ?? ''}`,
  whatDescription: `${data?.whatWeDo?.description ?? ''}`,
  whatItems: Array.isArray(data?.whatWeDo?.items) && data.whatWeDo.items.length
    ? data.whatWeDo.items.map((item: any) => ({ title: `${item?.title ?? ''}`, description: `${item?.description ?? ''}` }))
    : [{ title: '', description: '' }],
  solutionsTitle: `${data?.solutionsWeDeliver?.title ?? ''}`,
  solutionsDescription: `${data?.solutionsWeDeliver?.description ?? ''}`,
  solutionCards: Array.isArray(data?.solutionsWeDeliver?.cards) && data.solutionsWeDeliver.cards.length
    ? data.solutionsWeDeliver.cards.map((item: any) => ({ title: `${item?.title ?? ''}`, description: `${item?.description ?? ''}` }))
    : [{ title: '', description: '' }],
  outsourcingTitle: `${data?.ourOutsourcingModels?.title ?? ''}`,
  outsourcingDescription: `${data?.ourOutsourcingModels?.description ?? ''}`,
  outsourcingItems: Array.isArray(data?.ourOutsourcingModels?.items) && data.ourOutsourcingModels.items.length
    ? data.ourOutsourcingModels.items.map((item: any) => ({ title: `${item?.title ?? ''}`, description: `${item?.description ?? ''}` }))
    : [{ title: '', description: '' }],
  extraSectionTitle: `${data?.extraSection?.title ?? ''}`,
  extraSectionDescription: `${data?.extraSection?.description ?? ''}`,
  extraSectionButtonLabel: `${data?.extraSection?.buttonLabel ?? ''}`,
  extraSectionButtonUrl: `${data?.extraSection?.buttonUrl ?? ''}`,
  faq: Array.isArray(data?.faq) && data.faq.length
    ? data.faq.map((item: any) => ({ question: `${item?.question ?? ''}`, answer: `${item?.answer ?? ''}` }))
    : [{ question: '', answer: '' }],
  ctaTitle: `${data?.cta?.title ?? ''}`,
  ctaDescription: `${data?.cta?.description ?? ''}`,
  ctaButtonLabel: `${data?.cta?.buttonLabel ?? ''}`,
  ctaButtonUrl: `${data?.cta?.buttonUrl ?? ''}`,
  ctaImageUrl: `${data?.cta?.image ?? ''}`,
  ctaImageAlt: `${data?.cta?.imageAlt ?? ''}`
})

const headIdsFromItem = (item: any): string[] => {
  if (Array.isArray(item?.headIds) && item.headIds.length) return item.headIds.map((id: any) => `${id}`.trim()).filter(Boolean)
  return headIdsFromPopulated(item?.heads ?? item?.technologyHeads)
}

const serviceIdsFromItem = (item: any): string[] => {
  if (Array.isArray(item?.serviceIds) && item.serviceIds.length) return item.serviceIds.map((id: any) => `${id}`.trim()).filter(Boolean)
  return serviceIdsFromPopulated(item?.services)
}

const toTemplateData = (template: TemplateForm) => ({
  heroSlides: template.heroSlides
    .map(s => ({
      title: s.title.trim(),
      subtitle: s.subtitle.trim(),
      description: s.description?.trim() || undefined,
      image: s.image.trim(),
      imageAlt: s.imageAlt?.trim() || undefined,
      ctaText: s.ctaText?.trim() || undefined,
      ctaLink: s.ctaLink?.trim() || undefined
    }))
    .filter(s => s.title || s.subtitle || s.image || s.imageAlt || s.description || s.ctaText || s.ctaLink),
  whyChooseTechnology: {
    title: template.whyTechTitle.trim(),
    description: template.whyTechDescription || '',
    items: template.whyTechItems
      .map(item => ({ title: item.title.trim(), description: item.description.trim(), icon: item.icon.trim(), iconAlt: item.iconAlt.trim() }))
      .filter(item => item.title || item.description || item.icon || item.iconAlt)
  },
  whyChooseTechionik: {
    title: template.whyTitle.trim(),
    description: template.whyDescription || '',
    items: template.whyItems
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  whatWeDo: {
    title: template.whatTitle.trim(),
    description: template.whatDescription || '',
    items: template.whatItems
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  solutionsWeDeliver: {
    title: template.solutionsTitle.trim(),
    description: template.solutionsDescription || '',
    cards: template.solutionCards
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  ourOutsourcingModels: {
    title: template.outsourcingTitle.trim(),
    description: template.outsourcingDescription || '',
    items: template.outsourcingItems
      .map(item => ({ title: item.title.trim(), description: item.description.trim() }))
      .filter(item => item.title || item.description)
  },
  extraSection: {
    title: template.extraSectionTitle.trim(),
    description: template.extraSectionDescription || '',
    buttonLabel: template.extraSectionButtonLabel.trim(),
    buttonUrl: template.extraSectionButtonUrl.trim()
  },
  faq: template.faq
    .map(item => ({ question: item.question.trim(), answer: item.answer.trim() }))
    .filter(item => item.question || item.answer),
  cta: {
    title: template.ctaTitle.trim(),
    description: template.ctaDescription || '',
    buttonLabel: template.ctaButtonLabel.trim(),
    buttonUrl: template.ctaButtonUrl.trim(),
    image: template.ctaImageUrl.trim(),
    imageAlt: template.ctaImageAlt.trim()
  }
})

const TechnologyForm = () => {
  const router = useRouter()
  const mode = `${router.query?.mode ?? 'create'}` === 'edit' ? 'edit' : 'create'
  const slugParam = `${router.query?.slug ?? ''}`.trim()

  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [expanded, setExpanded] = useState<string | false>('hero')
  const [form, setForm] = useState<FormState>(defaultForm())
  const imageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const iconUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const heroSlideUploaderRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const whyTechIconUploaderRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const ctaImageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)

  useEffect(() => {
    if (slugTouched) return
    setForm(prev => ({ ...prev, slug: slugify(prev.name) }))
  }, [form.name, slugTouched])

  useEffect(() => {
    if (mode !== 'edit' || !slugParam) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/menu-structure/technologies/${encodeURIComponent(slugParam)}`)
        const item = res?.data?.data ?? res?.data ?? {}
        setForm({
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? slugParam}`,
          description: `${item?.description ?? ''}`,
          shortDescription: `${item?.shortDescription ?? ''}`,
          imageUrl: `${item?.imageUrl ?? ''}`,
          iconUrl: `${item?.iconUrl ?? ''}`,
          isActive: item?.isActive ?? true,
          sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : Number(item?.sortOrder ?? 0) || 0,
          metaTitle: `${item?.metaTitle ?? ''}`,
          metaDescription: `${item?.metaDescription ?? ''}`,
          metaKeyWords: `${item?.metaKeyWords ?? ''}`,
          metaId: typeof item?.metaId === 'number' ? item.metaId : Number(item?.metaId ?? 0) || 0,
          headIds: headIdsFromItem(item),
          serviceIds: serviceIdsFromItem(item),
          template: fromTemplateData(item?.templateData ?? {})
        })
        setSlugTouched(true)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load technology.')
      } finally {
        setLoading(false)
      }
    }
    load().then(() => null)
  }, [mode, slugParam])

  const save = async () => {
    if (!form.name.trim()) return toast.error('Technology name is required.')
    if (!form.slug.trim()) return toast.error('Technology slug is required.')
    setLoading(true)
    const uploadedImageUrl = await uploadPendingFromRef(imageUploaderRef.current, form.imageUrl)
    const uploadedIconUrl = await uploadPendingFromRef(iconUploaderRef.current, form.iconUrl)
    const hs = form.template.heroSlides
    const uploadedHeroImages = await Promise.all(
      hs.map((s, i) => uploadPendingFromRef(heroSlideUploaderRefs.current[i] ?? null, s.image))
    )
    const nextHeroSlides = hs.map((s, i) => ({ ...s, image: uploadedHeroImages[i].trim() }))
    const uploadedCtaImageUrl = await uploadPendingFromRef(ctaImageUploaderRef.current, form.template.ctaImageUrl)
    const uploadedWhyTechItems = await Promise.all(
      form.template.whyTechItems.map((item, i) =>
        uploadPendingFromRef(whyTechIconUploaderRefs.current[i] ?? null, item.icon).then(icon => ({ ...item, icon: icon.trim() }))
      )
    )
    const nextTemplate = { ...form.template, heroSlides: nextHeroSlides, ctaImageUrl: uploadedCtaImageUrl.trim(), whyTechItems: uploadedWhyTechItems }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      imageUrl: uploadedImageUrl.trim(),
      iconUrl: uploadedIconUrl.trim(),
      templateData: toTemplateData(nextTemplate),
      headIds: form.headIds,
      serviceIds: form.serviceIds,
      isActive: !!form.isActive,
      sortOrder: Number(form.sortOrder ?? 0) || 0,
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      metaKeyWords: form.metaKeyWords.trim(),
      metaId: Number(form.metaId ?? 0) || 0
    }
    try {
      if (mode === 'edit') {
        await axiosInstance.put(`/api/menu-structure/technologies/${encodeURIComponent(slugParam)}`, payload)
        toast.success('Technology updated successfully.')
      } else {
        await axiosInstance.post('/api/menu-structure/technologies', payload)
        toast.success('Technology created successfully.')
      }
      router.push('/technologies/list')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save technology.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant='h5'>{mode === 'edit' ? 'Edit Technology' : 'Add Technology'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => router.push('/technologies/list')}>
              Back
            </Button>
            <Button variant='contained' onClick={save}>
              {mode === 'edit' ? 'Update Technology' : 'Create Technology'}
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
              <CustomTextField fullWidth label='Name' value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value ?? '' }))} />
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
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Icon URL' value={form.iconUrl} onChange={e => setForm(prev => ({ ...prev, iconUrl: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Sort order'
                value={form.sortOrder}
                onChange={e => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value ?? 0) || 0 }))}
              />
            </Grid>
            <Grid item xs={12}>
              <GlobalImageUploader
                ref={imageUploaderRef}
                label='Technology image'
                folder='images/technologies'
                type='technology'
                entityId={form.slug || form.name}
                uploadOnSubmit
                multiple={false}
                altText={form.name || 'technology-image'}
                value={form.imageUrl}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setForm(prev => ({ ...prev, imageUrl: url }))
                }}
                onClear={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <GlobalImageUploader
                ref={iconUploaderRef}
                label='Technology icon'
                folder='images/technologies'
                type='technology'
                entityId={`${form.slug || form.name || 'tech'}-icon`}
                uploadOnSubmit
                multiple={false}
                altText={`${form.name || 'technology'}-icon`}
                value={form.iconUrl}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setForm(prev => ({ ...prev, iconUrl: url }))
                }}
                onClear={() => setForm(prev => ({ ...prev, iconUrl: '' }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Status' value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <TechnologyHeadsMultiSelect
                label='Technology heads'
                value={form.headIds}
                onChange={ids => setForm(prev => ({ ...prev, headIds: ids }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TechnologyServicesMultiSelect
                label='Services'
                value={form.serviceIds}
                onChange={ids => setForm(prev => ({ ...prev, serviceIds: ids }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth multiline rows={3} label='Short Description' value={form.shortDescription} onChange={e => setForm(prev => ({ ...prev, shortDescription: e.target.value ?? '' }))} />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField fullWidth multiline rows={3} label='Description' value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value ?? '' }))} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 1 }}>
                SEO
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Meta Title' value={form.metaTitle} onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Meta ID'
                value={form.metaId}
                onChange={e => setForm(prev => ({ ...prev, metaId: Number(e.target.value ?? 0) || 0 }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label='Meta Description'
                value={form.metaDescription}
                onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value ?? '' }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='Meta Keywords' value={form.metaKeyWords} onChange={e => setForm(prev => ({ ...prev, metaKeyWords: e.target.value ?? '' }))} />
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
                  '& .MuiAccordionSummary-root': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
              <Accordion sx={{ order: 0 }} expanded={expanded === 'hero'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'hero' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>Hero Slides</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {form.template.heroSlides.map((slide, index) => (
                      <Grid item xs={12} key={`hero-${index}`}>
                        <Typography variant='caption' color='text.secondary'>
                          Slide {index + 1}
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                          <Grid item xs={12} md={6}>
                            <CustomTextField
                              fullWidth
                              label='Title'
                              value={slide.title}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, title: e.target.value ?? '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <CustomTextField
                              fullWidth
                              label='Subtitle'
                              value={slide.subtitle}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, subtitle: e.target.value ?? '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomTextField
                              fullWidth
                              multiline
                              rows={2}
                              label='Description'
                              value={slide.description ?? ''}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, description: e.target.value ?? '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <GlobalImageUploader
                              key={`hero-slide-img-${index}`}
                              ref={el => {
                                heroSlideUploaderRefs.current[index] = el
                              }}
                              label={`Slide ${index + 1} — Hero image`}
                              folder='images/technologies'
                              type='technology'
                              entityId={`${form.slug || form.name || 'technology'}-hero-${index}`}
                              uploadOnSubmit
                              multiple={false}
                              altText={slide.imageAlt?.trim() || slide.title?.trim() || `technology-hero-slide-${index + 1}`}
                              value={slide.image}
                              onUploaded={items => {
                                const url = `${items?.[0]?.secureUrl || items?.[0]?.url || ''}`.trim()
                                if (url)
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, image: url } : s))
                                    }
                                  }))
                              }}
                              onClear={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, image: '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              fullWidth
                              label='Hero Image Alt'
                              value={slide.imageAlt ?? ''}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, imageAlt: e.target.value ?? '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              fullWidth
                              label='CTA Text'
                              value={slide.ctaText ?? ''}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, ctaText: e.target.value ?? '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              fullWidth
                              label='CTA Link'
                              value={slide.ctaLink ?? ''}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides: prev.template.heroSlides.map((s, i) => (i === index ? { ...s, ctaLink: e.target.value ?? '' } : s))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              color='error'
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    heroSlides:
                                      prev.template.heroSlides.length > 1
                                        ? prev.template.heroSlides.filter((_, i) => i !== index)
                                        : prev.template.heroSlides
                                  }
                                }))
                              }
                            >
                              Remove slide
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}>
                      <Button
                        variant='outlined'
                        startIcon={<Icon icon='tabler:plus' />}
                        onClick={() =>
                          setForm(prev => ({
                            ...prev,
                            template: {
                              ...prev.template,
                              heroSlides: [
                                ...prev.template.heroSlides,
                                { title: '', subtitle: '', description: '', image: '', imageAlt: '', ctaText: '', ctaLink: '' }
                              ]
                            }
                          }))
                        }
                      >
                        Add Hero Slide
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 1 }} expanded={expanded === 'whyTech'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'whyTech' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>Why choose this technology</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField
                        fullWidth
                        label='Section title'
                        value={form.template.whyTechTitle}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, whyTechTitle: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.whyTechDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, whyTechDescription: nextValue } }))}
                      />
                    </Grid>
                    {form.template.whyTechItems.map((item, index) => (
                      <Grid item xs={12} key={`why-tech-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              fullWidth
                              label='Item title'
                              value={item.title}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyTechItems: prev.template.whyTechItems.map((it, idx) =>
                                      idx === index ? { ...it, title: e.target.value ?? '' } : it
                                    )
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                              Description (HTML)
                            </Typography>
                            <HtmlEditorField
                              value={item.description}
                              onChange={nextValue =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyTechItems: prev.template.whyTechItems.map((it, idx) =>
                                      idx === index ? { ...it, description: nextValue } : it
                                    )
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <GlobalImageUploader
                              ref={el => {
                                whyTechIconUploaderRefs.current[index] = el
                              }}
                              label={`Item ${index + 1} Icon`}
                              folder='images/technologies'
                              type='technology'
                              entityId={`${form.slug || form.name || 'technology'}-why-tech-icon-${index}`}
                              uploadOnSubmit
                              multiple={false}
                              altText={item.iconAlt?.trim() || `why-tech-item-${index + 1}-icon`}
                              value={item.icon}
                              onUploaded={items => {
                                const url = `${items?.[0]?.secureUrl || items?.[0]?.url || ''}`.trim()
                                if (url)
                                  setForm(prev => ({
                                    ...prev,
                                    template: {
                                      ...prev.template,
                                      whyTechItems: prev.template.whyTechItems.map((it, idx) => (idx === index ? { ...it, icon: url } : it))
                                    }
                                  }))
                              }}
                              onClear={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyTechItems: prev.template.whyTechItems.map((it, idx) => (idx === index ? { ...it, icon: '' } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <CustomTextField
                              fullWidth
                              label='Image Alt'
                              value={item.iconAlt ?? ''}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyTechItems: prev.template.whyTechItems.map((it, idx) =>
                                      idx === index ? { ...it, iconAlt: e.target.value ?? '' } : it
                                    )
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Button
                              color='error'
                              fullWidth
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyTechItems:
                                      prev.template.whyTechItems.length > 1
                                        ? prev.template.whyTechItems.filter((_, idx) => idx !== index)
                                        : prev.template.whyTechItems
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
                                whyTechItems: [...prev.template.whyTechItems, { title: '', description: '', icon: '', iconAlt: '' } as WhyTechItem]
                            }
                          }))
                        }
                      >
                        Add item
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 4 }} expanded={expanded === 'what'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'what' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>What We Do</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.whatDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, whatDescription: nextValue } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField fullWidth label='Section Title' value={form.template.whatTitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, whatTitle: e.target.value ?? '' } }))} />
                    </Grid>
                    {form.template.whatItems.map((item, index) => (
                      <Grid item xs={12} key={`what-${index}`}>
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
                                    whatItems: prev.template.whatItems.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                              Description Editor (HTML)
                            </Typography>
                            <HtmlEditorField
                              value={item.description}
                              onChange={nextValue =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whatItems: prev.template.whatItems.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Button
                              color='error'
                              fullWidth
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whatItems: prev.template.whatItems.length > 1 ? prev.template.whatItems.filter((_, idx) => idx !== index) : prev.template.whatItems
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
                      <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, whatItems: [...prev.template.whatItems, { title: '', description: '' }] } }))}>
                        Add What We Do Item
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 5 }} expanded={expanded === 'solutions'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'solutions' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>Solutions We Deliver</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.solutionsDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsDescription: nextValue } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField fullWidth label='Section Title' value={form.template.solutionsTitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, solutionsTitle: e.target.value ?? '' } }))} />
                    </Grid>
                    {form.template.solutionCards.map((item, index) => (
                      <Grid item xs={12} key={`solution-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              fullWidth
                              label='Card Title'
                              value={item.title}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    solutionCards: prev.template.solutionCards.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                              Description Editor (HTML)
                            </Typography>
                            <HtmlEditorField
                              value={item.description}
                              onChange={nextValue =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    solutionCards: prev.template.solutionCards.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Button
                              color='error'
                              fullWidth
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    solutionCards:
                                      prev.template.solutionCards.length > 1
                                        ? prev.template.solutionCards.filter((_, idx) => idx !== index)
                                        : prev.template.solutionCards
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
                      <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, solutionCards: [...prev.template.solutionCards, { title: '', description: '' }] } }))}>
                        Add Solution Card
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 6 }} expanded={expanded === 'outsourcing'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'outsourcing' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>Our Outsourcing Models</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField
                        fullWidth
                        label='Section Title'
                        value={form.template.outsourcingTitle}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, outsourcingTitle: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        Section Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.outsourcingDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, outsourcingDescription: nextValue } }))}
                      />
                    </Grid>
                    {form.template.outsourcingItems.map((item, index) => (
                      <Grid item xs={12} key={`outsourcing-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <CustomTextField
                              fullWidth
                              label='Model Title'
                              value={item.title}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    outsourcingItems: prev.template.outsourcingItems.map((it, idx) =>
                                      idx === index ? { ...it, title: e.target.value ?? '' } : it
                                    )
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                              Model Description (HTML)
                            </Typography>
                            <HtmlEditorField
                              value={item.description}
                              onChange={nextValue =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    outsourcingItems: prev.template.outsourcingItems.map((it, idx) =>
                                      idx === index ? { ...it, description: nextValue } : it
                                    )
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Button
                              color='error'
                              fullWidth
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    outsourcingItems:
                                      prev.template.outsourcingItems.length > 1
                                        ? prev.template.outsourcingItems.filter((_, idx) => idx !== index)
                                        : prev.template.outsourcingItems
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
                              outsourcingItems: [...prev.template.outsourcingItems, { title: '', description: '' }]
                            }
                          }))
                        }
                      >
                        Add Outsourcing Model
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 2 }} expanded={expanded === 'why'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'why' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>Why Choose Techionik</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomTextField
                        fullWidth
                        label='Section Title'
                        value={form.template.whyTitle}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, whyTitle: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.whyDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, whyDescription: nextValue } }))}
                      />
                    </Grid>
                    {form.template.whyItems.map((item, index) => (
                      <Grid item xs={12} key={`why-${index}`}>
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
                                    whyItems: prev.template.whyItems.map((it, idx) => (idx === index ? { ...it, title: e.target.value ?? '' } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                              Description (HTML)
                            </Typography>
                            <HtmlEditorField
                              value={item.description}
                              onChange={nextValue =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyItems: prev.template.whyItems.map((it, idx) => (idx === index ? { ...it, description: nextValue } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Button
                              color='error'
                              fullWidth
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    whyItems: prev.template.whyItems.length > 1 ? prev.template.whyItems.filter((_, idx) => idx !== index) : prev.template.whyItems
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
                            template: { ...prev.template, whyItems: [...prev.template.whyItems, { title: '', description: '' }] }
                          }))
                        }
                      >
                        Add Why Item
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 1 }} expanded={expanded === 'extra'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'extra' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>Action Section</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label='Title'
                        value={form.template.extraSectionTitle}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, extraSectionTitle: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <CustomTextField
                        fullWidth
                        label='Button Label'
                        value={form.template.extraSectionButtonLabel}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, extraSectionButtonLabel: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <CustomTextField
                        fullWidth
                        label='Button Link'
                        value={form.template.extraSectionButtonUrl}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, extraSectionButtonUrl: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.extraSectionDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, extraSectionDescription: nextValue } }))}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 7 }} expanded={expanded === 'faq'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'faq' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>FAQ</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {form.template.faq.map((item, index) => (
                      <Grid item xs={12} key={`faq-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={5}>
                            <CustomTextField
                              fullWidth
                              label='Question'
                              value={item.question}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    faq: prev.template.faq.map((it, idx) => (idx === index ? { ...it, question: e.target.value ?? '' } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <CustomTextField
                              fullWidth
                              multiline
                              rows={3}
                              label='Answer'
                              value={item.answer}
                              onChange={e =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    faq: prev.template.faq.map((it, idx) => (idx === index ? { ...it, answer: e.target.value ?? '' } : it))
                                  }
                                }))
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={1}>
                            <Button
                              color='error'
                              fullWidth
                              onClick={() =>
                                setForm(prev => ({
                                  ...prev,
                                  template: {
                                    ...prev.template,
                                    faq: prev.template.faq.length > 1 ? prev.template.faq.filter((_, idx) => idx !== index) : prev.template.faq
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
                      <Button variant='outlined' onClick={() => setForm(prev => ({ ...prev, template: { ...prev.template, faq: [...prev.template.faq, { question: '', answer: '' }] } }))}>
                        Add FAQ
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ order: 3 }} expanded={expanded === 'cta'} onChange={(_, isExpanded) => setExpanded(isExpanded ? 'cta' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                  <Typography variant='subtitle2'>CTA</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <CustomTextField fullWidth label='CTA Title' value={form.template.ctaTitle} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, ctaTitle: e.target.value ?? '' } }))} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                        CTA Description (HTML)
                      </Typography>
                      <HtmlEditorField
                        value={form.template.ctaDescription}
                        onChange={nextValue => setForm(prev => ({ ...prev, template: { ...prev.template, ctaDescription: nextValue } }))}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomTextField fullWidth label='Button Label' value={form.template.ctaButtonLabel} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, ctaButtonLabel: e.target.value ?? '' } }))} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <CustomTextField fullWidth label='Button URL' value={form.template.ctaButtonUrl} onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, ctaButtonUrl: e.target.value ?? '' } }))} />
                    </Grid>
                    <Grid item xs={4}>
                      <CustomTextField
                        fullWidth
                        label='CTA Image Alt'
                        value={form.template.ctaImageAlt}
                        onChange={e => setForm(prev => ({ ...prev, template: { ...prev.template, ctaImageAlt: e.target.value ?? '' } }))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <GlobalImageUploader
                        ref={ctaImageUploaderRef}
                        label='CTA Image'
                        folder='images/technologies'
                        type='technology'
                        entityId={`${form.slug || form.name}-cta`}
                        uploadOnSubmit
                        multiple={false}
                        altText={form.template.ctaImageAlt || form.template.ctaTitle || 'technology-cta-image'}
                        value={form.template.ctaImageUrl}
                        onUploaded={items => {
                          const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                          if (url) setForm(prev => ({ ...prev, template: { ...prev.template, ctaImageUrl: url } }))
                        }}
                        onClear={() => setForm(prev => ({ ...prev, template: { ...prev.template, ctaImageUrl: '' } }))}
                      />
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

export default TechnologyForm
