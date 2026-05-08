import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/custom-components/media/GlobalImageUploader'
import { uploadPendingFromRef } from 'src/custom-components/media/uploadOnSubmit'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { stateFromHTML } from 'draft-js-import-html'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type OptionItem = {
  id: string
  name: string
}

type CareerFormState = {
  title: string
  slug: string
  departmentId: string
  locationId: string
  image: string
  htmlText: string
  industry: string
  dateOpen: string
  salary: string
  jobType: string
  workExperience: string
  city: string
  remoteOnsite: string
  experiences: string
  stateProvince: string
  country: string
  zipPostalCode: string
  jobExpired: boolean
}

const defaultForm: CareerFormState = {
  title: '',
  slug: '',
  departmentId: '',
  locationId: '',
  image: '',
  htmlText: '',
  industry: '',
  dateOpen: '',
  salary: '',
  jobType: '',
  workExperience: '',
  city: '',
  remoteOnsite: '',
  experiences: '',
  stateProvince: '',
  country: '',
  zipPostalCode: '',
  jobExpired: false
}

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const toDatetimeLocal = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => `${n}`.padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const getErrorMessage = (error: any) => error?.response?.data?.message || error?.message || 'Something went wrong.'

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
  if (raw.startsWith('data:image/')) return raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const origin = getPublicOrigin()
  if (!origin) return raw
  return `${origin}/${raw.replace(/^\/+/, '')}`
}

