  // import { useEffect, useState } from 'react'
  // import Drawer from '@mui/material/Drawer'
  // import Card from '@mui/material/Card'
  // import Box from '@mui/material/Box'
  // import Grid from '@mui/material/Grid'
  // import Button from '@mui/material/Button'
  // import Divider from '@mui/material/Divider'
  // import MenuItem from '@mui/material/MenuItem'
  // import Typography from '@mui/material/Typography'
  // import IconButton from '@mui/material/IconButton'
  // import { styled, useTheme } from '@mui/material/styles'
  // import useMediaQuery from '@mui/material/useMediaQuery'
  // import toast from 'react-hot-toast'
  // import { useDispatch, useSelector } from 'react-redux'
  // import { useTranslation } from 'react-i18next'

  // import Icon from 'src/@core/components/icon'
  // import CustomTextField from 'src/@core/components/mui/text-field'
  // import TypoLabel from 'src/custom-components/inputs/TypoLabel'
  // import FormSaveButton from 'src/custom-components/form-save-button'
  // import CustomBackdrop from 'src/@core/components/loading'

  // import axiosInstance from 'src/@core/utils/axiosInstence'
  // import { AppDispatch, RootState } from 'src/store'
  // import { getData } from 'src/store/settings/authors'
  // import { saveCloseKey, saveNewKey } from 'src/@core/utils/translation-file'

  // export interface AuthorSchema {
  //   id?: string
  //   name?: string
  //   email?: string
  //   password?: string
  //   slug?: string
  //   shortDescription?: string
  //   contentBlocks?: {
  //     title?: string
  //     content?: string
  //   }[] 
  //   avatar?: string
  //   socialLinks?: {
  //     linkedin?: string
  //     github?: string
  //     website?: string
  //   }
  //   isPublicProfile: boolean
  // }

  // interface Props {
  //   open: boolean
  //   toggle: (data?: AuthorSchema | null) => void
  //   data?: AuthorSchema | null
  // }

  // const Header = styled(Box)(({ theme }) => ({
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   padding: theme.spacing(2, 4)
  // }))

  // const defaultState: AuthorSchema = {
  //   name: '',
  //   email: '',
  //   password: '',
  //   slug: '',
  //   shortDescription: '',
  //   // contentBlocks: [],
  //   avatar: '',
  //   // socialLinks: {
  //   //   linkedin: '',
  //   //   github: '',
  //   //   website: ''
  //   // },
  //   isPublicProfile: true
  // }

  // const slugify = (value: string) =>
  //   `${value ?? ''}`
  //     .toLowerCase()
  //     .trim()
  //     .replace(/[^a-z0-9\s-]/g, '')
  //     .replace(/\s+/g, '-')
  //     .replace(/-+/g, '-')

  // const getErrorMessage = (error: any) =>
  //   error?.response?.data?.message ||
  //   error?.response?.message ||
  //   error?.message ||
  //   'Something went wrong.'

  // const AuthorFormDrawer = ({ open, toggle, data }: Props) => {

  //   console.log(data?.id,"Data ID"); // console log to check the data being passed to the form drawer
    
  //   const { t } = useTranslation()
  //   const theme = useTheme()
  //   const dispatch = useDispatch<AppDispatch>()
  //   const store = useSelector((state: RootState) => state.authors)

  //   const hidden = useMediaQuery(theme.breakpoints.up('md'))

  //   const [loading, setLoading] = useState(false)
  //   const [state, setState] = useState<AuthorSchema>(defaultState)
  //   const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  //   const isEdit = Boolean(state.id)
  //   const [initialized, setInitialized] = useState(false)

    
  //   console.log(isEdit,"IS Edit"); // console log to check if the id is being set in the state

  //   useEffect(() => {

  //     if (!open || initialized) return
      
  //     if (data?.id) {
  //       setState({
  //         id: data.id,
  //         name: data.name ?? '',
  //         email: data.email ?? '',
  //         password: '',
  //         slug: data.slug ?? '',
  //         shortDescription: data.shortDescription ?? '',
  //         avatar: data.avatar ?? '',
  //         // contentBlocks: data.contentBlocks ?? [],
  //         // socialLinks: data.socialLinks ?? {},
  //         isPublicProfile: data.isPublicProfile ?? true
  //       })
  //       setIsSlugManuallyEdited(true)
  //     } 
  //     else {
  //       setState(defaultState)
  //       setIsSlugManuallyEdited(false)
  //     }
  //     setInitialized(true)
  //   }, [data, open, initialized])

  //   const handleClose = () => {
  //     toggle(null)
  //     setInitialized(false)
  //   }

  //   useEffect(() => {
  //     if (isSlugManuallyEdited) return
  //     setState(prev => ({ ...prev, slug: slugify(prev.name ?? '') }))
  //   }, [state.name, isSlugManuallyEdited])

  //   const onSubmit = async (event: any, index: number) => {
  //     event.preventDefault()

  //     if (!state.name?.trim()) {
  //       toast.error('Please enter author name.')
  //       return
  //     }

  //     try {
  //       setLoading(true)

  //       const payload = {
  //         name: state.name.trim(),
  //         email: state.email?.trim(),
  //         password: state.password,
  //         slug: state.slug?.trim(),
  //         shortDescription: state.shortDescription?.trim(),
  //         // contentBlocks: state.contentBlocks,
  //         avatar: state.avatar,
  //         // socialLinks: state.socialLinks,
  //         isPublicProfile: state.isPublicProfile
  //       }

  //       if (state.id) {
  //         await axiosInstance.put(
  //           `/api/authors/${state.id}/profile`,
  //           payload
  //         )
  //       } 
  //       else {
  //         await axiosInstance.post(
  //           '/api/authors',
  //           payload
  //         )
  //       }

  //       toast.success(
  //         `Author ${state.id ? 'updated' : 'created'} successfully.`
  //       )

  //       dispatch(
  //         getData({ ...(store?.params ?? { PageNo: 1, PageSize: 10 }) })
  //       )

  //       if (index === 0) toggle(null)
  //       else {
  //         setState(defaultState)
  //         setIsSlugManuallyEdited(false)
  //       }
  //     } catch (error: any) {
  //       toast.error(getErrorMessage(error))
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   return (
  //     <Drawer
  //       open={open}
  //       anchor='top'
  //       variant='temporary'
  //       transitionDuration={400}
  //       onClose={loading ? undefined : () => handleClose}
  //       ModalProps={{ keepMounted: true }}
  //       sx={{
  //         '& .MuiDrawer-paper': {
  //           alignItems: 'center',
  //           backgroundColor: 'transparent',
  //           mt: 2
  //         }
  //       }}
  //     >
  //       <Card
  //         sx={{
  //           width: hidden ? '35%' : '98%',
  //           position: 'relative'
  //         }}
  //       >
  //         {/* HEADER */}
  //         <Header>
  //           <Typography variant='h5'>
  //             {isEdit
  //               ? t('Update Author')
  //               : t('Add Author')}
  //           </Typography>

  //           <IconButton
  //             size='small'
  //             onClick={() => !loading && handleClose()}
  //           >
  //             <Icon icon='tabler:x' fontSize='1.25rem' />
  //           </IconButton>
  //         </Header>

  //         <Divider />

  //         {/* FORM */}
  //         <Box sx={{ p: 4, pb: 18, maxHeight: '85vh', overflowY: 'auto' }}>
  //           <Grid container spacing={2}>
  //             <Grid item xs={12}>
  //               <CustomTextField
  //                 autoFocus
  //                 fullWidth
  //                 label={<TypoLabel name='name' important />}
  //                 value={state.name}
  //                 onChange={e =>
  //                   setState(prev => ({
  //                     ...prev,
  //                     name: e.target.value
  //                   }))
  //                 }
  //               />
  //             </Grid>

  //             <Grid item xs={12}>
  //               <CustomTextField
  //                 fullWidth
  //                 type='email'
  //                 label={<TypoLabel name='Email' important />}
  //                 value={state.email}
  //                 onChange={e =>
  //                   setState(prev => ({
  //                     ...prev,
  //                     email: e.target.value
  //                   }))
  //                 }
  //               />
  //             </Grid>

  //             {!state.id && (
  //               <Grid item xs={12}>
  //                 <CustomTextField
  //                   fullWidth
  //                   type='password'
  //                   label={<TypoLabel name='Password' important />}
  //                   value={state.password}
  //                   onChange={e =>
  //                     setState(prev => ({
  //                       ...prev,
  //                       password: e.target.value
  //                     }))
  //                   }
  //                 />
  //               </Grid>
  //             )}

  //             <Grid item xs={12}>
  //               <CustomTextField
  //                 fullWidth
  //                 label={<TypoLabel name='Slug' />}
  //                 value={state.slug}
  //                 onChange={e => {
  //                   setIsSlugManuallyEdited(true)
  //                   setState(prev => ({
  //                     ...prev,
  //                     slug: slugify(e.target.value)
  //                   }))
  //                 }}
  //               />
  //             </Grid>

  //             <Grid item xs={12}>
  //               <CustomTextField
  //                 multiline
  //                 rows={3}
  //                 fullWidth
  //                 label={<TypoLabel name='Description' />}
  //                 value={state.shortDescription}
  //                 onChange={e =>
  //                   setState(prev => ({
  //                     ...prev,
  //                     shortDescription: e.target.value
  //                   }))
  //                 }
  //               />
  //             </Grid>

  //             <Grid item xs={12}>
  //               <CustomTextField
  //                 fullWidth
  //                 label={<TypoLabel name='Avatar' />}
  //                 value={state.avatar}
  //                 onChange={e =>
  //                   setState(prev => ({
  //                     ...prev,
  //                     avatar: e.target.value
  //                   }))
  //                 }
  //               />
  //             </Grid>

  //             <Grid item xs={12}>
  //               <CustomTextField
  //                 select
  //                 fullWidth
  //                 label={<TypoLabel name='Profile' />}
  //                 value={state.isPublicProfile ? 'Public' : 'Private'}
  //                 onChange={e =>
  //                   setState(prev => ({
  //                     ...prev,
  //                     isPublicProfile: e.target.value === 'Public'
  //                   }))
  //                 }
  //               >
  //                 <MenuItem value='Public'>Public</MenuItem>
  //                 <MenuItem value='Private'>Private</MenuItem>
  //               </CustomTextField>
  //             </Grid>
  //           </Grid>
  //         </Box>

  //         {/* ✅ FIXED FOOTER */}
  //         <Box
  //         sx={{
  //           position: 'absolute',
  //           bottom: 0,
  //           left: 0,
  //           right: 0, 
  //           px: 3,
  //           py: 1.5,
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'flex-end',
  //           gap: 1.5,
  //           borderTop: `1px solid ${theme.palette.divider}`,
  //           backgroundColor: theme.palette.background.paper
  //           }}
  //         >
  //           <FormSaveButton
  //             options={
  //               state?.id
  //                 ? [saveCloseKey]
  //                 : [saveCloseKey, saveNewKey]
  //             }
  //             onClick={(option: number, event: any) =>
  //               onSubmit(event, option)
  //             }
  //             fullWidth={false}
  //           />

  //           <Button
  //             variant='outlined'
  //             color='error'
  //             onClick={() => toggle(null)}
  //           size={'small'}
  //             sx={{
  //               height: 35,
  //               minWidth: 110,
  //               whiteSpace: 'nowrap'
  //             }}
  //           >
  //             {t('Close')}
  //           </Button>
  //         </Box>

  //         <CustomBackdrop open={loading} />
  //       </Card>
  //     </Drawer>
  //   )
  // }

  // export default AuthorFormDrawer


  import { useEffect, useRef, useState } from 'react'
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
import GlobalImageUploader, { GlobalImageUploaderRef } from 'src/custom-components/media/GlobalImageUploader'

import axiosInstance from 'src/@core/utils/axiosInstence'
import { AppDispatch, RootState } from 'src/store'
import { getData } from 'src/store/settings/authors'
import { saveCloseKey, saveNewKey } from 'src/@core/utils/translation-file'

export interface AuthorSchema {
  id?: string
  name?: string
  email?: string
  password?: string
  role?: string
  slug?: string
  shortDescription?: string
  contentBlocks?: {
    title?: string
    content?: string
  }[] 
  avatar?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    github?: string
    website?: string
  }
  isPublicProfile: boolean
  metaTitle?: string
  metaDescription?: string
  metaKeyWords?: string
}

