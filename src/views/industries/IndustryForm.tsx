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
import Icon from 'src/core/components/icon'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/components/media/GlobalImageUploader'
import { uploadPendingFromRef } from 'src/components/media/uploadOnSubmit'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { stateFromHTML } from 'draft-js-import-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/** Matches CMS templateData for industries (ServicesCMS in Swagger). */
export type HeroSlide = {
  title: string
  subtitle: string
  description?: string
  image: string
  imageAlt?: string
  ctaText?: string
  ctaLink?: string
}

export type Reviews = { image1: string; width: number; height: number }

export type WhatYouGet = {
  id: number
  title1: string
  spanTitle: string
  title2: string
  reviews: Reviews[]
  RightDescription1: string
}

export type SolutionItem = { id: number; title: string; description: string }

export type SoftwareSolutions = {
  title: string
  middleTitle: string
  description: string
  lastTitle?: string
  items: SolutionItem[]
}

export type TTechnologyExpertiseCardData = {
  id: number
  title: string
  description: string[]
  icon: string
}

export type TechnologyExpertise = {
  mainTitle: string
  mainDescription?: string
  cards: TTechnologyExpertiseCardData[]
}

type TechCardForm = TTechnologyExpertiseCardData & { _descriptionText?: string }

type TechnologyExpertiseForm = {
  mainTitle: string
  mainDescription?: string
  cards: TechCardForm[]
}

type TemplateForm = {
  heroSlides: HeroSlide[]
  whatYouGet: WhatYouGet
  softwareSolutions: SoftwareSolutions
  technologyExpertise: TechnologyExpertiseForm
  ctaTitle: string
  ctaDescription: string
  ctaButtonLabel: string
  ctaButtonUrl: string
  ctaImageUrl: string
  ctaImageAlt: string
}

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

const toEditorState = (html: string) => {
  if (typeof window === 'undefined') return EditorState.createWithContent(ContentState.createFromText(''))
  try {
    return EditorState.createWithContent(stateFromHTML(html || ''))
  } catch {
    return EditorState.createWithContent(ContentState.createFromText(''))
  }
}

const normalizeDefaultInlineTextColor = (html: string) =>
  `${html || ''}`
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000000\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000\s*;?/gi, 'color: rgb(255,255,255);')

const HtmlEditorField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
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

const defaultTemplate = (): TemplateForm => ({
  heroSlides: [{ title: '', subtitle: '', description: '', image: '', imageAlt: '', ctaText: '', ctaLink: '' }],
  whatYouGet: {
    id: 0,
    title1: '',
    spanTitle: '',
    title2: '',
    reviews: [{ image1: '', width: 0, height: 0 }],
    RightDescription1: ''
  },
  softwareSolutions: {
    title: '',
    middleTitle: '',
    description: '',
    lastTitle: '',
    items: [{ id: 0, title: '', description: '' }]
  },
  technologyExpertise: {
    mainTitle: '',
    mainDescription: '',
    cards: [{ id: 0, title: '', description: [], icon: '', _descriptionText: '' }]
  },
  ctaTitle: '',
  ctaDescription: '',
  ctaButtonLabel: '',
  ctaButtonUrl: '',
  ctaImageUrl: '',
  ctaImageAlt: ''
})

type FormState = {
  name: string
  slug: string
  description: string
  shortDescription: string
  imageUrl: string
  scope: string
  isActive: boolean
  metaTitle: string
  metaDescription: string
  metaKeyWords: string
  metaId: number
  template: TemplateForm
}

const defaultForm = (): FormState => ({
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  imageUrl: '',
  scope: 'blog',
  isActive: true,
  metaTitle: '',
  metaDescription: '',
  metaKeyWords: '',
  metaId: 0,
  template: defaultTemplate()
})

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const cardToForm = (c: any): TechCardForm => ({
  id: typeof c?.id === 'number' ? c.id : Number(c?.id ?? 0) || 0,
  title: `${c?.title ?? ''}`,
  description: Array.isArray(c?.description) ? c.description.map((x: any) => `${x ?? ''}`) : [],
  icon: `${c?.icon ?? ''}`,
  _descriptionText: Array.isArray(c?.description) ? c.description.join('\n') : ''
})

