import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, Divider, Drawer, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'
import Icon from 'src/core/components/icon'
import CustomTextField from 'src/core/components/mui/text-field'
import TypoLabel from 'src/components/inputs/TypoLabel'
import FormSaveButton from 'src/components/form-save-button'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'
import { saveCloseKey, saveNewKey } from 'src/core/utils/translation-file'

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

const defaultState = {
  sectionType: '',
  isVisible: true,
  content: {}
}

const SectionFormDrawer = ({ open, data, toggle, onSuccess }: Props) => {
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.up('md'))

  const [loading, setLoading] = useState(false)
  const [sectionTypes, setSectionTypes] = useState<any[]>([])
  const [state, setState] = useState<any>(defaultState)

  useEffect(() => {
    const loadSectionTypes = async () => {
      try {
        const res = await axiosInstance.get('/api/section-types?active=true&limit=200&page=1')
        setSectionTypes(res?.data?.data ?? [])
      } catch {
        setSectionTypes([])
      }
    }

    if (open) loadSectionTypes()
  }, [open])

  useEffect(() => {
    if (data?._id) {
      setState({
        sectionType: data?.sectionType?._id ?? data?.sectionType ?? '',
        isVisible: data?.isVisible ?? true,
        content: data?.content ?? {}
      })
    } else {
      setState(defaultState)
    }
  }, [data, open])

  const selectedType = useMemo(() => sectionTypes.find(item => item?._id === state.sectionType), [sectionTypes, state.sectionType])

  const updateContent = (key: string, value: any) => {
    setState((prev: any) => ({ ...prev, content: { ...(prev.content ?? {}), [key]: value } }))
  }

  const onSubmit = async (event: any, index: number) => {
    event.preventDefault()
    if (!state.sectionType && !data?._id) {
      toast.error('Please select section type.')
      return
    }

    try {
      setLoading(true)
      const payload: any = { content: state.content, isVisible: state.isVisible }
      if (!data?._id) payload.sectionType = state.sectionType

      if (data?._id) await axiosInstance.put(`/api/sections/${data._id}`, payload)
      else await axiosInstance.post('/api/sections', payload)

      toast.success(`Section ${data?._id ? 'updated' : 'created'} successfully.`)
      onSuccess()
      if (index === 0) toggle(null)
      else setState(defaultState)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save section.')
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
      <Card sx={{ width: hidden ? '55%' : '98%', position: 'relative' }}>
        <Header>
          <Typography variant='h5'>{data?._id ? 'Update Section' : 'Add Section'}</Typography>
          <IconButton size='small' onClick={() => !loading && toggle(null)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Header>

        <Divider />

        <Box sx={{ p: 4, pb: 18, maxHeight: '85vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            {!data?._id && (
              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={<TypoLabel name='Section Type' important />}
                  value={state.sectionType}
                  onChange={e => setState((prev: any) => ({ ...prev, sectionType: e.target.value, content: {} }))}
                >
                  {sectionTypes.map(type => (
                    <MenuItem key={type?._id} value={type?._id}>
                      {type?.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label={<TypoLabel name='Visibility' important />}
                value={state.isVisible ? 'visible' : 'hidden'}
                onChange={e => setState((prev: any) => ({ ...prev, isVisible: e.target.value === 'visible' }))}
              >
                <MenuItem value='visible'>Visible</MenuItem>
                <MenuItem value='hidden'>Hidden</MenuItem>
              </CustomTextField>
            </Grid>

            {(selectedType?.fields ?? []).map((field: any) => (
              <Grid item xs={12} md={field.type === 'textarea' ? 12 : 6} key={field?.key}>
                {field?.type === 'select' ? (
                  <CustomTextField
                    select
                    fullWidth
                    label={<TypoLabel name={field?.label || field?.key} important={Boolean(field?.required)} />}
                    value={state?.content?.[field?.key] ?? ''}
                    onChange={e => updateContent(field?.key, e.target.value)}
                  >
                    {(field?.options ?? []).map((option: string) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                ) : field?.type === 'boolean' ? (
                  <CustomTextField
                    select
                    fullWidth
                    label={<TypoLabel name={field?.label || field?.key} important={Boolean(field?.required)} />}
                    value={state?.content?.[field?.key] ? 'true' : 'false'}
                    onChange={e => updateContent(field?.key, e.target.value === 'true')}
                  >
                    <MenuItem value='true'>Yes</MenuItem>
                    <MenuItem value='false'>No</MenuItem>
                  </CustomTextField>
                ) : (
                  <CustomTextField
                    fullWidth
                    multiline={field?.type === 'textarea' || field?.type === 'richtext'}
                    rows={field?.type === 'textarea' || field?.type === 'richtext' ? 4 : undefined}
                    type={field?.type === 'number' ? 'number' : 'text'}
                    label={<TypoLabel name={field?.label || field?.key} important={Boolean(field?.required)} />}
                    value={state?.content?.[field?.key] ?? ''}
                    onChange={e => updateContent(field?.key, field?.type === 'number' ? Number(e.target.value || 0) : e.target.value)}
                  />
                )}
              </Grid>
            ))}
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

export default SectionFormDrawer