interface Props {
  open: boolean
  toggle: (data?: AuthorSchema | null) => void
  data?: AuthorSchema | null
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 4)
}))

const defaultState: AuthorSchema = {
  name: '',
  email: '',
  password: '',
  role: 'author',
  slug: '',
  shortDescription: '',
  avatar: '',
  socialLinks: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  },
  isPublicProfile: true,
  metaTitle: '',
  metaDescription: '',
  metaKeyWords: ''
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

const normalizeAvatarUrl = (value?: string) => {
  const v = `${value ?? ''}`.trim()
  if (!v) return ''
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  if (v.includes('/')) return v
  return ''
}

const normalizeSocialLinks = (value: any) => {
  if (!value || typeof value !== 'object') return {}
  return {
    facebook: `${value?.facebook ?? ''}`.trim(),
    twitter: `${value?.twitter ?? ''}`.trim(),
    instagram: `${value?.instagram ?? ''}`.trim(),
    linkedin: `${value?.linkedin ?? ''}`.trim(),
    github: `${value?.github ?? ''}`.trim(),
    website: `${value?.website ?? ''}`.trim()
  }
}

const AuthorFormDrawer = ({ open, toggle, data }: Props) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.authors)

  const hidden = useMediaQuery(theme.breakpoints.up('md'))

  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<AuthorSchema>(defaultState)
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
  const avatarUploaderRef = useRef<GlobalImageUploaderRef | null>(null)

  const [initialized, setInitialized] = useState(false)    // this is newly added state
  const isEdit = Boolean(state.id)   // this is newly added variable to check if we are in edit mode or add mode

  // Initialize form state when drawer opens
  useEffect(() => {
    if (!open || initialized) return   // if drawer is not open or already initialized, do nothing

    if (data?.id) {
      setState({
        id: data.id,
        name: data.name ?? '',
        email: data.email ?? '',
        password: '',
        role: data.role ?? 'author',
        slug: data.slug ?? '',
        shortDescription: data.shortDescription ?? '',
        avatar: data.avatar ?? '',
        socialLinks: normalizeSocialLinks(data.socialLinks),
        isPublicProfile: data.isPublicProfile ?? true,
        metaTitle: data.metaTitle ?? '',
        metaDescription: data.metaDescription ?? '',
        metaKeyWords: data.metaKeyWords ?? ''
      })
      setIsSlugManuallyEdited(true)
    } else {
      setState(defaultState)
      setIsSlugManuallyEdited(false)
    }

    setInitialized(true)
  }, [data, open, initialized])

  // Handle drawer close
  const handleClose = () => {
    toggle(null)
    setInitialized(false)
  }

  // Auto-generate slug if not manually edited
  useEffect(() => {
    if (isSlugManuallyEdited) return
    setState(prev => ({ ...prev, slug: slugify(prev.name ?? '') }))
  }, [state.name, isSlugManuallyEdited])

  const onSubmit = async (event: any, index: number) => {
    event.preventDefault()

    if (!state.name?.trim()) {
      toast.error('Please enter author name.')
      return
    }

    try {
      setLoading(true)
      const uploadedItems = (await avatarUploaderRef.current?.uploadPending()) || []
      const uploadedAvatar = normalizeAvatarUrl(`${uploadedItems?.[0]?.secureUrl || uploadedItems?.[0]?.url || ''}`.trim())
      const avatar = uploadedAvatar || normalizeAvatarUrl(state.avatar)

      if (state.avatar && !avatar) {
        toast.error('Avatar upload failed. Please reselect image and save again.')
        return
      }

      const payload = {
        name: state.name.trim(),
        email: state.email?.trim(),
        password: state.password,
        role: `${state.role ?? 'author'}`.trim() || 'author',
        slug: state.slug?.trim(),
        shortDescription: state.shortDescription?.trim(),
        contentBlocks: Array.isArray(state.contentBlocks) ? state.contentBlocks : [],
        avatar: avatar || '',
        socialLinks: normalizeSocialLinks(state.socialLinks),
        isPublicProfile: state.isPublicProfile,
        metaTitle: (state.metaTitle ?? '').trim(),
        metaDescription: (state.metaDescription ?? '').trim(),
        metaKeyWords: (state.metaKeyWords ?? '').trim()
      }

      if (state.id) {
        await axiosInstance.put(
          `/api/authors/${state.id}/profile`,
          payload
        )
      } else {
        await axiosInstance.post('/api/authors', payload)
      }

      toast.success(`Author ${state.id ? 'updated' : 'created'} successfully.`)

      dispatch(
        getData({ ...(store?.params ?? { PageNo: 1, PageSize: 10 }) })
      )

      if (index === 0) handleClose()
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
        {/* HEADER */}
        <Header>
          <Typography variant='h5'>
            {isEdit ? t('Update Author') : t('Add Author')}
          </Typography>

          <IconButton
            size='small'
            onClick={() => !loading && handleClose()}
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
                onChange={e => setState(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                type='email'
                label={<TypoLabel name='Email' important />}
                value={state.email}
                onChange={e => setState(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Role' />}
                value={state.role ?? 'author'}
                onChange={e => setState(prev => ({ ...prev, role: e.target.value }))}
              />
            </Grid>

            {!state.id && (
              <Grid item xs={12}>
                <CustomTextField
                  fullWidth
                  type='password'
                  label={<TypoLabel name='Password' important />}
                  value={state.password}
                  onChange={e => setState(prev => ({ ...prev, password: e.target.value }))}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Slug' />}
                value={state.slug}
                onChange={e => {
                  setIsSlugManuallyEdited(true)
                  setState(prev => ({ ...prev, slug: slugify(e.target.value) }))
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
                onChange={e => setState(prev => ({ ...prev, shortDescription: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Meta title' />}
                value={state.metaTitle ?? ''}
                onChange={e => setState(prev => ({ ...prev, metaTitle: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                multiline
                rows={3}
                fullWidth
                label={<TypoLabel name='Meta description' />}
                value={state.metaDescription ?? ''}
                onChange={e => setState(prev => ({ ...prev, metaDescription: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Meta keywords' />}
                value={state.metaKeyWords ?? ''}
                onChange={e => setState(prev => ({ ...prev, metaKeyWords: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <GlobalImageUploader
                ref={avatarUploaderRef}
                label='Author Avatar'
                folder='images/authors'
                type='author'
                entityId={state.id || state.slug || state.name}
                uploadOnSubmit
                multiple={false}
                altText={state.name || 'author-avatar'}
                value={state.avatar || ''}
                onUploaded={items => {
                  const url = items?.[0]?.secureUrl || items?.[0]?.url || ''
                  if (url) setState(prev => ({ ...prev, avatar: url }))
                }}
                onClear={() => setState(prev => ({ ...prev, avatar: '' }))}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Facebook URL' />}
                value={state.socialLinks?.facebook ?? ''}
                onChange={e =>
                  setState(prev => ({
                    ...prev,
                    socialLinks: { ...(prev.socialLinks ?? {}), facebook: e.target.value }
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Twitter URL' />}
                value={state.socialLinks?.twitter ?? ''}
                onChange={e =>
                  setState(prev => ({
                    ...prev,
                    socialLinks: { ...(prev.socialLinks ?? {}), twitter: e.target.value }
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='Instagram URL' />}
                value={state.socialLinks?.instagram ?? ''}
                onChange={e =>
                  setState(prev => ({
                    ...prev,
                    socialLinks: { ...(prev.socialLinks ?? {}), instagram: e.target.value }
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label={<TypoLabel name='LinkedIn URL' />}
                value={state.socialLinks?.linkedin ?? ''}
                onChange={e =>
                  setState(prev => ({
                    ...prev,
                    socialLinks: { ...(prev.socialLinks ?? {}), linkedin: e.target.value }
                  }))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                label={<TypoLabel name='Profile' />}
                value={state.isPublicProfile ? 'Public' : 'Private'}
                onChange={e => setState(prev => ({ ...prev, isPublicProfile: e.target.value === 'Public' }))}
              >
                <MenuItem value='Public'>Public</MenuItem>
                <MenuItem value='Private'>Private</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </Box>

        {/* FOOTER */}
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
            options={state.id ? [saveCloseKey] : [saveCloseKey, saveNewKey]}
            onClick={(option, event) => onSubmit(event, option)}
            fullWidth={false}
          />

          <Button
            variant='outlined'
            color='error'
            onClick={handleClose}
            size='small'
            sx={{ height: 35, minWidth: 110, whiteSpace: 'nowrap' }}
          >
            {t('Close')}
          </Button>
        </Box>

        <CustomBackdrop open={loading} />
      </Card>
    </Drawer>
  )
}

export default AuthorFormDrawer