import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Drawer from '@mui/material/Drawer'
import { DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'
import CustomTextField from 'src/@core/components/mui/text-field'
import MenuItem from '@mui/material/MenuItem'

type CareerApplicationRow = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  linkDinUrl: string
  coverLetter: string
  resumeUrl: string
  resumeKey: string
  createdAt: string
  updatedAt: string
  careerJobId: string
  jobTitle: string
  jobSlug: string
}
type JobOption = { id: string; title: string; slug: string }
type ApiMeta = {
  success: boolean
  count: number
  total: number
  page: number
  limit: number
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

const toPublicFileUrl = (value: string) => {
  const raw = `${value || ''}`.trim()
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const origin = getPublicOrigin()
  if (!origin) return raw
  return `${origin}/${raw.replace(/^\/+/, '')}`
}

const formatDate = (value: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const toArray = (value: any) => (Array.isArray(value) ? value : [])

const CareerApplicationsManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<CareerApplicationRow[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 20 })
  const [apiMeta, setApiMeta] = useState<ApiMeta>({ success: false, count: 0, total: 0, page: 1, limit: 20 })
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [jobOptions, setJobOptions] = useState<JobOption[]>([])
  const [selectedCareerJobSlug, setSelectedCareerJobSlug] = useState('')
  const [selectedEmailFilter, setSelectedEmailFilter] = useState('')
  const [selectedQueryFilter, setSelectedQueryFilter] = useState('')
  const [draftCareerJobSlug, setDraftCareerJobSlug] = useState('')
  const [draftEmailFilter, setDraftEmailFilter] = useState('')
  const [draftQueryFilter, setDraftQueryFilter] = useState('')
  const latestFetchRef = useRef(0)
  const closeFilterDrawer = () => {
    setDraftCareerJobSlug(selectedCareerJobSlug)
    setDraftEmailFilter(selectedEmailFilter)
    setDraftQueryFilter(selectedQueryFilter)
    setFilterDrawerOpen(false)
  }

  useEffect(() => {
    const querySlug = `${router.query?.careerJobSlug ?? router.query?.jobSlug ?? ''}`.trim()
    setSelectedCareerJobSlug(querySlug)
    setDraftCareerJobSlug(querySlug)
  }, [router.query?.careerJobSlug, router.query?.jobSlug])

  useEffect(() => {
    const loadJobsDropdown = async () => {
      try {
        const res = await axiosInstance.get('/api/careers/applications/dropdowns/jobs')
        const list = Array.isArray(res?.data?.data) ? res.data.data : []
        setJobOptions(
          list
            .map((item: any) => ({
              id: `${item?.id ?? item?._id ?? ''}`,
              title: `${item?.title ?? item?.name ?? ''}`,
              slug: `${item?.slug ?? ''}`
            }))
            .filter((item: JobOption) => item.slug)
        )
      } catch (_error) {
        setJobOptions([])
      }
    }
    loadJobsDropdown().then(() => null)
  }, [])

  const fetchApplications = useCallback(async () => {
    const fetchId = Date.now()
    latestFetchRef.current = fetchId
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/careers/applications', {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          careerJobSlug: selectedCareerJobSlug || undefined,
          email: selectedEmailFilter.trim() || undefined,
          q: selectedQueryFilter.trim() || undefined
        }
      })
      const payload = res?.data ?? {}
      const list = toArray(payload?.data)
      const normalizedList =
        list.length > 0
          ? list
          : toArray(payload?.results).length > 0
            ? toArray(payload?.results)
            : toArray(payload?.items).length > 0
              ? toArray(payload?.items)
              : toArray(payload?.docs)

      const total =
        Number(payload?.total ?? payload?.meta?.total ?? payload?.pagination?.total ?? payload?.count ?? normalizedList.length) || 0
      const count = Number(payload?.count ?? payload?.meta?.count ?? normalizedList.length) || 0
      const page = Number(payload?.page ?? payload?.meta?.page ?? payload?.pagination?.page ?? paginationModel.page + 1) || paginationModel.page + 1
      const limit = Number(payload?.limit ?? payload?.meta?.limit ?? payload?.pagination?.limit ?? paginationModel.pageSize) || paginationModel.pageSize

      // Ignore stale responses from older requests (prevents old list flashing on drill-down filters).
      if (latestFetchRef.current !== fetchId) return

      setApiMeta({
        success: !!payload?.success,
        count,
        total,
        page,
        limit
      })
      setRowCount(total)
      if (normalizedList.length === 0) {
        setRows([])
      } else {
        setRows(
          normalizedList.map((item: any, index: number) => ({
            id: `${item?.id ?? item?._id ?? item?.applicationId ?? item?.careerApplicationId ?? `${page}-${index}`}`,
            firstName: `${item?.firstName ?? ''}`,
            lastName: `${item?.lastName ?? ''}`,
            email: `${item?.email ?? ''}`,
            phone: `${item?.phone ?? ''}`,
            linkDinUrl: `${item?.linkDinUrl ?? ''}`,
            coverLetter: `${item?.coverLetter ?? ''}`,
            resumeUrl: `${item?.resumeUrl ?? ''}`,
            resumeKey: `${item?.resumeKey ?? ''}`,
            createdAt: `${item?.createdAt ?? ''}`,
            updatedAt: `${item?.updatedAt ?? ''}`,
            careerJobId: `${item?.careerJobId ?? item?.career?.id ?? item?.career?._id ?? ''}`,
            jobTitle: `${item?.careerJobTitle ?? item?.jobTitle ?? item?.careerTitle ?? item?.career?.title ?? item?.job?.title ?? ''}`,
            jobSlug: `${item?.careerJobSlug ?? item?.jobSlug ?? item?.careerSlug ?? item?.career?.slug ?? item?.job?.slug ?? ''}`
          }))
        )
      }
    } catch (error: any) {
      if (latestFetchRef.current !== fetchId) return
      toast.error(getErrorMessage(error))
    } finally {
      if (latestFetchRef.current === fetchId) setLoading(false)
    }
  }, [paginationModel.page, paginationModel.pageSize, selectedCareerJobSlug, selectedEmailFilter, selectedQueryFilter])

  useEffect(() => {
    fetchApplications().then(() => null)
  }, [fetchApplications])

  const handleDelete = async (row: CareerApplicationRow) => {
    const ok = window.confirm(`Delete application of "${row.firstName} ${row.lastName}"?`)
    if (!ok) return
    setLoading(true)
    try {
      await axiosInstance.delete(`/api/careers/applications/${encodeURIComponent(row.id)}`)
      toast.success('Application deleted successfully.')
      await fetchApplications()
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'fullName',
        headerName: 'Name',
        minWidth: 180,
        flex: 0.16,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, CareerApplicationRow>) => (
          <Typography variant='body2'>{`${params.row?.firstName || ''} ${params.row?.lastName || ''}`.trim() || '-'}</Typography>
        )
      },
      { field: 'email', headerName: 'Email', minWidth: 220, flex: 0.2 },
      {
        field: 'jobTitle',
        headerName: 'Career',
        minWidth: 180,
        flex: 0.14,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, CareerApplicationRow>) => (
          <Typography variant='body2'>{params.row?.jobTitle || '-'}</Typography>
        )
      },
  
      { field: 'phone', headerName: 'Phone', minWidth: 140, flex: 0.12 },
      {
        field: 'linkDinUrl',
        headerName: 'LinkedIn',
        minWidth: 180,
        flex: 0.14,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, CareerApplicationRow>) => {
          const url = `${params.row?.linkDinUrl || ''}`.trim()
          if (!url) return <Typography variant='body2'>-</Typography>
          return (
            <Link href={url} target='_blank' rel='noreferrer' underline='hover' sx={{ fontSize: '0.875rem' }}>
              Profile
            </Link>
          )
        }
      },
      {
        field: 'resume',
        headerName: 'Resume',
        minWidth: 170,
        flex: 0.12,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, CareerApplicationRow>) => {
          const fileUrl = toPublicFileUrl(params.row?.resumeUrl || params.row?.resumeKey || '')
          if (!fileUrl) return <Typography variant='body2'>-</Typography>
          return (
            <Link href={fileUrl} target='_blank' rel='noreferrer' underline='hover' sx={{ fontSize: '0.875rem' }}>
              Open PDF
            </Link>
          )
        }
      },
      {
        field: 'createdAt',
        headerName: 'Applied At',
        minWidth: 180,
        flex: 0.14,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any, CareerApplicationRow>) => (
          <Typography variant='body2'>{formatDate(params.row?.createdAt)}</Typography>
        )
      },
      {
        field: 'actions',
        headerName: 'Actions',
        minWidth: 90,
        flex: 0.08,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<any, CareerApplicationRow>) => (
          <IconButton color='error' onClick={() => handleDelete(params.row)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        )
      }
    ],
    []
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant='h5'>Career Applications</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              View, open resume PDFs and delete applications.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' onClick={() => setFilterDrawerOpen(true)}>
              Filters
            </Button>
            <Button variant='outlined' onClick={() => fetchApplications()}>
              Refresh
            </Button>
          </Box>
        </Box>
        <Divider />
       
        <Box sx={{ p: 3 }}>
          <DataGrid
            autoHeight
            rows={rows}
            getRowId={row => row.id}
            columns={columns}
            disableRowSelectionOnClick
            paginationMode='server'
            rowCount={rowCount}
            pageSizeOptions={[10, 20, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Box>
      </Card>
      <Drawer
        anchor='right'
        open={filterDrawerOpen}
        onClose={closeFilterDrawer}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 440 },
            maxWidth: '100vw'
          }
        }}
      >
        <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant='h6'>Filters</Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Filter applications by career job slug.
              </Typography>
            </Box>
            <IconButton size='small' onClick={closeFilterDrawer}>
              <Icon icon='tabler:x' />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <CustomTextField
              select
              fullWidth
              size='small'
              label='Career Job'
              value={draftCareerJobSlug}
              onChange={e => {
                setDraftCareerJobSlug(e.target.value ?? '')
              }}
            >
              <MenuItem value=''>All</MenuItem>
              {jobOptions.map(option => (
                <MenuItem key={option.slug} value={option.slug}>
                  {option.title} ({option.slug})
                </MenuItem>
              ))}
            </CustomTextField>
            <CustomTextField
              fullWidth
              size='small'
              label='Email'
              placeholder='Filter by applicant email'
              value={draftEmailFilter}
              onChange={e => setDraftEmailFilter(e.target.value ?? '')}
            />
            <CustomTextField
              fullWidth
              size='small'
              label='Search (q)'
              placeholder='Name, email, phone, job title'
              value={draftQueryFilter}
              onChange={e => setDraftQueryFilter(e.target.value ?? '')}
            />
          </Box>
          <Box sx={{ mt: 'auto' }}>
            <Divider />
            <Box sx={{ p: 2.5, display: 'flex', gap: 1.5 }}>
            <Button
              variant='outlined'
              fullWidth
              size='small'
              onClick={() => {
                setDraftCareerJobSlug('')
                setDraftEmailFilter('')
                setDraftQueryFilter('')
                setSelectedCareerJobSlug('')
                setSelectedEmailFilter('')
                setSelectedQueryFilter('')
                setPaginationModel(prev => ({ ...prev, page: 0 }))
                setFilterDrawerOpen(false)
              }}
            >
              Clear
            </Button>
            <Button
              variant='contained'
              fullWidth
              size='small'
              onClick={() => {
                setSelectedCareerJobSlug(draftCareerJobSlug)
                setSelectedEmailFilter(draftEmailFilter)
                setSelectedQueryFilter(draftQueryFilter)
                setPaginationModel(prev => ({ ...prev, page: 0 }))
                setFilterDrawerOpen(false)
              }}
            >
              Apply
            </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default CareerApplicationsManager