const fromTemplateData = (data: any): TemplateForm => {
  const heroSlides = Array.isArray(data?.heroSlides) && data.heroSlides.length
    ? data.heroSlides.map((s: any) => ({
        title: `${s?.title ?? ''}`,
        subtitle: `${s?.subtitle ?? ''}`,
        description: `${s?.description ?? ''}`,
        image: `${s?.image ?? ''}`,
        imageAlt: `${s?.imageAlt ?? ''}`,
        ctaText: `${s?.ctaText ?? ''}`,
        ctaLink: `${s?.ctaLink ?? ''}`
      }))
    : defaultTemplate().heroSlides

  const wy = data?.whatYouGet ?? {}
  const whatYouGet: WhatYouGet = {
    id: typeof wy?.id === 'number' ? wy.id : Number(wy?.id ?? 0) || 0,
    title1: `${wy?.title1 ?? ''}`,
    spanTitle: `${wy?.spanTitle ?? ''}`,
    title2: `${wy?.title2 ?? ''}`,
    reviews: Array.isArray(wy?.reviews) && wy.reviews.length
      ? wy.reviews.map((r: any) => ({
          image1: `${r?.image1 ?? ''}`,
          width: typeof r?.width === 'number' ? r.width : Number(r?.width ?? 0) || 0,
          height: typeof r?.height === 'number' ? r.height : Number(r?.height ?? 0) || 0
        }))
      : [{ image1: '', width: 0, height: 0 }],
    RightDescription1: `${wy?.RightDescription1 ?? ''}`
  }

  const ss = data?.softwareSolutions ?? {}
  const softwareSolutions: SoftwareSolutions = {
    title: `${ss?.title ?? ''}`,
    middleTitle: `${ss?.middleTitle ?? ''}`,
    description: `${ss?.description ?? ''}`,
    lastTitle: `${ss?.lastTitle ?? ''}`,
    items: Array.isArray(ss?.items) && ss.items.length
      ? ss.items.map((it: any) => ({
          id: typeof it?.id === 'number' ? it.id : Number(it?.id ?? 0) || 0,
          title: `${it?.title ?? ''}`,
          description: `${it?.description ?? ''}`
        }))
      : [{ id: 0, title: '', description: '' }]
  }

  const te = data?.technologyExpertise ?? {}
  const technologyExpertise = {
    mainTitle: `${te?.mainTitle ?? ''}`,
    mainDescription: `${te?.mainDescription ?? ''}`,
    cards: Array.isArray(te?.cards) && te.cards.length ? te.cards.map((c: any) => cardToForm(c)) : defaultTemplate().technologyExpertise.cards
  }

  const cta = data?.cta ?? {}
  return {
    heroSlides,
    whatYouGet,
    softwareSolutions,
    technologyExpertise,
    ctaTitle: `${cta?.title ?? ''}`,
    ctaDescription: `${cta?.description ?? ''}`,
    ctaButtonLabel: `${cta?.buttonLabel ?? ''}`,
    ctaButtonUrl: `${cta?.buttonUrl ?? ''}`,
    ctaImageUrl: `${cta?.image ?? ''}`,
    ctaImageAlt: `${cta?.imageAlt ?? ''}`
  }
}

