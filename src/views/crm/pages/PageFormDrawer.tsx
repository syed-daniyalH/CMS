import { useEffect, useState } from 'react'
import { Box, Button, Card, Divider, Drawer, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'
import FormSaveButton from 'src/custom-components/form-save-button'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'
import { saveCloseKey, saveNewKey } from 'src/@core/utils/translation-file'

interface Props {
  open: boolean
  data?: any | null
  toggle: (row?: any | null) => void
  onSuccess: () => void
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 4)
}))

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const defaultState: any = {
  title: '',
  slug: '',
  sectionIds: [],
  isTemplate: false,
  isPublished: false,
  seoTitle: '',
  seoDescription: '',
  seoKeywordsText: '',
  seoImage: '',
  heroMediaType: '',
  heroMediaUrl: ''
}

const PageFormDrawer = ({ open, data, toggle, onSuccess }: Props) => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'))
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState<any[]>([])
  const [state, setState] = useState<any>(defaultState)
  const [slugTouched, setSlugTouched] = useState(false)

  useEffect(() => {
    const loadSections = async () => {
      try {
        const res = await axiosInstance.get('/api/sections')
        const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
        setSections(list)
      } catch {
        setSections([])
      }
    }
    if (open) loadSections()
  }, [open])

  useEffect(() => {
    if (data?._id) {
      setState({
        title: data?.title ?? '',
        slug: data?.slug ?? '',
        sectionIds: (data?.sections ?? []).map((item: any) => item?.section?._id ?? item?.section).filter(Boolean),
        isTemplate: Boolean(data?.isTemplate),
        isPublished: Boolean(data?.isPublished),
        seoTitle: data?.seo?.title ?? '',
        seoDescription: data?.seo?.description ?? '',
        seoKeywordsText: (data?.seo?.keywords ?? []).join(', '),
        seoImage: data?.seo?.image ?? '',
        heroMediaType: data?.heroMedia?.type ?? '',
        heroMediaUrl: data?.heroMedia?.url ?? ''
      })
      setSlugTouched(true)
    } else {
      setState(defaultState)
      setSlugTouched(false)
    }
  }, [data, open])

  useEffect(() => {
    if (!slugTouched && !data?._id) {
      setState((prev: any) => ({ ...prev, slug: slugify(prev.title || '') }))
    }
  }, [state.title, slugTouched, data?._id])

  const onSubmit = async (event: any, index: number) => {
    event.preventDefault()
    if (!state.title?.trim()) {
      toast.error('Please enter page title.')
      return
    }
    if (!state.slug?.trim()) {
      toast.error('Please enter page slug.')
      return
    }
    if (!state.sectionIds?.length) {
      toast.error('Please select at least one section.')
      return
    }

    try {
      setLoading(true)
      const payload: any = {
        title: state.title.trim(),
        slug: state.slug.trim(),
        sections: state.sectionIds.map((id: string, idx: number) => ({ section: id, order: idx + 1 })),
        isTemplate: state.isTemplate,
        isPublished: state.isPublished,
        seo: {
          title: state.seoTitle?.trim(),
          description: state.seoDescription?.trim(),
          keywords: state.seoKeywordsText
            ? state.seoKeywordsText
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
          image: state.seoImage?.trim()
        },
        heroMedia: {
          type: state.heroMediaType || undefined,
          url: state.heroMediaUrl?.trim() || undefined
        }
      }

      if (!payload.heroMedia.type || !payload.heroMedia.url) delete payload.heroMedia

      if (data?._id) await axiosInstance.put(`/api/pages/${data._id}`, payload)
      else await axiosInstance.post('/api/pages', payload)

      toast.success(`Page ${data?._id ? 'updated' : 'created'} successfully.`)
      onSuccess()
      if (index === 0) toggle(null)
      else setState(defaultState)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save page.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='top'
      variant='temporary'
      transitionDuration={400}
      onClose={loading ? undefined : () => toggle(null)}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { alignItems: 'center', backgroundColor: 'transparent', mt: 2 } }}
    >
      <Card sx={{ width: hidden ? '70%' : '98%', position: 'relative' }}>
        <Header>
          <Typography variant='h5'>{data?._id ? 'Update Page' : 'Add Page'}</Typography>
          <IconButton size='small' onClick={() => !loading && toggle(null)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Header>
        <Divider />

        <Box sx={{ p: 4, pb: 18, maxHeight: '85vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label={<TypoLabel name='Title' important />} value={state.title} onChange={e => setState((p: any) => ({ ...p, title: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Slug' important />}
                value={state.slug}
                onChange={e => {
                  setSlugTouched(true)
                  setState((p: any) => ({ ...p, slug: e.target.value }))
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                SelectProps={{ multiple: true }}
                label={<TypoLabel name='Sections' important />}
                value={state.sectionIds}
                onChange={e => setState((p: any) => ({ ...p, sectionIds: e.target.value }))}
              >
                {sections.map(item => (
                  <MenuItem key={item?._id} value={item?._id}>
                    {item?.sectionType?.name || item?._id}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Template' value={state.isTemplate ? 'yes' : 'no'} onChange={e => setState((p: any) => ({ ...p, isTemplate: e.target.value === 'yes' }))}>
                <MenuItem value='no'>No</MenuItem>
                <MenuItem value='yes'>Yes</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField select fullWidth label='Published' value={state.isPublished ? 'yes' : 'no'} onChange={e => setState((p: any) => ({ ...p, isPublished: e.target.value === 'yes' }))}>
                <MenuItem value='no'>No</MenuItem>
                <MenuItem value='yes'>Yes</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='SEO Title' value={state.seoTitle} onChange={e => setState((p: any) => ({ ...p, seoTitle: e.target.value }))} />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField fullWidth label='SEO Keywords (comma separated)' value={state.seoKeywordsText} onChange={e => setState((p: any) => ({ ...p, seoKeywordsText: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField multiline rows={3} fullWidth label='SEO Description' value={state.seoDescription} onChange={e => setState((p: any) => ({ ...p, seoDescription: e.target.value }))} />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='SEO Image URL' value={state.seoImage} onChange={e => setState((p: any) => ({ ...p, seoImage: e.target.value }))} />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField select fullWidth label='Hero Media Type' value={state.heroMediaType} onChange={e => setState((p: any) => ({ ...p, heroMediaType: e.target.value }))}>
                <MenuItem value=''>None</MenuItem>
                <MenuItem value='image'>Image</MenuItem>
                <MenuItem value='video'>Video</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomTextField fullWidth label='Hero Media URL' value={state.heroMediaUrl} onChange={e => setState((p: any) => ({ ...p, heroMediaUrl: e.target.value }))} />
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: 3,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <FormSaveButton
            options={data?._id ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
            onClick={(option: number, event: any) => onSubmit(event, option)}
            fullWidth={false}
          />
          <Button variant='outlined' color='error' onClick={() => toggle(null)} size='small' sx={{ height: 35, minWidth: 110 }}>
            Close
          </Button>
        </Box>

        <CustomBackdrop open={loading} />
      </Card>
    </Drawer>
  )
}

export default PageFormDrawer
