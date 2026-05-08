import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/components/media/GlobalImageUploader'
import { uploadPendingFromRef } from 'src/components/media/uploadOnSubmit'

type Option = { id: string; name: string; slug?: string }

type FormState = {
  name: string
  slug: string
  logoUrl: string
  websiteUrl: string
  shortDescription: string
  metaTitle: string
  metaDescription: string
  metaKeyWords: string
  sortOrder: number
  isActive: boolean
  industryId: string
  subIndustryId: string
  serviceId: string
  subServiceId: string
  caseStudyId: string
}

const defaultForm = (): FormState => ({
  name: '',
  slug: '',
  logoUrl: '',
  websiteUrl: '',
  shortDescription: '',
  metaTitle: '',
  metaDescription: '',
  metaKeyWords: '',
  sortOrder: 1,
  isActive: true,
  industryId: '',
  subIndustryId: '',
  serviceId: '',
  subServiceId: '',
  caseStudyId: ''
})

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const mapOptions = (items: any[] = []): Option[] =>
  items
    .map((item: any) => ({
      id: `${item?.id ?? item?._id ?? ''}`.trim(),
      name: `${item?.name ?? item?.title ?? ''}`.trim(),
      slug: `${item?.slug ?? ''}`.trim() || undefined
    }))
    .filter((item: Option) => item.id && item.name)