const toTemplateData = (t: TemplateForm) => ({
  heroSlides: t.heroSlides
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
  whatYouGet: {
    id: Number(t.whatYouGet.id ?? 0) || 0,
    title1: t.whatYouGet.title1.trim(),
    spanTitle: t.whatYouGet.spanTitle.trim(),
    title2: t.whatYouGet.title2.trim(),
    reviews: t.whatYouGet.reviews
      .map(r => ({
        image1: r.image1.trim(),
        width: Number(r.width ?? 0) || 0,
        height: Number(r.height ?? 0) || 0
      }))
      .filter(r => r.image1 || r.width || r.height),
    RightDescription1: t.whatYouGet.RightDescription1 || ''
  },
  softwareSolutions: {
    title: t.softwareSolutions.title.trim(),
    middleTitle: t.softwareSolutions.middleTitle.trim(),
    description: t.softwareSolutions.description.trim(),
    lastTitle: t.softwareSolutions.lastTitle?.trim() || undefined,
    items: t.softwareSolutions.items
      .map(it => ({
        id: Number(it.id ?? 0) || 0,
        title: it.title.trim(),
        description: it.description.trim()
      }))
      .filter(it => it.title || it.description)
  },
  technologyExpertise: {
    mainTitle: t.technologyExpertise.mainTitle.trim(),
    mainDescription: t.technologyExpertise.mainDescription?.trim() || undefined,
    cards: t.technologyExpertise.cards.map((c, idx) => {
      const lines = `${c._descriptionText ?? (c.description || []).join('\n')}`
        .split('\n')
        .map(x => x.trim())
        .filter(Boolean)
      return {
        id: Number(c.id ?? idx + 1) || idx + 1,
        title: c.title.trim(),
        description: lines,
        icon: c.icon.trim()
      }
    }).filter(c => c.title || c.description.length || c.icon)
  },
  cta: {
    title: t.ctaTitle.trim(),
    description: t.ctaDescription || '',
    buttonLabel: t.ctaButtonLabel.trim(),
    buttonUrl: t.ctaButtonUrl.trim(),
    image: t.ctaImageUrl.trim(),
    imageAlt: t.ctaImageAlt.trim()
  }
})

