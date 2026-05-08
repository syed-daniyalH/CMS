import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomChip from 'src/@core/components/mui/chip'
import CustomBackdrop from 'src/@core/components/loading'
import axiosInstance from 'src/@core/utils/axiosInstence'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type RowType = {
  id: string
  name: string
  slug: string
  scope: string
  isActive: boolean
  shortDescription: string
}

const ServicesListOnly = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<RowType[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/menu-structure/services')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((service: any) => ({
          id: `${service?.id ?? service?._id ?? service?.slug ?? ''}`,
          name: `${service?.name ?? ''}`.trim(),
          slug: `${service?.slug ?? ''}`.trim(),
          scope: `${service?.scope ?? 'blog'}`.trim(),
          isActive: service?.isActive ?? true,
          shortDescription: `${service?.shortDescription ?? ''}`.trim()
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load services list.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData().then(() => null)
  }, [])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.name} ${item.slug} ${item.shortDescription}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Service', flex: 0.24, minWidth: 220 },
    { field: 'slug', headerName: 'Slug', flex: 0.2, minWidth: 180 },
    { field: 'scope', headerName: 'Scope', flex: 0.12, minWidth: 120 },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.12,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.isActive ? 'success' : 'secondary'} label={params.row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'shortDescription',
      headerName: 'Short Description',
      flex: 0.24,
      minWidth: 260,
      renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{`${params.row?.shortDescription ?? ''}`.slice(0, 100) || '-'}</Typography>
    }
  ]

  return (
    <Card sx={{ borderRadius: 0 }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h5'>Services List</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>All parent services from 2-level CMS architecture.</Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: 520 }}>
          <Grid item xs={7}>
            <CustomTextField fullWidth placeholder='Search service...' value={search} onChange={e => setSearch(e.target.value ?? '')} />
          </Grid>
          <Grid item xs={5}>
            <Button fullWidth variant='contained' onClick={() => router.push('/services/list')}>Open Manager</Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: 3 }}>
        <DataGrid
          autoHeight
          rows={filteredRows}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
        />
      </Box>
      <CustomBackdrop open={loading} />
    </Card>
  )
}

export default ServicesListOnly