const ClientForm = () => {
  const router = useRouter()
  const mode = `${router.query?.mode ?? 'create'}` === 'edit' ? 'edit' : 'create'
  const clientId = `${router.query?.id ?? ''}`.trim()

  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [form, setForm] = useState<FormState>(defaultForm())
  const [industries, setIndustries] = useState<Option[]>([])
  const [subIndustries, setSubIndustries] = useState<Option[]>([])
  const [services, setServices] = useState<Option[]>([])
  const [subServices, setSubServices] = useState<Option[]>([])
  const [caseStudies, setCaseStudies] = useState<Option[]>([])
  const logoUploaderRef = useRef<GlobalImageUploaderRef | null>(null)

  const selectedIndustry = useMemo(() => industries.find(x => x.id === form.industryId), [industries, form.industryId])
  const selectedService = useMemo(() => services.find(x => x.id === form.serviceId), [services, form.serviceId])

  useEffect(() => {
    if (slugTouched) return
    setForm(prev => ({ ...prev, slug: slugify(prev.name) }))
  }, [form.name, slugTouched])

  const loadCaseStudies = async () => {
    try {
      const res = await axiosInstance.get('/api/dropdowns/case-studies')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setCaseStudies(mapOptions(list))
    } catch (_error) {
      setCaseStudies([])
    }
  }

  const loadClientFilters = async (params?: { industrySlug?: string; industryId?: string; serviceSlug?: string; serviceId?: string }) => {
    try {
      const res = await axiosInstance.get('/api/dropdowns/clients-filters', { params })
      const data = res?.data?.data ?? res?.data ?? {}
      setIndustries(mapOptions(Array.isArray(data?.industries) ? data.industries : []))
      setSubIndustries(mapOptions(Array.isArray(data?.subIndustries) ? data.subIndustries : []))
      setServices(mapOptions(Array.isArray(data?.services) ? data.services : []))
      setSubServices(mapOptions(Array.isArray(data?.subServices) ? data.subServices : []))
      return true
    } catch (_error) {
      // fallback to available endpoints when helper endpoint is unavailable
      try {
        const [industriesRes, servicesRes] = await Promise.all([
          axiosInstance.get('/api/dropdowns/industries'),
          axiosInstance.get('/api/dropdowns/services')
        ])
        const industryList = Array.isArray(industriesRes?.data?.data) ? industriesRes.data.data : Array.isArray(industriesRes?.data) ? industriesRes.data : []
        const serviceList = Array.isArray(servicesRes?.data?.data) ? servicesRes.data.data : Array.isArray(servicesRes?.data) ? servicesRes.data : []
        const mappedIndustries = mapOptions(industryList)
        const mappedServices = mapOptions(serviceList)
        setIndustries(mappedIndustries)
        setServices(mappedServices)

        if (params?.industrySlug) {
          const subRes = await axiosInstance.get('/api/dropdowns/industries/sub-industries', { params: { industrySlug: params.industrySlug } })
          const subList = Array.isArray(subRes?.data?.data) ? subRes.data.data : Array.isArray(subRes?.data) ? subRes.data : []
          setSubIndustries(mapOptions(subList))
        } else {
          setSubIndustries([])
        }

        if (params?.serviceSlug) {
          const subRes = await axiosInstance.get('/api/dropdowns/services/sub-services', { params: { serviceSlug: params.serviceSlug } })
          const subList = Array.isArray(subRes?.data?.data) ? subRes.data.data : Array.isArray(subRes?.data) ? subRes.data : []
          setSubServices(mapOptions(subList))
        } else {
          setSubServices([])
        }
      } catch (_fallbackError) {
        setIndustries([])
        setSubIndustries([])
        setServices([])
        setSubServices([])
      }
      return false
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([loadClientFilters(), loadCaseStudies()])
      setLoading(false)
    }
    init().then(() => null)
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !clientId) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(`/api/clients/${encodeURIComponent(clientId)}`)
        const item = res?.data?.data ?? res?.data ?? {}
        const next: FormState = {
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          logoUrl: `${item?.logoUrl ?? ''}`,
          websiteUrl: `${item?.websiteUrl ?? ''}`,
          shortDescription: `${item?.shortDescription ?? ''}`,
          metaTitle: `${item?.metaTitle ?? ''}`,
          metaDescription: `${item?.metaDescription ?? ''}`,
          metaKeyWords: `${item?.metaKeyWords ?? ''}`,
          sortOrder: Number(item?.sortOrder ?? 1) || 1,
          isActive: item?.isActive ?? true,
          industryId: `${item?.industryId ?? item?.industry?.id ?? item?.industry?._id ?? ''}`,
          subIndustryId: `${item?.subIndustryId ?? item?.subIndustry?.id ?? item?.subIndustry?._id ?? ''}`,
          serviceId: `${item?.serviceId ?? item?.service?.id ?? item?.service?._id ?? ''}`,
          subServiceId: `${item?.subServiceId ?? item?.subService?.id ?? item?.subService?._id ?? ''}`,
          caseStudyId: `${item?.caseStudyId ?? item?.caseStudy?.id ?? item?.caseStudy?._id ?? ''}`
        }
        setForm(next)
        setSlugTouched(true)

        await loadClientFilters({
          industryId: next.industryId || undefined,
          serviceId: next.serviceId || undefined
        })
      } catch (error: any) {
        toast.error(error?.response?.data?.message || error?.message || 'Failed to load client.')
      } finally {
        setLoading(false)
      }
    }
    load().then(() => null)
  }, [mode, clientId])

  const onChangeIndustry = async (industryId: string) => {
    const option = industries.find(x => x.id === industryId)
    setForm(prev => ({ ...prev, industryId, subIndustryId: '' }))
    await loadClientFilters({
      industryId: industryId || undefined,
      industrySlug: option?.slug || undefined,
      serviceId: form.serviceId || undefined,
      serviceSlug: selectedService?.slug || undefined
    })
  }

  const onChangeService = async (serviceId: string) => {
    const option = services.find(x => x.id === serviceId)
    setForm(prev => ({ ...prev, serviceId, subServiceId: '' }))
    await loadClientFilters({
      serviceId: serviceId || undefined,
      serviceSlug: option?.slug || undefined,
      industryId: form.industryId || undefined,
      industrySlug: selectedIndustry?.slug || undefined
    })
  }

  const save = async () => {
    if (!form.name.trim()) return toast.error('Client name is required.')
    if (!form.slug.trim()) return toast.error('Client slug is required.')

    setLoading(true)
    const uploadedLogoUrl = await uploadPendingFromRef(logoUploaderRef.current, form.logoUrl)
    const payload: any = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      logoUrl: uploadedLogoUrl.trim(),
      websiteUrl: form.websiteUrl.trim(),
      shortDescription: form.shortDescription.trim(),
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      metaKeyWords: form.metaKeyWords.trim(),
      sortOrder: Number(form.sortOrder ?? 1) || 1,
      isActive: !!form.isActive
    }
    if (form.industryId) payload.industryId = form.industryId
    if (form.subIndustryId) payload.subIndustryId = form.subIndustryId
    if (form.serviceId) payload.serviceId = form.serviceId
    if (form.subServiceId) payload.subServiceId = form.subServiceId
    if (form.caseStudyId) payload.caseStudyId = form.caseStudyId

    try {
      if (mode === 'edit' && clientId) {
        await axiosInstance.put(`/api/clients/${encodeURIComponent(clientId)}`, payload)
        toast.success('Client updated successfully.')
      } else {
        await axiosInstance.post('/api/clients', payload)
        toast.success('Client created successfully.')
      }
      router.push('/clients/list')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save client.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant='h5'>{mode === 'edit' ? 'Edit Client' : 'Add Client'}</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => router.push('/clients/list')}>
              Back
            </Button>
            <Button variant='contained' onClick={save}>
              {mode === 'edit' ? 'Update Client' : 'Create Client'}
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
            <Grid item xs={12}>
              <GlobalImageUploader
                ref={logoUploaderRef}
                label='Client Logo'
                folder='images/clients'
                type='client'
                entityId={form.slug || form.name}
                uploadOnSubmit
                multiple={false}
                altText={form.name || 'client-logo'}
                value={form.logoUrl}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setForm(prev => ({ ...prev, logoUrl: url }))
                }}
                onClear={() => setForm(prev => ({ ...prev, logoUrl: '' }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Website URL' value={form.websiteUrl} onChange={e => setForm(prev => ({ ...prev, websiteUrl: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField
                fullWidth
                type='number'
                label='Sort Order'
                value={form.sortOrder}
                onChange={e => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value ?? 1) || 1 }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomTextField select fullWidth label='Status' value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label='Short Description'
                value={form.shortDescription}
                onChange={e => setForm(prev => ({ ...prev, shortDescription: e.target.value ?? '' }))}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                SEO
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='Meta Title' value={form.metaTitle} onChange={e => setForm(prev => ({ ...prev, metaTitle: e.target.value ?? '' }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={2}
                label='Meta Description'
                value={form.metaDescription}
                onChange={e => setForm(prev => ({ ...prev, metaDescription: e.target.value ?? '' }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='Meta Keywords' value={form.metaKeyWords} onChange={e => setForm(prev => ({ ...prev, metaKeyWords: e.target.value ?? '' }))} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                Filters Mapping
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Industry' value={form.industryId} onChange={e => onChangeIndustry(e.target.value ?? '')}>
                <MenuItem value=''>None</MenuItem>
                {industries.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                fullWidth
                label='Sub Industry'
                value={form.subIndustryId}
                disabled={!form.industryId}
                onChange={e => setForm(prev => ({ ...prev, subIndustryId: e.target.value ?? '' }))}
              >
                <MenuItem value=''>None</MenuItem>
                {subIndustries.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Service' value={form.serviceId} onChange={e => onChangeService(e.target.value ?? '')}>
                <MenuItem value=''>None</MenuItem>
                {services.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                fullWidth
                label='Sub Service'
                value={form.subServiceId}
                disabled={!form.serviceId}
                onChange={e => setForm(prev => ({ ...prev, subServiceId: e.target.value ?? '' }))}
              >
                <MenuItem value=''>None</MenuItem>
                {subServices.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Case Study' value={form.caseStudyId} onChange={e => setForm(prev => ({ ...prev, caseStudyId: e.target.value ?? '' }))}>
                <MenuItem value=''>None</MenuItem>
                {caseStudies.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default ClientForm
