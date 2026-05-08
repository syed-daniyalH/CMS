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
import { uploadPendingFromRef } from 'src/custom-components/media/uploadOnSubmit'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { stateFromHTML } from 'draft-js-import-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type FeatureCard = { id: number; title: string; category: string; icon: string; featuresText: string }
type HireCard = { id: number; title: string; description: string; icon: string; label: string }
type WhyCard = { id: number; title: string; description: string; icon: string; label: string }
type SolutionCard = { id: number; title: string; description: string; bgPattern: string; bgWidth: string; bgHeight: string }
type StepBullet = { label: string; text: string }
type ProcessStep = { id: string; title: string; description: string; extraContent: string; bullets: StepBullet[] }
type SkillCard = { id: number; title: string; icon: string; skillsText: string }
type ContactFeature = { icon: string; text: string }
type OutsourcingItem = { title: string; description: string; image: string; hoverImage: string }
type OutsourcingSlide = { title: string; middleTitle: string; lastTitle: string; description: string; items: OutsourcingItem[] }
type SolutionItem = { id: number; title: string; description: string; image: string; hoverImage: string; alt: string }
type FaqItem = { question: string; answer: string }

type TemplateForm = {
  hero: { title: string; subtitle: string; description: string; image: string; imageAlt: string; buttonText: string; buttonLink: string }
  hiringPageData: { mainTitle: string; highlightTitle: string; subtitle: string; cards: FeatureCard[] }
  offshoreDeveloper: { cards: HireCard[] }
  whyChooseNext: { mainTitle: string; middleTitle: string; endTitle: string; mainDescription: string; cards: WhyCard[] }
  technicalExperts: { mainTitle: string; highlightTitle: string; subtitle: string; cards: FeatureCard[] }
  tailoredOffshore: { title: string; middleTitle: string; lastTitle: string; description: string; cards: SolutionCard[] }
  hiringProcess: { mainTitle: string; highlightTitle: string; subtitle: string; steps: ProcessStep[] }
  programmerSkills: { mainTitle: string; highlightTitle: string; brandName: string; subtitle: string; cards: SkillCard[] }
  cutCostNotTalent: {
    title: string
    middleTitle: string
    lastTitle: string
    highlight: string
    description: string
    backgroundImage: string
    lgImage1: string
    lgImage2: string
    lgImage3: string
    lgImage4: string
    smImage1: string
    smImage2: string
    smImage3: string
    smImage4: string
    buttonText: string
    buttonLink: string
    features: ContactFeature[]
  }
  outsourcing: { slides: OutsourcingSlide[] }
  whyChooseTechionik: { title: string; middleTitle: string; description: string; lastTitle: string; items: SolutionItem[] }
  faq: FaqItem[]
}

type FormState = {
  title: string
  slug: string
  middleTitle: string
  lastTitle: string
  description: string
  discription: string
  imageUrl: string
  isActive: boolean
  hasPage: boolean
  metaTitle: string
  metaDescription: string
  metadataSection: string
  template: TemplateForm
}

const RichEditor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

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
        toolbar={{ options: ['inline', 'list', 'textAlign', 'history', 'link'], inline: { options: ['bold', 'italic', 'underline'] }, list: { options: ['unordered', 'ordered'] } }}
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
  hero: { title: '', subtitle: '', description: '', image: '', imageAlt: '', buttonText: '', buttonLink: '' },
  hiringPageData: { mainTitle: '', highlightTitle: '', subtitle: '', cards: [{ id: 1, title: '', category: '', icon: '', featuresText: '' }] },
  offshoreDeveloper: { cards: [{ id: 1, title: '', description: '', icon: '', label: '' }] },
  whyChooseNext: { mainTitle: '', middleTitle: '', endTitle: '', mainDescription: '', cards: [{ id: 1, title: '', description: '', icon: '', label: '' }] },
  technicalExperts: { mainTitle: '', highlightTitle: '', subtitle: '', cards: [{ id: 1, title: '', category: '', icon: '', featuresText: '' }] },
  tailoredOffshore: { title: '', middleTitle: '', lastTitle: '', description: '', cards: [{ id: 1, title: '', description: '', bgPattern: '', bgWidth: '', bgHeight: '' }] },
  hiringProcess: { mainTitle: '', highlightTitle: '', subtitle: '', steps: [{ id: '01', title: '', description: '', extraContent: '', bullets: [{ label: '', text: '' }] }] },
  programmerSkills: { mainTitle: '', highlightTitle: '', brandName: '', subtitle: '', cards: [{ id: 1, title: '', icon: '', skillsText: '' }] },
  cutCostNotTalent: {
    title: '',
    middleTitle: '',
    lastTitle: '',
    highlight: '',
    description: '',
    backgroundImage: '',
    lgImage1: '',
    lgImage2: '',
    lgImage3: '',
    lgImage4: '',
    smImage1: '',
    smImage2: '',
    smImage3: '',
    smImage4: '',
    buttonText: '',
    buttonLink: '',
    features: [{ icon: '', text: '' }]
  },
  outsourcing: { slides: [{ title: '', middleTitle: '', lastTitle: '', description: '', items: [{ title: '', description: '', image: '', hoverImage: '' }] }] },
  whyChooseTechionik: { title: '', middleTitle: '', description: '', lastTitle: '', items: [{ id: 1, title: '', description: '', image: '', hoverImage: '', alt: '' }] },
  faq: [{ question: '', answer: '' }]
})

const defaultForm = (): FormState => ({
  title: '',
  slug: '',
  middleTitle: '',
  lastTitle: '',
  description: '',
  discription: '',
  imageUrl: '',
  isActive: true,
  hasPage: true,
  metaTitle: '',
  metaDescription: '',
  metadataSection: 'hiring',
  template: defaultTemplate()
})

