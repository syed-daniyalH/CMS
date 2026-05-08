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
import { getData } from 'src/store/blogs/sub-category'
import { saveCloseKey, saveNewKey } from 'src/@core/utils/translation-file'
import BlogCategorySelector from 'src/@core/dropdown-selectors/BlogCategorySelector'

export interface BlogSubCategorySchema {
  id?: string
  name?: string
  slug?: string
  shortDescription?: string
  isActive: boolean
  categoryId?: string
}

interface Props {
  open: boolean
  toggle: (data?: BlogSubCategorySchema | null) => void
  data?: BlogSubCategorySchema | null
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 4)
}))

const getErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.response?.message || error?.message || 'Something went wrong.'

const defaultState: BlogSubCategorySchema = {
  name: '',
  slug: '',
  shortDescription: '',
  categoryId: '',
  isActive: true
}

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const SubCategoryFormDrawer = ({ open, toggle, data }: Props) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.blogSubCategory)
  const hidden = useMediaQuery(theme.breakpoints.up('md'))
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<BlogSubCategorySchema>(defaultState)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  useEffect(() => {
    if (data?.id) {
      setState({
        id: data.id,
        name: data.name ?? '',
        slug: data.slug ?? '',
        shortDescription: data.shortDescription ?? '',
        categoryId: data.categoryId ?? '',
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
      toast.error('Please enter sub category name.')
      return
    }
    if (!state.categoryId) {
      toast.error('Please select category.')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: state.name?.trim(),
        slug: state.slug?.trim(),
        shortDescription: state.shortDescription?.trim(),
        isActive: state.isActive,
        parentCategory: state.categoryId
      }

      if (state.id) {
        await axiosInstance.put(`/api/taxonomy/blog-sub-categories/${state.id}`, payload)
      } else {
        await axiosInstance.post('/api/taxonomy/blog-sub-categories', payload)
      }

      toast.success(`Blog sub category ${state.id ? 'updated' : 'created'} successfully.`)
      dispatch(getData({ ...(store?.params ?? { PageNo: 1, PageSize: 10 }) }))

      if (index === 0) {
        toggle(null)
      } else {
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
      onClose={loading ? undefined : () => toggle(null)}
      transitionDuration={400}
      sx={{
        '& .MuiDrawer-paper': {
          alignItems: 'center',
          backgroundColor: '#00000000',
          marginTop: 2
        }
      }}
      ModalProps={{ keepMounted: true }}
    >
      <Card sx={{ width: hidden ? '35%' : '98%', position: 'relative' }}>
        <Header>
          <Typography variant='h5'>{state?.id ? t('Update Blog Sub Category') : t('Add Blog Sub Category')}</Typography>
          <IconButton onClick={loading ? undefined : () => toggle(null)} size='small'>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Header>
        <Divider />

        <Box sx={{ p: 4, pb: 18, maxHeight: '85vh', overflowY: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <BlogCategorySelector
                selectedValue={state.categoryId ?? null}
                important
                handleChange={value => setState(prev => ({ ...prev, categoryId: value?.id ?? value?._id ?? '' }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Name' important />}
                value={state.name ?? ''}
                onChange={e => setState(prev => ({ ...prev, name: e.target.value ?? '' }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Slug' />}
                value={state.slug ?? ''}
                onChange={e => {
                  setIsSlugManuallyEdited(true)
                  setState(prev => ({ ...prev, slug: slugify(e.target.value ?? '') }))
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label={<TypoLabel name='Description' />}
                value={state.shortDescription ?? ''}
                onChange={e => setState(prev => ({ ...prev, shortDescription: e.target.value ?? '' }))}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label={<TypoLabel name='Status' important />}
                value={state.isActive ? 'active' : 'inactive'}
                onChange={e => setState(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
              >
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>InActive</MenuItem>
              </CustomTextField>
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
            options={
              data?.id
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

export default SubCategoryFormDrawer