const normalizeDefaultInlineTextColor = (html: string) =>
  `${html || ''}`
    .replace(/color:\s*rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000000\s*;?/gi, 'color: rgb(255,255,255);')
    .replace(/color:\s*#000\s*;?/gi, 'color: rgb(255,255,255);')

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(`${reader.result || ''}`)
    reader.onerror = () => reject(new Error('Failed to convert image to base64'))
    reader.readAsDataURL(file)
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

const HtmlEditorField = ({
  editorState,
  onEditorStateChange,
  onUploadImage
}: {
  editorState: EditorState
  onEditorStateChange: (state: EditorState) => void
  onUploadImage: (file: File) => Promise<{ data: { link: string } }>
}) => {
  return (
    <EditorWrapper
      sx={{
        '& .rdw-editor-toolbar': {
          border: theme => `1px solid ${theme.palette.divider}`,
          mb: 0
        },
        '& .rdw-editor-main': {
          border: theme => `1px solid ${theme.palette.divider}`,
          borderTop: 'none',
          minHeight: 220,
          px: 2,
          py: 1,
          direction: 'ltr',
          textAlign: 'left'
        },
        '& .rdw-editor-main .DraftEditor-root': {
          direction: 'ltr',
          textAlign: 'left'
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
        onEditorStateChange={onEditorStateChange}
        wrapperClassName='demo-wrapper'
        editorClassName='demo-editor'
        toolbar={{
          options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          image: {
            uploadEnabled: true,
            uploadCallback: onUploadImage,
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
  )
}

const CareerForm = () => {
  const router = useRouter()
  const mode = `${router.query?.mode ?? 'create'}` === 'edit' ? 'edit' : 'create'
  const id = `${router.query?.id ?? ''}`.trim()

  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [form, setForm] = useState<CareerFormState>(defaultForm)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [departments, setDepartments] = useState<OptionItem[]>([])
  const [locations, setLocations] = useState<OptionItem[]>([])
  const imageUploaderRef = useRef<GlobalImageUploaderRef | null>(null)

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/api/dropdowns/career-departments')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      setDepartments(list.map((item: any) => ({ id: `${item?.id ?? item?._id ?? ''}`, name: `${item?.name ?? ''}` })))
    } catch (_error) {
      setDepartments([])
    }
  }

  const fetchLocations = async () => {
    try {
      const res = await axiosInstance.get('/api/dropdowns/career-locations')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      setLocations(list.map((item: any) => ({ id: `${item?.id ?? item?._id ?? ''}`, name: `${item?.name ?? ''}` })))
    } catch (_error) {
      setLocations([])
    }
  }

  useEffect(() => {
    fetchDepartments().then(() => null)
  }, [])

  useEffect(() => {
    fetchLocations().then(() => null)
  }, [])

  useEffect(() => {
    if (slugTouched) return
    setForm(prev => ({ ...prev, slug: slugify(prev.title) }))
  }, [form.title, slugTouched])

  useEffect(() => {
    if (mode !== 'edit' || !id) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/careers/${id}`)
        const item = res?.data?.data ?? {}
        setForm({
          title: `${item?.title ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          departmentId: `${item?.departmentId ?? item?.department?.id ?? ''}`,
          locationId: `${item?.locationId ?? item?.location?.id ?? ''}`,
          image: `${item?.image ?? ''}`,
          htmlText: `${item?.htmlText ?? ''}`,
          industry: `${item?.industry ?? ''}`,
          dateOpen: toDatetimeLocal(`${item?.dateOpen ?? ''}`),
          salary: `${item?.salary ?? ''}`,
          jobType: `${item?.jobType ?? ''}`,
          workExperience: `${item?.workExperience ?? ''}`,
          city: `${item?.city ?? ''}`,
          remoteOnsite: `${item?.remoteOnsite ?? ''}`,
          experiences: `${item?.experiences ?? ''}`,
          stateProvince: `${item?.stateProvince ?? ''}`,
          country: `${item?.country ?? ''}`,
          zipPostalCode: `${item?.zipPostalCode ?? ''}`,
          jobExpired: !!item?.jobExpired
        })
        setEditorState(toEditorState(`${item?.htmlText ?? ''}`))
        setSlugTouched(true)
      } catch (error: any) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    load().then(() => null)
  }, [mode, id])

  const save = async () => {
    if (!form.title.trim()) return toast.error('Career title is required.')
    if (!form.slug.trim()) return toast.error('Career slug is required.')
    setLoading(true)
    try {
      const uploadedImageUrl = await uploadPendingFromRef(imageUploaderRef.current, form.image)
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        departmentId: form.departmentId || undefined,
        locationId: form.locationId || undefined,
        image: uploadedImageUrl.trim(),
        htmlText: form.htmlText,
        industry: form.industry.trim(),
        dateOpen: form.dateOpen ? new Date(form.dateOpen).toISOString() : undefined,
        salary: form.salary.trim(),
        jobType: form.jobType.trim(),
        workExperience: form.workExperience.trim(),
        city: form.city.trim(),
        remoteOnsite: form.remoteOnsite.trim(),
        experiences: form.experiences.trim(),
        stateProvince: form.stateProvince.trim(),
        country: form.country.trim(),
        zipPostalCode: form.zipPostalCode.trim(),
        jobExpired: !!form.jobExpired
      }
      if (mode === 'edit' && id) {
        await axiosInstance.put(`/api/careers/${id}`, payload)
        toast.success('Career updated successfully.')
      } else {
        await axiosInstance.post('/api/careers', payload)
        toast.success('Career created successfully.')
      }
      router.push('/careers/list')
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const uploadEditorImage = async (file: File) => {
    const submitUpload = async (fieldName: 'objfile' | 'file') => {
      const uploadNonce = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const formData = new FormData()
      formData.append(fieldName, file)
      formData.append('altText', form.title || file.name || 'career-content-image')
      formData.append('folder', 'images/careers')
      formData.append('type', 'career')
      const entityBase = id || form.slug || 'career'
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
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5'>{mode === 'edit' ? 'Edit Career' : 'Add Career'}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => router.push('/careers/list')}>
              Back
            </Button>
            <Button variant='contained' onClick={save}>
              {mode === 'edit' ? 'Update Career' : 'Create Career'}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Job Title' value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value ?? '' }))} />
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
              <CustomTextField select fullWidth label='Department' value={form.departmentId} onChange={e => setForm(prev => ({ ...prev, departmentId: e.target.value ?? '', locationId: '' }))}>
                <MenuItem value=''>None</MenuItem>
                {departments.map(dep => (
                  <MenuItem key={dep.id} value={dep.id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Location' value={form.locationId} onChange={e => setForm(prev => ({ ...prev, locationId: e.target.value ?? '' }))}>
                <MenuItem value=''>None</MenuItem>
                {locations.map(loc => (
                  <MenuItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Image URL' value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <GlobalImageUploader
                ref={imageUploaderRef}
                label='Career Image'
                folder='images/careers'
                type='career'
                entityId={id || form.slug || form.title || 'career'}
                uploadOnSubmit
                multiple={false}
                altText={form.title || 'career-image'}
                value={form.image}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setForm(prev => ({ ...prev, image: url }))
                }}
                onClear={() => setForm(prev => ({ ...prev, image: '' }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth type='datetime-local' label='Date Open' value={form.dateOpen} onChange={e => setForm(prev => ({ ...prev, dateOpen: e.target.value ?? '' }))} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField fullWidth label='Industry' value={form.industry} onChange={e => setForm(prev => ({ ...prev, industry: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField fullWidth label='Salary' value={form.salary} onChange={e => setForm(prev => ({ ...prev, salary: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField fullWidth label='Job Type' value={form.jobType} onChange={e => setForm(prev => ({ ...prev, jobType: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Work Experience' value={form.workExperience} onChange={e => setForm(prev => ({ ...prev, workExperience: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Experiences' value={form.experiences} onChange={e => setForm(prev => ({ ...prev, experiences: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField fullWidth label='City' value={form.city} onChange={e => setForm(prev => ({ ...prev, city: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField fullWidth label='State / Province' value={form.stateProvince} onChange={e => setForm(prev => ({ ...prev, stateProvince: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomTextField fullWidth label='Country' value={form.country} onChange={e => setForm(prev => ({ ...prev, country: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Zip / Postal Code' value={form.zipPostalCode} onChange={e => setForm(prev => ({ ...prev, zipPostalCode: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Remote / Onsite' value={form.remoteOnsite} onChange={e => setForm(prev => ({ ...prev, remoteOnsite: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Job Status' value={form.jobExpired ? 'expired' : 'open'} onChange={e => setForm(prev => ({ ...prev, jobExpired: e.target.value === 'expired' }))}>
                <MenuItem value='open'>Open</MenuItem>
                <MenuItem value='expired'>Expired</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
                Job Description (HTML)
              </Typography>
              <HtmlEditorField
                editorState={editorState}
                onEditorStateChange={state => {
                  setEditorState(state)
                  setForm(prev => ({
                    ...prev,
                    htmlText: normalizeDefaultInlineTextColor(draftToHtml(convertToRaw(state.getCurrentContent())))
                  }))
                }}
                onUploadImage={uploadEditorImage}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default CareerForm
