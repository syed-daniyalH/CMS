  import { useEffect, useState } from 'react'
  import Drawer from '@mui/material/Drawer'
  import Card from '@mui/material/Card'
  import Box from '@mui/material/Box'
  import Grid from '@mui/material/Grid'
  import Button from '@mui/material/Button'
  import Divider from '@mui/material/Divider'
  import MenuItem from '@mui/material/MenuItem'
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
  import { getData } from 'src/store/settings/tags'
  import { saveCloseKey, saveNewKey } from 'src/@core/utils/translation-file'

  export interface TagSchema {
    _id?: string
    name?: string
    slug?: string
    shortDescription?: string
    isActive: boolean
  }

  interface Props {
    open: boolean
    toggle: (data?: TagSchema | null) => void
    data?: TagSchema | null
  }

  const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 4)
  }))

  const defaultState: TagSchema = {
    name: '',
    slug: '',
    shortDescription: '',
    isActive: true
  }

  const slugify = (value: string) =>
    `${value ?? ''}`
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  const getErrorMessage = (error: any) =>
    error?.response?.data?.message ||
    error?.response?.message ||
    error?.message ||
    'Something went wrong.'

const TagFormDrawer = ({ open, toggle, data }: Props) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.tags)
  const hidden = useMediaQuery(theme.breakpoints.up('md'))
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<TagSchema>(defaultState)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (data?._id) {
      setState({
        _id: data._id,
        name: data.name ?? '',
        slug: data.slug ?? '',
        shortDescription: data.shortDescription ?? '',
        isActive: data.isActive ?? true
      })
      setIsSlugManuallyEdited(true)
    } else {
      setState(defaultState)
      setIsSlugManuallyEdited(false)
    }
  }, [data, open])

  useEffect(() => {
    if (isSlugManuallyEdited) return
    setState(prev => ({ ...prev, slug: slugify(prev.name ?? '') }))
  }, [state.name, isSlugManuallyEdited])

    const onSubmit = async (event: any, index: number) => {
      event.preventDefault()

      if (!state.name?.trim()) {
        toast.error('Please enter tag name.')
        return
      }

      try {
        setLoading(true)

        const payload = {
          name: state.name.trim(),
          slug: state.slug?.trim(),
          shortDescription: state.shortDescription?.trim(),
          isActive: state.isActive
        }

      if (state._id) {
        await axiosInstance.put(
          `/api/taxonomy/tags/${state._id}`,
          payload
        )
      } 
      else {
        await axiosInstance.post(
          '/api/taxonomy/tags',
          payload
        )
      }

      toast.success(
        `Blog category ${state._id ? 'updated' : 'created'} successfully.`
      )

        dispatch(
          getData({ ...(store?.params ?? { PageNo: 1, PageSize: 10 }) })
        )

        if (index === 0) toggle(null)
        else {
          setState(defaultState)
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
        onClose={loading ? undefined : () => toggle(null)}
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
          {/* HEADER */}
          <Header>
            <Typography variant='h5'>
              {state?._id
                ? t('Update Tags')
                : t('Add Tags')}
            </Typography>

            <IconButton
              size='small'
              onClick={() => !loading && toggle(null)}
            >
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </IconButton>
          </Header>

          <Divider />

          {/* FORM */}
          <Box sx={{ p: 4, pb: 18, maxHeight: '85vh', overflowY: 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label={<TypoLabel name='name' important />}
                  value={state.name}
                  onChange={e =>
                    setState(prev => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  label={<TypoLabel name='Slug' />}
                  value={state.slug}
                  onChange={e => {
                    setIsSlugManuallyEdited(true)
                    setState(prev => ({
                      ...prev,
                      slug: slugify(e.target.value)
                    }))
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  multiline
                  rows={3}
                  fullWidth
                  label={<TypoLabel name='Description' />}
                  value={state.shortDescription}
                  onChange={e =>
                    setState(prev => ({
                      ...prev,
                      shortDescription: e.target.value
                    }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  label={<TypoLabel name='Status' important />}
                  value={state.isActive ? 'active' : 'inactive'}
                  onChange={e =>
                    setState(prev => ({
                      ...prev,
                      isActive: e.target.value === 'active'
                    }))
                  }
                >
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </Box>

          {/* ✅ FIXED FOOTER */}
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
              options={
                data?._id
                  ? [saveCloseKey]
                  : [saveCloseKey, saveNewKey]
              }
              onClick={(option: number, event: any) =>
                onSubmit(event, option)
              }
              fullWidth={false}
            />

            <Button
              variant='outlined'
              color='error'
              onClick={() => toggle(null)}
            size={'small'}
              sx={{
                height: 35,
                minWidth: 110,
                whiteSpace: 'nowrap'
              }}
            >
              {t('Close')}
            </Button>
          </Box>

          <CustomBackdrop open={loading} />
        </Card>
      </Drawer>
    )
  }

  export default TagFormDrawer