const IndustryForm = () => {
  const router = useRouter()
  const mode = `${router.query?.mode ?? 'create'}` === 'edit' ? 'edit' : 'create'
  const slugParam = `${router.query?.slug ?? ''}`.trim()

  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [expanded, setExpanded] = useState<string | false>('hero')
  const [form, setForm] = useState<FormState>(defaultForm())
  const imageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const heroSlideUploaderRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const whatYouGetReviewUploaderRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
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
        const res = await axiosInstance.get(`/api/menu-structure/industries/${encodeURIComponent(slugParam)}`)
        const item = res?.data?.data ?? res?.data ?? {}
        setForm({
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? slugParam}`,
          description: `${item?.description ?? ''}`,
          shortDescription: `${item?.shortDescription ?? ''}`,
          imageUrl: `${item?.imageUrl ?? ''}`,
          scope: `${item?.scope ?? 'blog'}`,
          isActive: item?.isActive ?? true,
          metaTitle: `${item?.metaTitle ?? ''}`,
          metaDescription: `${item?.metaDescription ?? ''}`,
          metaKeyWords: `${item?.metaKeyWords ?? ''}`,
          metaId: typeof item?.metaId === 'number' ? item.metaId : Number(item?.metaId ?? 0) || 0,
          template: fromTemplateData(item?.templateData ?? {})
        })
        setSlugTouched(true)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load industry.')
      } finally {
        setLoading(false)
      }
    }
    load().then(() => null)
  }, [mode, slugParam])

  const save = async () => {
    if (!form.name.trim()) return toast.error('Industry name is required.')
    if (!form.slug.trim()) return toast.error('Industry slug is required.')
    setLoading(true)
    const uploadedImageUrl = await uploadPendingFromRef(imageUploaderRef.current, form.imageUrl)
    const slides = form.template.heroSlides
    const uploadedHeroImages = await Promise.all(
      slides.map((s, i) => uploadPendingFromRef(heroSlideUploaderRefs.current[i] ?? null, s.image))
    )
    const nextHeroSlides = slides.map((s, i) => ({ ...s, image: uploadedHeroImages[i].trim() }))
    const uploadedWhatYouGetReviewImages = await Promise.all(
      form.template.whatYouGet.reviews.map((review, index) =>
        uploadPendingFromRef(whatYouGetReviewUploaderRefs.current[index] ?? null, review.image1)
      )
    )
    const nextWhatYouGet = {
      ...form.template.whatYouGet,
      reviews: form.template.whatYouGet.reviews.map((review, index) => ({
        ...review,
        image1: uploadedWhatYouGetReviewImages[index].trim()
      }))
    }
    const uploadedCtaImageUrl = await uploadPendingFromRef(ctaImageUploaderRef.current, form.template.ctaImageUrl)
    const nextTemplate = {
      ...form.template,
      heroSlides: nextHeroSlides,
      whatYouGet: nextWhatYouGet,
      ctaImageUrl: uploadedCtaImageUrl.trim()
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim(),
      imageUrl: uploadedImageUrl.trim(),
      templateData: toTemplateData(nextTemplate),
      scope: form.scope || 'blog',
      isActive: !!form.isActive,
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      metaKeyWords: form.metaKeyWords.trim(),
      metaId: Number(form.metaId ?? 0) || 0
    }
    try {
      if (mode === 'edit') {
        await axiosInstance.put(`/api/menu-structure/industries/${encodeURIComponent(slugParam)}`, payload)
        toast.success('Industry updated successfully.')
      } else {
        await axiosInstance.post('/api/menu-structure/industries', payload)
        toast.success('Industry created successfully.')
      }
      router.push('/industries/list')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save industry.')
    } finally {
      setLoading(false)
    }
  }

  const accordionBoxSx = {
    display: 'flex',
    flexDirection: 'column' as const,
    '& .MuiAccordion-root': {
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '10px !important',
      boxShadow: 'none',
      mb: 2,
      '&:before': { display: 'none' }
    },
    '& .MuiAccordionSummary-root': { bgcolor: 'action.hover' }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5'>{mode === 'edit' ? 'Edit Industry' : 'Add Industry'}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => router.push('/industries/list')}>
              Back
            </Button>
            <Button variant='contained' onClick={save}>
              {mode === 'edit' ? 'Update Industry' : 'Create Industry'}
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
            <Grid item xs={12}>
              <GlobalImageUploader
                ref={imageUploaderRef}
                label='Industry Image'
                folder='images/industries'
                type='industry'
                entityId={form.slug || form.name}
                uploadOnSubmit
                multiple={false}
                altText={form.name || 'industry-image'}
                value={form.imageUrl}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setForm(prev => ({ ...prev, imageUrl: url }))
                }}
                onClear={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField select fullWidth label='Scope' value={form.scope} onChange={e => setForm(prev => ({ ...prev, scope: e.target.value ?? 'blog' }))}>
                <MenuItem value='blog'>blog</MenuItem>
                <MenuItem value='case-study'>case-study</MenuItem>
                <MenuItem value='service'>service</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField select fullWidth label='Status' value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth multiline rows={2} label='Short Description' value={form.shortDescription} onChange={e => setForm(prev => ({ ...prev, shortDescription: e.target.value ?? '' }))} />
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
              <CustomTextField fullWidth type='number' label='Meta ID' value={form.metaId} onChange={e => setForm(prev => ({ ...prev, metaId: Number(e.target.value ?? 0) || 0 }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth multiline rows={2} label='Meta Description' value={form.metaDescription} onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='Meta Keywords' value={form.metaKeyWords} onChange={e => setForm(prev => ({ ...prev, metaKeyWords: e.target.value ?? '' }))} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
                Template Data
              </Typography>
              <Box sx={accordionBoxSx}>
                <Accordion sx={{ order: 0 }} expanded={expanded === 'hero'} onChange={(_, o) => setExpanded(o ? 'hero' : false)}>
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
                              <CustomTextField fullWidth label='Title' value={slide.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, title: e.target.value ?? '' } : s)) } }))} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <CustomTextField fullWidth label='Subtitle' value={slide.subtitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, subtitle: e.target.value ?? '' } : s)) } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <CustomTextField fullWidth multiline rows={2} label='Description' value={slide.description ?? ''} onChange={e => setForm(p => ({ ...p, template: { ...p.template, heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, description: e.target.value ?? '' } : s)) } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <GlobalImageUploader
                                key={`hero-slide-img-${index}`}
                                ref={el => {
                                  heroSlideUploaderRefs.current[index] = el
                                }}
                                label={`Slide ${index + 1} — Hero image`}
                                folder='images/industries'
                                type='industry'
                                entityId={`${form.slug || 'industry'}-hero-${index}`}
                                uploadOnSubmit
                                multiple={false}
                                altText={slide.imageAlt?.trim() || slide.title?.trim() || `industry-hero-slide-${index + 1}`}
                                value={slide.image}
                                onUploaded={items => {
                                  const url = `${items?.[0]?.secureUrl || items?.[0]?.url || ''}`.trim()
                                  if (url)
                                    setForm(p => ({
                                      ...p,
                                      template: {
                                        ...p.template,
                                        heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, image: url } : s))
                                      }
                                    }))
                                }}
                                onClear={() =>
                                  setForm(p => ({
                                    ...p,
                                    template: {
                                      ...p.template,
                                      heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, image: '' } : s))
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField fullWidth label='Hero Image Alt' value={slide.imageAlt ?? ''} onChange={e => setForm(p => ({ ...p, template: { ...p.template, heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, imageAlt: e.target.value ?? '' } : s)) } }))} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField fullWidth label='CTA Text' value={slide.ctaText ?? ''} onChange={e => setForm(p => ({ ...p, template: { ...p.template, heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, ctaText: e.target.value ?? '' } : s)) } }))} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <CustomTextField fullWidth label='CTA Link' value={slide.ctaLink ?? ''} onChange={e => setForm(p => ({ ...p, template: { ...p.template, heroSlides: p.template.heroSlides.map((s, i) => (i === index ? { ...s, ctaLink: e.target.value ?? '' } : s)) } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                color='error'
                                onClick={() =>
                                  setForm(p => ({
                                    ...p,
                                    template: {
                                      ...p.template,
                                      heroSlides: p.template.heroSlides.length > 1 ? p.template.heroSlides.filter((_, i) => i !== index) : p.template.heroSlides
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
                            setForm(p => ({
                              ...p,
                              template: {
                                ...p.template,
                                heroSlides: [...p.template.heroSlides, { title: '', subtitle: '', description: '', image: '', imageAlt: '', ctaText: '', ctaLink: '' }]
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

                <Accordion sx={{ order: 1 }} expanded={expanded === 'wyg'} onChange={(_, o) => setExpanded(o ? 'wyg' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>What You Get</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <CustomTextField fullWidth type='number' label='Section ID' value={form.template.whatYouGet.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, id: Number(e.target.value ?? 0) || 0 } } }))} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomTextField fullWidth label='Title 1' value={form.template.whatYouGet.title1} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, title1: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomTextField fullWidth label='Span Title' value={form.template.whatYouGet.spanTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, spanTitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <CustomTextField fullWidth label='Title 2' value={form.template.whatYouGet.title2} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, title2: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={3} label='Right Description' value={form.template.whatYouGet.RightDescription1} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, RightDescription1: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='subtitle2' sx={{ mb: 1 }}>
                          Reviews
                        </Typography>
                        {form.template.whatYouGet.reviews.map((r, idx) => (
                          <Grid container spacing={2} key={`rev-${idx}`} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                              <CustomTextField fullWidth label='Image URL' value={r.image1} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, reviews: p.template.whatYouGet.reviews.map((x, i) => (i === idx ? { ...x, image1: e.target.value ?? '' } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <GlobalImageUploader
                                ref={el => {
                                  whatYouGetReviewUploaderRefs.current[idx] = el
                                }}
                                label={`What You Get Review ${idx + 1} Image`}
                                folder='images/industries'
                                type='industry'
                                entityId={`${form.slug || 'industry'}-what-you-get-review-${idx}`}
                                uploadOnSubmit
                                multiple={false}
                                altText={`industry-what-you-get-review-${idx + 1}`}
                                value={r.image1}
                                onUploaded={items => {
                                  const url = `${items?.[0]?.secureUrl || items?.[0]?.url || ''}`.trim()
                                  if (url)
                                    setForm(p => ({
                                      ...p,
                                      template: {
                                        ...p.template,
                                        whatYouGet: {
                                          ...p.template.whatYouGet,
                                          reviews: p.template.whatYouGet.reviews.map((x, i) =>
                                            i === idx ? { ...x, image1: url } : x
                                          )
                                        }
                                      }
                                    }))
                                }}
                                onClear={() =>
                                  setForm(p => ({
                                    ...p,
                                    template: {
                                      ...p.template,
                                      whatYouGet: {
                                        ...p.template.whatYouGet,
                                        reviews: p.template.whatYouGet.reviews.map((x, i) =>
                                          i === idx ? { ...x, image1: '' } : x
                                        )
                                      }
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <CustomTextField fullWidth type='number' label='Width' value={r.width} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, reviews: p.template.whatYouGet.reviews.map((x, i) => (i === idx ? { ...x, width: Number(e.target.value ?? 0) || 0 } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <CustomTextField fullWidth type='number' label='Height' value={r.height} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, reviews: p.template.whatYouGet.reviews.map((x, i) => (i === idx ? { ...x, height: Number(e.target.value ?? 0) || 0 } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, reviews: p.template.whatYouGet.reviews.length > 1 ? p.template.whatYouGet.reviews.filter((_, i) => i !== idx) : p.template.whatYouGet.reviews } } }))}>
                                Remove
                              </Button>
                            </Grid>
                          </Grid>
                        ))}
                        <Button variant='outlined' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, whatYouGet: { ...p.template.whatYouGet, reviews: [...p.template.whatYouGet.reviews, { image1: '', width: 0, height: 0 }] } } }))}>
                          Add Review
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ order: 2 }} expanded={expanded === 'soft'} onChange={(_, o) => setExpanded(o ? 'soft' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Software Solutions (Service Benefits)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Title' value={form.template.softwareSolutions.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, title: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Middle Title' value={form.template.softwareSolutions.middleTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, middleTitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={3} label='Description' value={form.template.softwareSolutions.description} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, description: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Last Title' value={form.template.softwareSolutions.lastTitle ?? ''} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, lastTitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      {form.template.softwareSolutions.items.map((it, idx) => (
                        <Grid item xs={12} key={`sol-${idx}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={2}>
                              <CustomTextField fullWidth type='number' label='ID' value={it.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, items: p.template.softwareSolutions.items.map((x, i) => (i === idx ? { ...x, id: Number(e.target.value ?? 0) || 0 } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <CustomTextField fullWidth label='Item Title' value={it.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, items: p.template.softwareSolutions.items.map((x, i) => (i === idx ? { ...x, title: e.target.value ?? '' } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <CustomTextField fullWidth multiline rows={2} label='Item Description' value={it.description} onChange={e => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, items: p.template.softwareSolutions.items.map((x, i) => (i === idx ? { ...x, description: e.target.value ?? '' } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, items: p.template.softwareSolutions.items.length > 1 ? p.template.softwareSolutions.items.filter((_, i) => i !== idx) : p.template.softwareSolutions.items } } }))}>
                                Remove item
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, softwareSolutions: { ...p.template.softwareSolutions, items: [...p.template.softwareSolutions.items, { id: 0, title: '', description: '' }] } } }))}>
                          Add Solution Item
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ order: 3 }} expanded={expanded === 'tech'} onChange={(_, o) => setExpanded(o ? 'tech' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>Technology Expertise</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Main Title' value={form.template.technologyExpertise.mainTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, mainTitle: e.target.value ?? '' } } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth multiline rows={2} label='Main Description' value={form.template.technologyExpertise.mainDescription ?? ''} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, mainDescription: e.target.value ?? '' } } }))} />
                      </Grid>
                      {form.template.technologyExpertise.cards.map((c, idx) => (
                        <Grid item xs={12} key={`tech-${idx}`}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={2}>
                              <CustomTextField fullWidth type='number' label='ID' value={c.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, cards: p.template.technologyExpertise.cards.map((x, i) => (i === idx ? { ...x, id: Number(e.target.value ?? 0) || 0 } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <CustomTextField fullWidth label='Title' value={c.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, cards: p.template.technologyExpertise.cards.map((x, i) => (i === idx ? { ...x, title: e.target.value ?? '' } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12} md={5}>
                              <CustomTextField fullWidth label='Icon URL' value={c.icon} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, cards: p.template.technologyExpertise.cards.map((x, i) => (i === idx ? { ...x, icon: e.target.value ?? '' } : x)) } } }))} />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                                Description lines (one per line → saved as string[])
                              </Typography>
                              <CustomTextField
                                fullWidth
                                multiline
                                rows={4}
                                value={c._descriptionText ?? (c.description || []).join('\n')}
                                onChange={e =>
                                  setForm(p => ({
                                    ...p,
                                    template: {
                                      ...p.template,
                                      technologyExpertise: {
                                        ...p.template.technologyExpertise,
                                        cards: p.template.technologyExpertise.cards.map((x, i) =>
                                          i === idx ? { ...x, _descriptionText: e.target.value ?? '' } : x
                                        )
                                      }
                                    }
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, cards: p.template.technologyExpertise.cards.length > 1 ? p.template.technologyExpertise.cards.filter((_, i) => i !== idx) : p.template.technologyExpertise.cards } } }))}>
                                Remove card
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Button variant='outlined' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, technologyExpertise: { ...p.template.technologyExpertise, cards: [...p.template.technologyExpertise.cards, { id: 0, title: '', description: [], icon: '', _descriptionText: '' }] } } }))}>
                          Add Card
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Accordion sx={{ order: 4 }} expanded={expanded === 'cta'} onChange={(_, o) => setExpanded(o ? 'cta' : false)}>
                  <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}>
                    <Typography variant='subtitle2'>CTA</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='CTA Title' value={form.template.ctaTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, ctaTitle: e.target.value ?? '' } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                          CTA Description (HTML)
                        </Typography>
                        <HtmlEditorField value={form.template.ctaDescription} onChange={v => setForm(p => ({ ...p, template: { ...p.template, ctaDescription: v } }))} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Button Label' value={form.template.ctaButtonLabel} onChange={e => setForm(p => ({ ...p, template: { ...p.template, ctaButtonLabel: e.target.value ?? '' } }))} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <CustomTextField fullWidth label='Button URL' value={form.template.ctaButtonUrl} onChange={e => setForm(p => ({ ...p, template: { ...p.template, ctaButtonUrl: e.target.value ?? '' } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField fullWidth label='CTA Image Alt' value={form.template.ctaImageAlt} onChange={e => setForm(p => ({ ...p, template: { ...p.template, ctaImageAlt: e.target.value ?? '' } }))} />
                      </Grid>
                      <Grid item xs={12}>
                        <GlobalImageUploader
                          ref={ctaImageUploaderRef}
                          label='CTA Image'
                          folder='images/industries'
                          type='industry'
                          entityId={`${form.slug || form.name}-cta`}
                          uploadOnSubmit
                          multiple={false}
                          altText={form.template.ctaImageAlt || form.template.ctaTitle || 'industry-cta-image'}
                          value={form.template.ctaImageUrl}
                          onUploaded={items => {
                            const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                            if (url) setForm(p => ({ ...p, template: { ...p.template, ctaImageUrl: url } }))
                          }}
                          onClear={() => setForm(p => ({ ...p, template: { ...p.template, ctaImageUrl: '' } }))}
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

export default IndustryForm