const featuresTextToArray = (value: string) => `${value || ''}`.split('\n').map(v => v.trim()).filter(Boolean)
const fromTemplateData = (data: any): TemplateForm => {
  const d = defaultTemplate()
  return {
    ...d,
    hero: { ...d.hero, ...(data?.hero || {}) },
    hiringPageData: {
      mainTitle: `${data?.hiringPageData?.header?.mainTitle ?? ''}`,
      highlightTitle: `${data?.hiringPageData?.header?.highlightTitle ?? ''}`,
      subtitle: `${data?.hiringPageData?.header?.subtitle ?? ''}`,
      cards: Array.isArray(data?.hiringPageData?.cards) && data.hiringPageData.cards.length
        ? data.hiringPageData.cards.map((c: any, idx: number) => ({ id: Number(c?.id ?? idx + 1), title: `${c?.title ?? ''}`, category: `${c?.category ?? ''}`, icon: `${c?.icon ?? ''}`, featuresText: Array.isArray(c?.features) ? c.features.join('\n') : '' }))
        : d.hiringPageData.cards
    },
    offshoreDeveloper: {
      cards: Array.isArray(data?.offshoreDeveloper?.cards) && data.offshoreDeveloper.cards.length
        ? data.offshoreDeveloper.cards.map((c: any, idx: number) => ({ id: Number(c?.id ?? idx + 1), title: `${c?.title ?? ''}`, description: `${c?.description ?? ''}`, icon: `${c?.icon ?? ''}`, label: `${c?.label ?? ''}` }))
        : d.offshoreDeveloper.cards
    },
    whyChooseNext: {
      mainTitle: `${data?.whyChooseNext?.mainTitle ?? ''}`,
      middleTitle: `${data?.whyChooseNext?.middleTitle ?? ''}`,
      endTitle: `${data?.whyChooseNext?.endTitle ?? ''}`,
      mainDescription: `${data?.whyChooseNext?.mainDescription ?? ''}`,
      cards: Array.isArray(data?.whyChooseNext?.cards) && data.whyChooseNext.cards.length
        ? data.whyChooseNext.cards.map((c: any, idx: number) => ({ id: Number(c?.id ?? idx + 1), title: `${c?.title ?? ''}`, description: `${c?.description ?? ''}`, icon: `${c?.icon ?? ''}`, label: `${c?.label ?? ''}` }))
        : d.whyChooseNext.cards
    },
    technicalExperts: {
      mainTitle: `${data?.technicalExperts?.header?.mainTitle ?? ''}`,
      highlightTitle: `${data?.technicalExperts?.header?.highlightTitle ?? ''}`,
      subtitle: `${data?.technicalExperts?.header?.subtitle ?? ''}`,
      cards: Array.isArray(data?.technicalExperts?.cards) && data.technicalExperts.cards.length
        ? data.technicalExperts.cards.map((c: any, idx: number) => ({ id: Number(c?.id ?? idx + 1), title: `${c?.title ?? ''}`, category: `${c?.category ?? ''}`, icon: `${c?.icon ?? ''}`, featuresText: Array.isArray(c?.features) ? c.features.join('\n') : '' }))
        : d.technicalExperts.cards
    },
    tailoredOffshore: {
      title: `${data?.tailoredOffshore?.header?.title ?? ''}`,
      middleTitle: `${data?.tailoredOffshore?.header?.middleTitle ?? ''}`,
      lastTitle: `${data?.tailoredOffshore?.header?.lastTitle ?? ''}`,
      description: `${data?.tailoredOffshore?.header?.description ?? ''}`,
      cards: Array.isArray(data?.tailoredOffshore?.cards) && data.tailoredOffshore.cards.length
        ? data.tailoredOffshore.cards.map((c: any, idx: number) => ({ id: Number(c?.id ?? idx + 1), title: `${c?.title ?? ''}`, description: `${c?.description ?? ''}`, bgPattern: `${c?.bgPattern ?? ''}`, bgWidth: `${c?.bgWidth ?? ''}`, bgHeight: `${c?.bgHeight ?? ''}` }))
        : d.tailoredOffshore.cards
    },
    hiringProcess: {
      mainTitle: `${data?.hiringProcess?.header?.mainTitle ?? ''}`,
      highlightTitle: `${data?.hiringProcess?.header?.highlightTitle ?? ''}`,
      subtitle: `${data?.hiringProcess?.header?.subtitle ?? ''}`,
      steps: Array.isArray(data?.hiringProcess?.steps) && data.hiringProcess.steps.length
        ? data.hiringProcess.steps.map((s: any, idx: number) => ({ id: `${s?.id ?? idx + 1}`, title: `${s?.title ?? ''}`, description: `${s?.description ?? ''}`, extraContent: `${s?.extraContent ?? ''}`, bullets: Array.isArray(s?.bulletPoints) && s.bulletPoints.length ? s.bulletPoints.map((b: any) => ({ label: `${b?.label ?? ''}`, text: `${b?.text ?? ''}` })) : [{ label: '', text: '' }] }))
        : d.hiringProcess.steps
    },
    programmerSkills: {
      mainTitle: `${data?.programmerSkills?.header?.mainTitle ?? ''}`,
      highlightTitle: `${data?.programmerSkills?.header?.highlightTitle ?? ''}`,
      brandName: `${data?.programmerSkills?.header?.brandName ?? ''}`,
      subtitle: `${data?.programmerSkills?.header?.subtitle ?? ''}`,
      cards: Array.isArray(data?.programmerSkills?.cards) && data.programmerSkills.cards.length
        ? data.programmerSkills.cards.map((c: any, idx: number) => ({ id: Number(c?.id ?? idx + 1), title: `${c?.title ?? ''}`, icon: `${c?.icon ?? ''}`, skillsText: Array.isArray(c?.skills) ? c.skills.join('\n') : '' }))
        : d.programmerSkills.cards
    },
    cutCostNotTalent: {
      ...d.cutCostNotTalent,
      ...(data?.cutCostNotTalent || {}),
      features: Array.isArray(data?.cutCostNotTalent?.features) && data.cutCostNotTalent.features.length
        ? data.cutCostNotTalent.features.map((f: any) => ({ icon: `${f?.icon ?? ''}`, text: `${f?.text ?? ''}` }))
        : d.cutCostNotTalent.features
    },
    outsourcing: {
      slides: Array.isArray(data?.outsourcing?.slides) && data.outsourcing.slides.length
        ? data.outsourcing.slides.map((s: any) => ({
            title: `${s?.title ?? ''}`,
            middleTitle: `${s?.MiddleTitle ?? s?.middleTitle ?? ''}`,
            lastTitle: `${s?.lastTitle ?? ''}`,
            description: `${s?.description ?? ''}`,
            items: Array.isArray(s?.items) && s.items.length ? s.items.map((i: any) => ({ title: `${i?.title ?? ''}`, description: `${i?.description ?? ''}`, image: `${i?.image ?? ''}`, hoverImage: `${i?.hoverImage ?? ''}` })) : [{ title: '', description: '', image: '', hoverImage: '' }]
          }))
        : d.outsourcing.slides
    },
    whyChooseTechionik: {
      title: `${data?.whyChooseTechionik?.title ?? ''}`,
      middleTitle: `${data?.whyChooseTechionik?.middleTitle ?? ''}`,
      description: `${data?.whyChooseTechionik?.description ?? ''}`,
      lastTitle: `${data?.whyChooseTechionik?.lastTitle ?? ''}`,
      items: Array.isArray(data?.whyChooseTechionik?.items) && data.whyChooseTechionik.items.length
        ? data.whyChooseTechionik.items.map((i: any, idx: number) => ({ id: Number(i?.id ?? idx + 1), title: `${i?.title ?? ''}`, description: `${i?.description ?? ''}`, image: `${i?.image ?? ''}`, hoverImage: `${i?.hoverImage ?? ''}`, alt: `${i?.alt ?? ''}` }))
        : d.whyChooseTechionik.items
    },
    faq: Array.isArray(data?.faq) && data.faq.length ? data.faq.map((f: any) => ({ question: `${f?.question ?? ''}`, answer: `${f?.answer ?? ''}` })) : d.faq
  }
}

