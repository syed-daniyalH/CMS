import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'

type ServiceRow = {
  id: string
  name: string
  slug: string
  shortDescription: string
  scope: string
  isActive: boolean
  industryNames: string[]
}

const ServicesManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ServiceRow[]>([])
  const [search, setSearch] = useState('')

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/menu-structure/services')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? item?.slug ?? ''}`,
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          shortDescription: `${item?.shortDescription ?? ''}`,
          scope: `${item?.scope ?? 'blog'}`,
          isActive: item?.isActive ?? true,
          industryNames: Array.isArray(item?.industries)
            ? item.industries.map((i: any) => `${i?.name ?? i?.title ?? ''}`.trim()).filter(Boolean)
            : []
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load services.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices().then(() => null)
  }, [])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item =>
      `${item.name} ${item.slug} ${item.shortDescription} ${item.industryNames.join(' ')}`.toLowerCase().includes(q)
    )
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Service', minWidth: 220, flex: 0.24 },
    { field: 'slug', headerName: 'Slug', minWidth: 180, flex: 0.2 },
    { field: 'scope', headerName: 'Scope', minWidth: 120, flex: 0.12 },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.12,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.isActive ? 'success' : 'secondary'} label={params.row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'industries',
      headerName: 'Industries',
      minWidth: 200,
      flex: 0.2,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const names = (params.row?.industryNames ?? []) as string[]
        if (!names.length) return <Typography variant='body2'>-</Typography>
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
            {names.slice(0, 6).map((n: string, idx: number) => (
              <CustomChip key={`${n}-${idx}`} rounded size='small' skin='light' color='primary' label={n} />
            ))}
            {names.length > 6 ? (
              <Typography variant='caption' color='text.secondary' sx={{ alignSelf: 'center' }}>
                +{names.length - 6}
              </Typography>
            ) : null}
          </Box>
        )
      }
    },
    {
      field: 'shortDescription',
      headerName: 'Short Description',
      minWidth: 280,
      flex: 0.28,
      renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{`${params.row?.shortDescription ?? ''}`.slice(0, 120) || '-'}</Typography>
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 90,
      flex: 0.08,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton onClick={() => router.push(`/services/add-service?mode=edit&slug=${encodeURIComponent(params.row?.slug ?? '')}`)}>
          <Icon icon='tabler:edit' />
        </IconButton>
      )
    }
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant='h5'>Services Manager</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Separate form flow (no drawer/dialog).
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomTextField size='small' placeholder='Search service...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 220 }} />
            <Button variant='outlined' onClick={() => router.push('/services/sub-services-list')}>Sub Services</Button>
            <Button variant='contained' onClick={() => router.push('/services/add-service')}>Add Service</Button>
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

export default ServicesManager

