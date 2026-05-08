import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import TypoLabel from 'src/custom-components/inputs/TypoLabel'
import FormSaveButton from 'src/custom-components/form-save-button'
import CustomBackdrop from 'src/@core/components/loading'

import axiosInstance from 'src/@core/utils/axiosInstence'
import { AppDispatch, RootState } from 'src/store'
import { getData } from 'src/store/settings/technology-heads'
import { saveCloseKey, saveNewKey } from 'src/@core/utils/translation-file'

export interface TechnologyHeadSchema {
  id?: string
  _id?: string
  name?: string
  slug?: string
  description?: string
  shortDescription?: string
}

interface Props {
  open: boolean
  toggle: (data?: TechnologyHeadSchema | null) => void
  data?: TechnologyHeadSchema | null
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 4)
}))

const defaultState: TechnologyHeadSchema = {
  name: '',
  slug: '',
  description: '',
  shortDescription: ''
}

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const getErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.response?.message || error?.message || 'Something went wrong.'

const TechnologyHeadFormDrawer = ({ open, toggle, data }: Props) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.technologyHeads)

  const hidden = useMediaQuery(theme.breakpoints.up('md'))

  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<TechnologyHeadSchema>(defaultState)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const [initialized, setInitialized] = useState(false)

  /** Slug in URL for PUT (unchanged after open). */
  const [pathSlug, setPathSlug] = useState('')

  const isEdit = Boolean(pathSlug)

  useEffect(() => {
    if (!open || initialized) return

    const slug = `${data?.slug ?? ''}`.trim()
    if (slug) {
      setPathSlug(slug)
      setState({
        name: data?.name ?? '',
        slug: data?.slug ?? slug,
        description: data?.description ?? '',
        shortDescription: data?.shortDescription ?? ''
      })
      setIsSlugManuallyEdited(true)
    } else {
      setPathSlug('')
      setState(defaultState)
      setIsSlugManuallyEdited(false)
    }
    setInitialized(true)
  }, [data, open, initialized])

  const handleClose = () => {
    toggle(null)
    setInitialized(false)
    setPathSlug('')
  }

  useEffect(() => {
    if (isSlugManuallyEdited) return
    setState(prev => ({ ...prev, slug: slugify(prev.name ?? '') }))
  }, [state.name, isSlugManuallyEdited])

  const onSubmit = async (event: any, index: number) => {
    event.preventDefault()

    if (!state.name?.trim()) {
      toast.error('Please enter a name.')
      return
    }
    if (!state.slug?.trim()) {
      toast.error('Please enter a slug.')
      return
    }

    const payload = {
      name: state.name.trim(),
      slug: state.slug.trim(),
      description: (state.description ?? '').trim(),
      shortDescription: (state.shortDescription ?? '').trim()
    }

    try {
      setLoading(true)
      if (pathSlug) {
        await axiosInstance.put(`/api/menu-structure/technology-heads/${encodeURIComponent(pathSlug)}`, payload)
        toast.success('Technology head updated successfully.')
      } else {
        await axiosInstance.post('/api/menu-structure/technology-heads', payload)
        toast.success('Technology head created successfully.')
      }

      dispatch(getData({ ...(store?.params ?? { PageNo: 1, PageSize: 10 }) }))

      if (index === 0) handleClose()
      else {
        setState(defaultState)
        setPathSlug('')
        setIsSlugManuallyEdited(false)
      }
    } catch (error: any) {
      toast.error(getErrorMessage(error))
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
      onClose={loading ? undefined : handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: 'transparent',
          mt: 2
        }
      }}
    >
      <Card
        sx={{
          width: hidden ? '35%' : '98%',
          position: 'relative'
        }}
      >
        <Header>
          <Typography variant='h5'>{isEdit ? t('Update Technology Head') : t('Add Technology Head')}</Typography>
          <IconButton size='small' onClick={() => !loading && handleClose()}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Header>

        <Divider />

        <Box sx={{ p: 4, pb: 18, maxHeight: '85vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                autoFocus
                fullWidth
                label={<TypoLabel name='name' important />}
                value={state.name}
                onChange={e => setState(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <CustomTextField
                multiline
                rows={3}
                fullWidth
                label={<TypoLabel name='Short description' />}
                value={state.shortDescription}
                onChange={e => setState(prev => ({ ...prev, shortDescription: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                multiline
                rows={4}
                fullWidth
                label={<TypoLabel name='Description' />}
                value={state.description}
                onChange={e => setState(prev => ({ ...prev, description: e.target.value }))}
              />
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
            options={pathSlug ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
            onClick={(option, event) => onSubmit(event, option)}
            fullWidth={false}
          />
          <Button variant='outlined' color='error' onClick={handleClose} size='small' sx={{ height: 35, minWidth: 110, whiteSpace: 'nowrap' }}>
            {t('Close')}
          </Button>
        </Box>

        <CustomBackdrop open={loading} />
      </Card>
    </Drawer>
  )
}

export default TechnologyHeadFormDrawer
