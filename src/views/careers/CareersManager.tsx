import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'

type CareerRow = {
  id: string
  title: string
  slug: string
  departmentName: string
  locationName: string
  city: string
  country: string
  jobType: string
  salary: string
  dateOpen: string
  jobExpired: boolean
}

const getErrorMessage = (error: any) => error?.response?.data?.message || error?.message || 'Something went wrong.'

const CareersManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<CareerRow[]>([])
  const [search, setSearch] = useState('')

  const fetchCareers = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/careers')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? ''}`,
          title: `${item?.title ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          departmentName: `${item?.department?.name ?? ''}`,
          locationName: `${item?.location?.name ?? ''}`,
          city: `${item?.city ?? item?.location?.city ?? ''}`,
          country: `${item?.country ?? item?.location?.country ?? ''}`,
          jobType: `${item?.jobType ?? ''}`,
          salary: `${item?.salary ?? ''}`,
          dateOpen: `${item?.dateOpen ?? ''}`,
          jobExpired: item?.jobExpired ?? false
        }))
      )
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCareers().then(() => null)
  }, [])

  const handleDelete = async (row: CareerRow) => {
    const ok = window.confirm(`Delete career "${row.title}"?`)
    if (!ok) return
    setLoading(true)
    try {
      await axiosInstance.delete(`/api/careers/${row.id}`)
      toast.success('Career deleted successfully.')
      await fetchCareers()
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item =>
      `${item.title} ${item.slug} ${item.departmentName} ${item.locationName} ${item.city} ${item.country} ${item.jobType}`.toLowerCase().includes(q)
    )
  }, [rows, search])

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Jobs',
      minWidth: 220,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          component='button'
          underline='hover'
          onClick={() =>
            router.push(`/careers/applications?jobSlug=${encodeURIComponent(params.row?.slug ?? '')}`)
          }
          sx={{ textAlign: 'left', fontSize: '0.875rem' }}
        >
          {params.row?.title || '-'}
        </Link>
      )
    },
    { field: 'departmentName', headerName: 'Department', minWidth: 170, flex: 0.14 },
    { field: 'locationName', headerName: 'Address', minWidth: 160, flex: 0.14 },
    { field: 'jobType', headerName: 'Job Type', minWidth: 130, flex: 0.1 },
    { field: 'city', headerName: 'City', minWidth: 120, flex: 0.1 },
    { field: 'country', headerName: 'Country', minWidth: 120, flex: 0.1 },
    {
      field: 'jobExpired',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.jobExpired ? 'error' : 'success'} label={params.row?.jobExpired ? 'Expired' : 'Open'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      flex: 0.08,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex' }}>
          <IconButton onClick={() => router.push(`/careers/add-career?mode=edit&id=${encodeURIComponent(params.row?.id ?? '')}`)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton color='error' onClick={() => handleDelete(params.row)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant='h5'>Careers</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Manage career jobs with department and location mapping.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomTextField size='small' placeholder='Search careers...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 240 }} />
            <Button variant='contained' onClick={() => router.push('/careers/add-career')}>
              Add Career
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <DataGrid
            autoHeight
            rows={filteredRows}
            getRowId={row => row.id}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          />
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default CareersManager