const toTemplateData = (t: TemplateForm) => ({
  hero: { ...t.hero, title: t.hero.title.trim(), subtitle: t.hero.subtitle.trim(), description: t.hero.description || '', image: t.hero.image.trim(), imageAlt: t.hero.imageAlt.trim(), buttonText: t.hero.buttonText.trim(), buttonLink: t.hero.buttonLink.trim() },
  hiringPageData: {
    header: { mainTitle: t.hiringPageData.mainTitle.trim(), highlightTitle: t.hiringPageData.highlightTitle.trim(), subtitle: t.hiringPageData.subtitle.trim() },
    cards: t.hiringPageData.cards.map(c => ({ id: Number(c.id || 0), title: c.title.trim(), category: c.category.trim(), icon: c.icon.trim(), features: featuresTextToArray(c.featuresText) })).filter(c => c.title || c.category || c.icon || c.features.length)
  },
  offshoreDeveloper: { cards: t.offshoreDeveloper.cards.map(c => ({ id: Number(c.id || 0), title: c.title.trim(), description: c.description.trim(), icon: c.icon.trim(), label: c.label.trim() })).filter(c => c.title || c.description || c.icon || c.label) },
  whyChooseNext: {
    mainTitle: t.whyChooseNext.mainTitle.trim(),
    middleTitle: t.whyChooseNext.middleTitle.trim(),
    endTitle: t.whyChooseNext.endTitle.trim(),
    mainDescription: t.whyChooseNext.mainDescription || '',
    cards: t.whyChooseNext.cards.map(c => ({ id: Number(c.id || 0), title: c.title.trim(), description: c.description.trim(), icon: c.icon.trim(), label: c.label.trim() })).filter(c => c.title || c.description || c.icon || c.label)
  },
  technicalExperts: {
    header: { mainTitle: t.technicalExperts.mainTitle.trim(), highlightTitle: t.technicalExperts.highlightTitle.trim(), subtitle: t.technicalExperts.subtitle.trim() },
    cards: t.technicalExperts.cards.map(c => ({ id: Number(c.id || 0), title: c.title.trim(), category: c.category.trim(), icon: c.icon.trim(), features: featuresTextToArray(c.featuresText) })).filter(c => c.title || c.category || c.icon || c.features.length)
  },
  tailoredOffshore: {
    header: { title: t.tailoredOffshore.title.trim(), middleTitle: t.tailoredOffshore.middleTitle.trim(), lastTitle: t.tailoredOffshore.lastTitle.trim(), description: t.tailoredOffshore.description || '' },
    cards: t.tailoredOffshore.cards.map(c => ({ id: Number(c.id || 0), title: c.title.trim(), description: c.description.trim(), bgPattern: c.bgPattern.trim(), bgWidth: c.bgWidth.trim() || undefined, bgHeight: c.bgHeight.trim() || undefined })).filter(c => c.title || c.description || c.bgPattern)
  },
  hiringProcess: {
    header: { mainTitle: t.hiringProcess.mainTitle.trim(), highlightTitle: t.hiringProcess.highlightTitle.trim(), subtitle: t.hiringProcess.subtitle.trim() },
    steps: t.hiringProcess.steps.map(s => ({ id: `${s.id || ''}`.trim(), title: s.title.trim(), description: s.description.trim(), extraContent: s.extraContent.trim() || undefined, bulletPoints: s.bullets.map(b => ({ label: b.label.trim(), text: b.text.trim() })).filter(b => b.label || b.text) })).filter(s => s.id || s.title || s.description || s.extraContent || (s.bulletPoints?.length ?? 0) > 0)
  },
  programmerSkills: {
    header: { mainTitle: t.programmerSkills.mainTitle.trim(), highlightTitle: t.programmerSkills.highlightTitle.trim(), brandName: t.programmerSkills.brandName.trim(), subtitle: t.programmerSkills.subtitle.trim() },
    cards: t.programmerSkills.cards.map(c => ({ id: Number(c.id || 0), title: c.title.trim(), icon: c.icon.trim(), skills: featuresTextToArray(c.skillsText) })).filter(c => c.title || c.icon || c.skills.length)
  },
  cutCostNotTalent: {
    ...t.cutCostNotTalent,
    title: t.cutCostNotTalent.title.trim(),
    middleTitle: t.cutCostNotTalent.middleTitle.trim(),
    lastTitle: t.cutCostNotTalent.lastTitle.trim(),
    highlight: t.cutCostNotTalent.highlight.trim(),
    description: t.cutCostNotTalent.description || '',
    buttonText: t.cutCostNotTalent.buttonText.trim(),
    buttonLink: t.cutCostNotTalent.buttonLink.trim(),
    features: t.cutCostNotTalent.features.map(f => ({ icon: f.icon.trim(), text: f.text.trim() })).filter(f => f.icon || f.text)
  },
  outsourcing: {
    slides: t.outsourcing.slides.map(s => ({
      title: s.title.trim(),
      MiddleTitle: s.middleTitle.trim(),
      lastTitle: s.lastTitle.trim(),
      description: s.description.trim() || undefined,
      items: s.items.map(i => ({ title: i.title.trim(), description: i.description.trim() || undefined, image: i.image.trim(), hoverImage: i.hoverImage.trim() })).filter(i => i.title || i.description || i.image || i.hoverImage)
    })).filter(s => s.title || s.MiddleTitle || s.lastTitle || s.description || s.items.length)
  },
  whyChooseTechionik: {
    title: t.whyChooseTechionik.title.trim(),
    middleTitle: t.whyChooseTechionik.middleTitle.trim(),
    description: t.whyChooseTechionik.description || '',
    lastTitle: t.whyChooseTechionik.lastTitle.trim() || undefined,
    items: t.whyChooseTechionik.items.map(i => ({ id: Number(i.id || 0), title: i.title.trim(), description: i.description.trim(), image: i.image.trim(), hoverImage: i.hoverImage.trim() || undefined, alt: i.alt.trim() })).filter(i => i.title || i.description || i.image || i.hoverImage || i.alt)
  },
  faq: t.faq.map(f => ({ question: f.question.trim(), answer: f.answer.trim() })).filter(f => f.question || f.answer)
})

const HiringForm = () => {
  const router = useRouter()
  const mode = `${router.query?.mode ?? 'create'}` === 'edit' ? 'edit' : 'create'
  const slugParam = `${router.query?.slug ?? ''}`.trim()
  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [expanded, setExpanded] = useState<string | false>('hero')
  const [form, setForm] = useState<FormState>(defaultForm())
  const imageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const heroImageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)
  const hiringPageCardIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const offshoreCardIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const whyChooseNextCardIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const technicalExpertsCardIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const programmerSkillsCardIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const tailoredCardPatternRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const cutCostFeatureIconRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const outsourcingItemImageRefs = useRef<(GlobalImageUploaderRef | null)[][]>([])
  const outsourcingItemHoverImageRefs = useRef<(GlobalImageUploaderRef | null)[][]>([])
  const whyChooseTechionikImageRefs = useRef<(GlobalImageUploaderRef | null)[]>([])
  const whyChooseTechionikHoverImageRefs = useRef<(GlobalImageUploaderRef | null)[]>([])

  useEffect(() => {
    if (slugTouched) return
    setForm(prev => ({ ...prev, slug: slugify(prev.title) }))
  }, [form.title, slugTouched])

  useEffect(() => {
    if (mode !== 'edit' || !slugParam) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/menu-structure/hirings/${encodeURIComponent(slugParam)}`)
        const item = res?.data?.data ?? res?.data ?? {}
        setForm({
          title: `${item?.title ?? item?.name ?? ''}`,
          slug: `${item?.slug ?? slugParam}`,
          middleTitle: `${item?.middleTitle ?? ''}`,
          lastTitle: `${item?.lastTitle ?? ''}`,
          description: `${item?.description ?? ''}`,
          discription: `${item?.discription ?? item?.description ?? ''}`,
          imageUrl: `${item?.imageUrl ?? item?.image ?? ''}`,
          isActive: item?.isActive ?? true,
          hasPage: item?.hasPage ?? true,
          metaTitle: `${item?.metaTitle ?? ''}`,
          metaDescription: `${item?.metaDescription ?? ''}`,
          metadataSection: `${item?.metadata?.section ?? 'hiring'}`,
          template: fromTemplateData(item?.templateData ?? {})
        })
        setSlugTouched(true)
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load hiring.')
      } finally {
        setLoading(false)
      }
    }
    load().then(() => null)
  }, [mode, slugParam])

  const save = async () => {
    if (!form.title.trim()) return toast.error('Title is required.')
    if (!form.slug.trim()) return toast.error('Slug is required.')
    setLoading(true)
    try {
      const uploadedImageUrl = await uploadPendingFromRef(imageUploaderRef.current, form.imageUrl)
      const uploadedHeroImage = await uploadPendingFromRef(heroImageUploaderRef.current, form.template.hero.image)
      const hiringPageCards = await Promise.all(
        form.template.hiringPageData.cards.map((card, index) =>
          uploadPendingFromRef(hiringPageCardIconRefs.current[index] ?? null, card.icon).then(icon => ({ ...card, icon: icon.trim() }))
        )
      )
      const offshoreCards = await Promise.all(
        form.template.offshoreDeveloper.cards.map((card, index) =>
          uploadPendingFromRef(offshoreCardIconRefs.current[index] ?? null, card.icon).then(icon => ({ ...card, icon: icon.trim() }))
        )
      )
      const whyChooseNextCards = await Promise.all(
        form.template.whyChooseNext.cards.map((card, index) =>
          uploadPendingFromRef(whyChooseNextCardIconRefs.current[index] ?? null, card.icon).then(icon => ({ ...card, icon: icon.trim() }))
        )
      )
      const technicalExpertsCards = await Promise.all(
        form.template.technicalExperts.cards.map((card, index) =>
          uploadPendingFromRef(technicalExpertsCardIconRefs.current[index] ?? null, card.icon).then(icon => ({ ...card, icon: icon.trim() }))
        )
      )
      const programmerSkillsCards = await Promise.all(
        form.template.programmerSkills.cards.map((card, index) =>
          uploadPendingFromRef(programmerSkillsCardIconRefs.current[index] ?? null, card.icon).then(icon => ({ ...card, icon: icon.trim() }))
        )
      )
      const tailoredOffshoreCards = await Promise.all(
        form.template.tailoredOffshore.cards.map((card, index) =>
          uploadPendingFromRef(tailoredCardPatternRefs.current[index] ?? null, card.bgPattern).then(bgPattern => ({ ...card, bgPattern: bgPattern.trim() }))
        )
      )
      const cutCostFeatures = await Promise.all(
        form.template.cutCostNotTalent.features.map((feature, index) =>
          uploadPendingFromRef(cutCostFeatureIconRefs.current[index] ?? null, feature.icon).then(icon => ({ ...feature, icon: icon.trim() }))
        )
      )
      const outsourcingSlides = await Promise.all(
        form.template.outsourcing.slides.map(async (slide, slideIndex) => {
          const items = await Promise.all(
            slide.items.map(async (item, itemIndex) => {
              const image = await uploadPendingFromRef(outsourcingItemImageRefs.current[slideIndex]?.[itemIndex] ?? null, item.image)
              const hoverImage = await uploadPendingFromRef(outsourcingItemHoverImageRefs.current[slideIndex]?.[itemIndex] ?? null, item.hoverImage)
              return { ...item, image: image.trim(), hoverImage: hoverImage.trim() }
            })
          )
          return { ...slide, items }
        })
      )
      const whyChooseTechionikItems = await Promise.all(
        form.template.whyChooseTechionik.items.map(async (item, index) => {
          const image = await uploadPendingFromRef(whyChooseTechionikImageRefs.current[index] ?? null, item.image)
          const hoverImage = await uploadPendingFromRef(whyChooseTechionikHoverImageRefs.current[index] ?? null, item.hoverImage)
          return { ...item, image: image.trim(), hoverImage: hoverImage.trim() }
        })
      )

      const nextTemplate = {
        ...form.template,
        hero: { ...form.template.hero, image: uploadedHeroImage.trim() },
        hiringPageData: { ...form.template.hiringPageData, cards: hiringPageCards },
        offshoreDeveloper: { ...form.template.offshoreDeveloper, cards: offshoreCards },
        whyChooseNext: { ...form.template.whyChooseNext, cards: whyChooseNextCards },
        technicalExperts: { ...form.template.technicalExperts, cards: technicalExpertsCards },
        programmerSkills: { ...form.template.programmerSkills, cards: programmerSkillsCards },
        tailoredOffshore: { ...form.template.tailoredOffshore, cards: tailoredOffshoreCards },
        cutCostNotTalent: { ...form.template.cutCostNotTalent, features: cutCostFeatures },
        outsourcing: { ...form.template.outsourcing, slides: outsourcingSlides },
        whyChooseTechionik: { ...form.template.whyChooseTechionik, items: whyChooseTechionikItems }
      }
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        middleTitle: form.middleTitle.trim(),
        lastTitle: form.lastTitle.trim(),
        description: form.description.trim(),
        discription: form.discription.trim() || form.description.trim(),
        imageUrl: uploadedImageUrl.trim(),
        image: uploadedImageUrl.trim(),
        metadata: { section: form.metadataSection.trim() || 'hiring' },
        templateData: toTemplateData(nextTemplate),
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
        isActive: !!form.isActive,
        hasPage: !!form.hasPage
      }
      if (mode === 'edit') {
        await axiosInstance.put(`/api/menu-structure/hirings/${encodeURIComponent(slugParam)}`, payload)
        toast.success('Hiring updated successfully.')
      } else {
        await axiosInstance.post('/api/menu-structure/hirings', payload)
        toast.success('Hiring created successfully.')
      }
      router.push('/hirings/list')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save hiring.')
    } finally {
      setLoading(false)
    }
  }

  const sectionWrapperSx = {
    display: 'flex',
    flexDirection: 'column' as const,
    '& .MuiAccordion-root': { border: '1px solid', borderColor: 'divider', borderRadius: '10px !important', boxShadow: 'none', mb: 2, '&:before': { display: 'none' } },
    '& .MuiAccordionSummary-root': { bgcolor: 'action.hover' }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5'>{mode === 'edit' ? 'Edit Hiring' : 'Add Hiring'}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => router.push('/hirings/list')}>Back</Button>
            <Button variant='contained' onClick={save}>{mode === 'edit' ? 'Update Hiring' : 'Create Hiring'}</Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12}><Typography variant='subtitle1' sx={{ fontWeight: 600 }}>Basic Information</Typography></Grid>
            <Grid item xs={12} md={6}><CustomTextField fullWidth label='Title' value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12} md={6}><CustomTextField fullWidth label='Slug' value={form.slug} onChange={e => { setSlugTouched(true); setForm(p => ({ ...p, slug: slugify(e.target.value ?? '') })) }} /></Grid>
            <Grid item xs={12} md={4}><CustomTextField fullWidth label='Middle Title' value={form.middleTitle} onChange={e => setForm(p => ({ ...p, middleTitle: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12} md={4}><CustomTextField fullWidth label='Last Title' value={form.lastTitle} onChange={e => setForm(p => ({ ...p, lastTitle: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12} md={4}><CustomTextField fullWidth label='Metadata Section' value={form.metadataSection} onChange={e => setForm(p => ({ ...p, metadataSection: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12}><CustomTextField fullWidth multiline rows={3} label='Description' value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12}><CustomTextField fullWidth multiline rows={2} label='Discription (alias)' value={form.discription} onChange={e => setForm(p => ({ ...p, discription: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12} md={6}><CustomTextField fullWidth label='Image URL' value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12}><GlobalImageUploader ref={imageUploaderRef} label='Hiring Main Image' folder='images/hiring' type='hiring' entityId={form.slug || form.title || 'hiring'} uploadOnSubmit multiple={false} altText={form.title || 'hiring-main-image'} value={form.imageUrl} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, imageUrl: url })) }} onClear={() => setForm(p => ({ ...p, imageUrl: '' }))} /></Grid>
            <Grid item xs={12} md={3}><CustomTextField select fullWidth label='Status' value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'active' }))}><MenuItem value='active'>Active</MenuItem><MenuItem value='inactive'>Inactive</MenuItem></CustomTextField></Grid>
            <Grid item xs={12} md={3}><CustomTextField select fullWidth label='Has Page' value={form.hasPage ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, hasPage: e.target.value === 'true' }))}><MenuItem value='true'>True</MenuItem><MenuItem value='false'>False</MenuItem></CustomTextField></Grid>
            <Grid item xs={12} md={3}><CustomTextField fullWidth label='Meta Title' value={form.metaTitle} onChange={e => setForm(p => ({ ...p, metaTitle: e.target.value ?? '' }))} /></Grid>
            <Grid item xs={12} md={3}><CustomTextField fullWidth label='Meta Description' value={form.metaDescription} onChange={e => setForm(p => ({ ...p, metaDescription: e.target.value ?? '' }))} /></Grid>

            <Grid item xs={12}><Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>Template Data (Accordions)</Typography><Box sx={sectionWrapperSx}>
              <Accordion expanded={expanded === 'hero'} onChange={(_, o) => setExpanded(o ? 'hero' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Hero Section</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Hero Title' value={form.template.hero.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, title: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Hero Subtitle' value={form.template.hero.subtitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, subtitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Hero Description (HTML)</Typography><HtmlEditorField value={form.template.hero.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, description: v } } }))} /></Grid>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Hero CTA Text' value={form.template.hero.buttonText} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, buttonText: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Hero CTA Link' value={form.template.hero.buttonLink} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, buttonLink: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Hero Image Alt' value={form.template.hero.imageAlt} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, imageAlt: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12}><GlobalImageUploader ref={heroImageUploaderRef} label='Hero Image' folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-hero`} uploadOnSubmit multiple={false} altText={form.template.hero.imageAlt || 'hiring-hero-image'} value={form.template.hero.image} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, image: url } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, hero: { ...p.template.hero, image: '' } } }))} /></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'hiringPageData'} onChange={(_, o) => setExpanded(o ? 'hiringPageData' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Hiring Page Data</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Main Title' value={form.template.hiringPageData.mainTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, mainTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Highlight Title' value={form.template.hiringPageData.highlightTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, highlightTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Subtitle' value={form.template.hiringPageData.subtitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, subtitle: e.target.value ?? '' } } }))} /></Grid>
                    {form.template.hiringPageData.cards.map((card, index) => (
                      <Grid item xs={12} key={`hiring-page-card-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={card.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.map((c, i) => i === index ? { ...c, id: Number(e.target.value ?? 0) || 0 } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={card.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.map((c, i) => i === index ? { ...c, title: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Category' value={card.category} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.map((c, i) => i === index ? { ...c, category: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={4}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Features (one per line)</Typography><CustomTextField fullWidth multiline rows={3} value={card.featuresText} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.map((c, i) => i === index ? { ...c, featuresText: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { hiringPageCardIconRefs.current[index] = el }} label={`Card ${index + 1} Icon`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-hiring-page-card-${index}`} uploadOnSubmit multiple={false} altText={`hiring-page-card-${index + 1}-icon`} value={card.icon} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.map((c, i) => i === index ? { ...c, icon: url } : c) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.map((c, i) => i === index ? { ...c, icon: '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: p.template.hiringPageData.cards.length > 1 ? p.template.hiringPageData.cards.filter((_, i) => i !== index) : p.template.hiringPageData.cards } } }))}>Remove Card</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, hiringPageData: { ...p.template.hiringPageData, cards: [...p.template.hiringPageData.cards, { id: p.template.hiringPageData.cards.length + 1, title: '', category: '', icon: '', featuresText: '' }] } } }))}>Add Card</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'offshoreDeveloper'} onChange={(_, o) => setExpanded(o ? 'offshoreDeveloper' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>How You Can Hire Offshore Developer</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {form.template.offshoreDeveloper.cards.map((card, index) => (
                      <Grid item xs={12} key={`offshore-card-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={card.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.map((c, i) => i === index ? { ...c, id: Number(e.target.value ?? 0) || 0 } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={card.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.map((c, i) => i === index ? { ...c, title: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Label' value={card.label} onChange={e => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.map((c, i) => i === index ? { ...c, label: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={4}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Description (HTML)</Typography><HtmlEditorField value={card.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.map((c, i) => i === index ? { ...c, description: v } : c) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { offshoreCardIconRefs.current[index] = el }} label={`Offshore Card ${index + 1} Icon`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-offshore-card-${index}`} uploadOnSubmit multiple={false} altText={`offshore-card-${index + 1}-icon`} value={card.icon} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.map((c, i) => i === index ? { ...c, icon: url } : c) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.map((c, i) => i === index ? { ...c, icon: '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: p.template.offshoreDeveloper.cards.length > 1 ? p.template.offshoreDeveloper.cards.filter((_, i) => i !== index) : p.template.offshoreDeveloper.cards } } }))}>Remove Card</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, offshoreDeveloper: { cards: [...p.template.offshoreDeveloper.cards, { id: p.template.offshoreDeveloper.cards.length + 1, title: '', description: '', icon: '', label: '' }] } } }))}>Add Card</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'whyChooseNext'} onChange={(_, o) => setExpanded(o ? 'whyChooseNext' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Why Choose Next</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Main Title' value={form.template.whyChooseNext.mainTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, mainTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Middle Title' value={form.template.whyChooseNext.middleTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, middleTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='End Title' value={form.template.whyChooseNext.endTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, endTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Main Description (HTML)</Typography><HtmlEditorField value={form.template.whyChooseNext.mainDescription} onChange={v => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, mainDescription: v } } }))} /></Grid>
                    {form.template.whyChooseNext.cards.map((card, index) => (
                      <Grid item xs={12} key={`why-next-card-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={card.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.map((c, i) => i === index ? { ...c, id: Number(e.target.value ?? 0) || 0 } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={card.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.map((c, i) => i === index ? { ...c, title: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Label' value={card.label} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.map((c, i) => i === index ? { ...c, label: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={4}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Description (HTML)</Typography><HtmlEditorField value={card.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.map((c, i) => i === index ? { ...c, description: v } : c) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { whyChooseNextCardIconRefs.current[index] = el }} label={`Why Choose Next Card ${index + 1} Icon`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-why-next-card-${index}`} uploadOnSubmit multiple={false} altText={`why-next-card-${index + 1}-icon`} value={card.icon} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.map((c, i) => i === index ? { ...c, icon: url } : c) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.map((c, i) => i === index ? { ...c, icon: '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: p.template.whyChooseNext.cards.length > 1 ? p.template.whyChooseNext.cards.filter((_, i) => i !== index) : p.template.whyChooseNext.cards } } }))}>Remove Card</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseNext: { ...p.template.whyChooseNext, cards: [...p.template.whyChooseNext.cards, { id: p.template.whyChooseNext.cards.length + 1, title: '', description: '', icon: '', label: '' }] } } }))}>Add Card</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'technicalExperts'} onChange={(_, o) => setExpanded(o ? 'technicalExperts' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Our Technical Experts</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Main Title' value={form.template.technicalExperts.mainTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, mainTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Highlight Title' value={form.template.technicalExperts.highlightTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, highlightTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Subtitle' value={form.template.technicalExperts.subtitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, subtitle: e.target.value ?? '' } } }))} /></Grid>
                    {form.template.technicalExperts.cards.map((card, index) => (
                      <Grid item xs={12} key={`technical-expert-card-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={card.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.map((c, i) => i === index ? { ...c, id: Number(e.target.value ?? 0) || 0 } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={card.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.map((c, i) => i === index ? { ...c, title: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Category' value={card.category} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.map((c, i) => i === index ? { ...c, category: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={4}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Features (one per line)</Typography><CustomTextField fullWidth multiline rows={3} value={card.featuresText} onChange={e => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.map((c, i) => i === index ? { ...c, featuresText: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { technicalExpertsCardIconRefs.current[index] = el }} label={`Technical Expert Card ${index + 1} Icon`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-technical-card-${index}`} uploadOnSubmit multiple={false} altText={`technical-card-${index + 1}-icon`} value={card.icon} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.map((c, i) => i === index ? { ...c, icon: url } : c) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.map((c, i) => i === index ? { ...c, icon: '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: p.template.technicalExperts.cards.length > 1 ? p.template.technicalExperts.cards.filter((_, i) => i !== index) : p.template.technicalExperts.cards } } }))}>Remove Card</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, technicalExperts: { ...p.template.technicalExperts, cards: [...p.template.technicalExperts.cards, { id: p.template.technicalExperts.cards.length + 1, title: '', category: '', icon: '', featuresText: '' }] } } }))}>Add Card</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'tailoredOffshore'} onChange={(_, o) => setExpanded(o ? 'tailoredOffshore' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Our Tailored Offshore Development</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={form.template.tailoredOffshore.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, title: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Middle Title' value={form.template.tailoredOffshore.middleTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, middleTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Last Title' value={form.template.tailoredOffshore.lastTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, lastTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Header Description (HTML)</Typography><HtmlEditorField value={form.template.tailoredOffshore.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, description: v } } }))} /></Grid>
                    {form.template.tailoredOffshore.cards.map((card, index) => (
                      <Grid item xs={12} key={`tailored-card-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={card.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, id: Number(e.target.value ?? 0) || 0 } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={4}><CustomTextField fullWidth label='Title' value={card.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, title: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Background Width' value={card.bgWidth} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, bgWidth: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Background Height' value={card.bgHeight} onChange={e => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, bgHeight: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Card Description (HTML)</Typography><HtmlEditorField value={card.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, description: v } : c) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { tailoredCardPatternRefs.current[index] = el }} label={`Card ${index + 1} Background Pattern`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-tailored-card-${index}`} uploadOnSubmit multiple={false} altText={`tailored-card-${index + 1}-bg`} value={card.bgPattern} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, bgPattern: url } : c) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.map((c, i) => i === index ? { ...c, bgPattern: '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: p.template.tailoredOffshore.cards.length > 1 ? p.template.tailoredOffshore.cards.filter((_, i) => i !== index) : p.template.tailoredOffshore.cards } } }))}>Remove Card</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, tailoredOffshore: { ...p.template.tailoredOffshore, cards: [...p.template.tailoredOffshore.cards, { id: p.template.tailoredOffshore.cards.length + 1, title: '', description: '', bgPattern: '', bgWidth: '', bgHeight: '' }] } } }))}>Add Card</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'hiringProcess'} onChange={(_, o) => setExpanded(o ? 'hiringProcess' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>How We Hire Developer</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Main Title' value={form.template.hiringProcess.mainTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, mainTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Highlight Title' value={form.template.hiringProcess.highlightTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, highlightTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={4}><CustomTextField fullWidth label='Subtitle' value={form.template.hiringProcess.subtitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, subtitle: e.target.value ?? '' } } }))} /></Grid>
                    {form.template.hiringProcess.steps.map((step, index) => (
                      <Grid item xs={12} key={`step-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth label='Step ID' value={step.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, id: e.target.value ?? '' } : s) } } }))} /></Grid>
                          <Grid item xs={12} md={5}><CustomTextField fullWidth label='Title' value={step.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, title: e.target.value ?? '' } : s) } } }))} /></Grid>
                          <Grid item xs={12} md={5}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Description (HTML)</Typography><HtmlEditorField value={step.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, description: v } : s) } } }))} /></Grid>
                          <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Extra Content (HTML)</Typography><HtmlEditorField value={step.extraContent} onChange={v => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, extraContent: v } : s) } } }))} /></Grid>
                          {step.bullets.map((bullet, bulletIndex) => (
                            <Grid item xs={12} key={`step-${index}-bullet-${bulletIndex}`}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}><CustomTextField fullWidth label='Bullet Label' value={bullet.label} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, bullets: s.bullets.map((b, j) => j === bulletIndex ? { ...b, label: e.target.value ?? '' } : b) } : s) } } }))} /></Grid>
                                <Grid item xs={12} md={7}><CustomTextField fullWidth label='Bullet Text' value={bullet.text} onChange={e => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, bullets: s.bullets.map((b, j) => j === bulletIndex ? { ...b, text: e.target.value ?? '' } : b) } : s) } } }))} /></Grid>
                                <Grid item xs={12} md={1}><Button color='error' fullWidth onClick={() => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, bullets: s.bullets.length > 1 ? s.bullets.filter((_, j) => j !== bulletIndex) : s.bullets } : s) } } }))}>-</Button></Grid>
                              </Grid>
                            </Grid>
                          ))}
                          <Grid item xs={12}><Button variant='outlined' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.map((s, i) => i === index ? { ...s, bullets: [...s.bullets, { label: '', text: '' }] } : s) } } }))}>Add Bullet</Button></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: p.template.hiringProcess.steps.length > 1 ? p.template.hiringProcess.steps.filter((_, i) => i !== index) : p.template.hiringProcess.steps } } }))}>Remove Step</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, hiringProcess: { ...p.template.hiringProcess, steps: [...p.template.hiringProcess.steps, { id: `${p.template.hiringProcess.steps.length + 1}`.padStart(2, '0'), title: '', description: '', extraContent: '', bullets: [{ label: '', text: '' }] }] } } }))}>Add Step</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'programmerSkills'} onChange={(_, o) => setExpanded(o ? 'programmerSkills' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Hire The Best Offshore Programmer</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Main Title' value={form.template.programmerSkills.mainTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, mainTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Highlight Title' value={form.template.programmerSkills.highlightTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, highlightTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Brand Name' value={form.template.programmerSkills.brandName} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, brandName: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Subtitle' value={form.template.programmerSkills.subtitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, subtitle: e.target.value ?? '' } } }))} /></Grid>
                    {form.template.programmerSkills.cards.map((card, index) => (
                      <Grid item xs={12} key={`programmer-skill-card-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={card.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: p.template.programmerSkills.cards.map((c, i) => i === index ? { ...c, id: Number(e.target.value ?? 0) || 0 } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={5}><CustomTextField fullWidth label='Title' value={card.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: p.template.programmerSkills.cards.map((c, i) => i === index ? { ...c, title: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12} md={5}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Skills (one per line)</Typography><CustomTextField fullWidth multiline rows={3} value={card.skillsText} onChange={e => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: p.template.programmerSkills.cards.map((c, i) => i === index ? { ...c, skillsText: e.target.value ?? '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { programmerSkillsCardIconRefs.current[index] = el }} label={`Programmer Skill Card ${index + 1} Icon`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-programmer-skill-card-${index}`} uploadOnSubmit multiple={false} altText={`programmer-skill-card-${index + 1}-icon`} value={card.icon} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: p.template.programmerSkills.cards.map((c, i) => i === index ? { ...c, icon: url } : c) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: p.template.programmerSkills.cards.map((c, i) => i === index ? { ...c, icon: '' } : c) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: p.template.programmerSkills.cards.length > 1 ? p.template.programmerSkills.cards.filter((_, i) => i !== index) : p.template.programmerSkills.cards } } }))}>Remove Card</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, programmerSkills: { ...p.template.programmerSkills, cards: [...p.template.programmerSkills.cards, { id: p.template.programmerSkills.cards.length + 1, title: '', icon: '', skillsText: '' }] } } }))}>Add Card</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'cutCost'} onChange={(_, o) => setExpanded(o ? 'cutCost' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Cut Cost Not Talent</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={form.template.cutCostNotTalent.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, title: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Middle Title' value={form.template.cutCostNotTalent.middleTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, middleTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Last Title' value={form.template.cutCostNotTalent.lastTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, lastTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Highlight' value={form.template.cutCostNotTalent.highlight} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, highlight: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Description (HTML)</Typography><HtmlEditorField value={form.template.cutCostNotTalent.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, description: v } } }))} /></Grid>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Button Text' value={form.template.cutCostNotTalent.buttonText} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, buttonText: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={6}><CustomTextField fullWidth label='Button Link' value={form.template.cutCostNotTalent.buttonLink} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, buttonLink: e.target.value ?? '' } } }))} /></Grid>
                    {form.template.cutCostNotTalent.features.map((feature, index) => (
                      <Grid item xs={12} key={`cut-cost-feature-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={5}><CustomTextField fullWidth label='Feature Text' value={feature.text} onChange={e => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, features: p.template.cutCostNotTalent.features.map((f, i) => i === index ? { ...f, text: e.target.value ?? '' } : f) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { cutCostFeatureIconRefs.current[index] = el }} label={`Feature ${index + 1} Icon`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-cut-cost-feature-${index}`} uploadOnSubmit multiple={false} altText={`cut-cost-feature-${index + 1}-icon`} value={feature.icon} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, features: p.template.cutCostNotTalent.features.map((f, i) => i === index ? { ...f, icon: url } : f) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, features: p.template.cutCostNotTalent.features.map((f, i) => i === index ? { ...f, icon: '' } : f) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, features: p.template.cutCostNotTalent.features.length > 1 ? p.template.cutCostNotTalent.features.filter((_, i) => i !== index) : p.template.cutCostNotTalent.features } } }))}>Remove Feature</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, cutCostNotTalent: { ...p.template.cutCostNotTalent, features: [...p.template.cutCostNotTalent.features, { icon: '', text: '' }] } } }))}>Add Feature</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'outsourcing'} onChange={(_, o) => setExpanded(o ? 'outsourcing' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Choose Best Suitable Cooperation</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {form.template.outsourcing.slides.map((slide, slideIndex) => (
                      <Grid item xs={12} key={`outsourcing-slide-${slideIndex}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={slide.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, title: e.target.value ?? '' } : s) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Middle Title' value={slide.middleTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, middleTitle: e.target.value ?? '' } : s) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Last Title' value={slide.lastTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, lastTitle: e.target.value ?? '' } : s) } } }))} /></Grid>
                          <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Description (HTML)</Typography><HtmlEditorField value={slide.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, description: v } : s) } } }))} /></Grid>
                          {slide.items.map((item, itemIndex) => (
                            <Grid item xs={12} key={`outsourcing-slide-${slideIndex}-item-${itemIndex}`}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={3}><CustomTextField fullWidth label='Item Title' value={item.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.map((it, j) => j === itemIndex ? { ...it, title: e.target.value ?? '' } : it) } : s) } } }))} /></Grid>
                                <Grid item xs={12} md={3}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Item Description (HTML)</Typography><HtmlEditorField value={item.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.map((it, j) => j === itemIndex ? { ...it, description: v } : it) } : s) } } }))} /></Grid>
                                <Grid item xs={12}><GlobalImageUploader ref={el => { if (!outsourcingItemImageRefs.current[slideIndex]) outsourcingItemImageRefs.current[slideIndex] = []; outsourcingItemImageRefs.current[slideIndex][itemIndex] = el }} label={`Slide ${slideIndex + 1} Item ${itemIndex + 1} Image`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-outsourcing-${slideIndex}-${itemIndex}-image`} uploadOnSubmit multiple={false} altText={`outsourcing-${slideIndex + 1}-${itemIndex + 1}-image`} value={item.image} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.map((it, j) => j === itemIndex ? { ...it, image: url } : it) } : s) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.map((it, j) => j === itemIndex ? { ...it, image: '' } : it) } : s) } } }))} /></Grid>
                                <Grid item xs={12}><GlobalImageUploader ref={el => { if (!outsourcingItemHoverImageRefs.current[slideIndex]) outsourcingItemHoverImageRefs.current[slideIndex] = []; outsourcingItemHoverImageRefs.current[slideIndex][itemIndex] = el }} label={`Slide ${slideIndex + 1} Item ${itemIndex + 1} Hover Image`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-outsourcing-${slideIndex}-${itemIndex}-hover`} uploadOnSubmit multiple={false} altText={`outsourcing-${slideIndex + 1}-${itemIndex + 1}-hover`} value={item.hoverImage} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.map((it, j) => j === itemIndex ? { ...it, hoverImage: url } : it) } : s) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.map((it, j) => j === itemIndex ? { ...it, hoverImage: '' } : it) } : s) } } }))} /></Grid>
                                <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: s.items.length > 1 ? s.items.filter((_, j) => j !== itemIndex) : s.items } : s) } } }))}>Remove Item</Button></Grid>
                              </Grid>
                            </Grid>
                          ))}
                          <Grid item xs={12}><Button variant='outlined' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.map((s, i) => i === slideIndex ? { ...s, items: [...s.items, { title: '', description: '', image: '', hoverImage: '' }] } : s) } } }))}>Add Item</Button></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: p.template.outsourcing.slides.length > 1 ? p.template.outsourcing.slides.filter((_, i) => i !== slideIndex) : p.template.outsourcing.slides } } }))}>Remove Slide</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, outsourcing: { slides: [...p.template.outsourcing.slides, { title: '', middleTitle: '', lastTitle: '', description: '', items: [{ title: '', description: '', image: '', hoverImage: '' }] }] } } }))}>Add Slide</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'whyChooseTechionik'} onChange={(_, o) => setExpanded(o ? 'whyChooseTechionik' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>Why Choose Techionik</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={form.template.whyChooseTechionik.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, title: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Middle Title' value={form.template.whyChooseTechionik.middleTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, middleTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12} md={3}><CustomTextField fullWidth label='Last Title' value={form.template.whyChooseTechionik.lastTitle} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, lastTitle: e.target.value ?? '' } } }))} /></Grid>
                    <Grid item xs={12}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Description (HTML)</Typography><HtmlEditorField value={form.template.whyChooseTechionik.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, description: v } } }))} /></Grid>
                    {form.template.whyChooseTechionik.items.map((item, index) => (
                      <Grid item xs={12} key={`why-techionik-item-${index}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2}><CustomTextField fullWidth type='number' label='ID' value={item.id} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, id: Number(e.target.value ?? 0) || 0 } : it) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Title' value={item.title} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, title: e.target.value ?? '' } : it) } } }))} /></Grid>
                          <Grid item xs={12} md={3}><CustomTextField fullWidth label='Alt' value={item.alt} onChange={e => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, alt: e.target.value ?? '' } : it) } } }))} /></Grid>
                          <Grid item xs={12} md={4}><Typography variant='caption' sx={{ display: 'block', mb: 1 }}>Item Description (HTML)</Typography><HtmlEditorField value={item.description} onChange={v => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, description: v } : it) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { whyChooseTechionikImageRefs.current[index] = el }} label={`Item ${index + 1} Image`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-why-techionik-${index}-image`} uploadOnSubmit multiple={false} altText={`why-techionik-item-${index + 1}-image`} value={item.image} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, image: url } : it) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, image: '' } : it) } } }))} /></Grid>
                          <Grid item xs={12}><GlobalImageUploader ref={el => { whyChooseTechionikHoverImageRefs.current[index] = el }} label={`Item ${index + 1} Hover Image`} folder='images/hiring' type='hiring' entityId={`${form.slug || 'hiring'}-why-techionik-${index}-hover`} uploadOnSubmit multiple={false} altText={`why-techionik-item-${index + 1}-hover`} value={item.hoverImage} onUploaded={items => { const url = items?.[0]?.secureUrl || items?.[0]?.url || ''; if (url) setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, hoverImage: url } : it) } } })) }} onClear={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.map((it, i) => i === index ? { ...it, hoverImage: '' } : it) } } }))} /></Grid>
                          <Grid item xs={12}><Button color='error' size='small' onClick={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: p.template.whyChooseTechionik.items.length > 1 ? p.template.whyChooseTechionik.items.filter((_, i) => i !== index) : p.template.whyChooseTechionik.items } } }))}>Remove Item</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, whyChooseTechionik: { ...p.template.whyChooseTechionik, items: [...p.template.whyChooseTechionik.items, { id: p.template.whyChooseTechionik.items.length + 1, title: '', description: '', image: '', hoverImage: '', alt: '' }] } } }))}>Add Item</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded === 'faq'} onChange={(_, o) => setExpanded(o ? 'faq' : false)}>
                <AccordionSummary expandIcon={<Icon icon='tabler:chevron-down' />}><Typography variant='subtitle2'>FAQ</Typography></AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {form.template.faq.map((f, idx) => (
                      <Grid item xs={12} key={`faq-${idx}`}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={5}><CustomTextField fullWidth label='Question' value={f.question} onChange={e => setForm(p => ({ ...p, template: { ...p.template, faq: p.template.faq.map((x, i) => (i === idx ? { ...x, question: e.target.value ?? '' } : x)) } }))} /></Grid>
                          <Grid item xs={12} md={6}><CustomTextField fullWidth multiline rows={3} label='Answer' value={f.answer} onChange={e => setForm(p => ({ ...p, template: { ...p.template, faq: p.template.faq.map((x, i) => (i === idx ? { ...x, answer: e.target.value ?? '' } : x)) } }))} /></Grid>
                          <Grid item xs={12} md={1}><Button color='error' fullWidth onClick={() => setForm(p => ({ ...p, template: { ...p.template, faq: p.template.faq.length > 1 ? p.template.faq.filter((_, i) => i !== idx) : p.template.faq } }))}>-</Button></Grid>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid item xs={12}><Button variant='outlined' onClick={() => setForm(p => ({ ...p, template: { ...p.template, faq: [...p.template.faq, { question: '', answer: '' }] } }))}>Add FAQ</Button></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box></Grid>
          </Grid>
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default HiringForm
