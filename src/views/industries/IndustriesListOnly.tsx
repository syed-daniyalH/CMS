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
import Icon from 'src/core/components/icon'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomChip from 'src/core/components/mui/chip'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'

type RowType = {
  id: string
  name: string
  slug: string
  scope: string
  isActive: boolean
  shortDescription: string
}

const IndustriesListOnly = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<RowType[]>([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/menu-structure/industries')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? item?.slug ?? ''}`,
          name: `${item?.name ?? ''}`.trim(),
          slug: `${item?.slug ?? ''}`.trim(),
          scope: `${item?.scope ?? 'blog'}`.trim(),
          isActive: item?.isActive ?? true,
          shortDescription: `${item?.shortDescription ?? ''}`.trim()
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load industries.')
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
    { field: 'name', headerName: 'Industry', flex: 0.24, minWidth: 220 },
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
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 90,
      flex: 0.08,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() => router.push(`/industries/add-industry?mode=edit&slug=${encodeURIComponent(params.row?.slug ?? '')}`)}
          disabled={!params.row?.slug}
        >
          <Icon icon='tabler:edit' />
        </IconButton>
      )
    }
  ]

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant='h5'>Industries List</Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            Read-only list from GET /api/menu-structure/industries
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: { xs: '100%', md: 520 } }}>
          <Grid item xs={12} md={7}>
            <CustomTextField fullWidth placeholder='Search...' value={search} onChange={e => setSearch(e.target.value ?? '')} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Button fullWidth variant='contained' onClick={() => router.push('/industries/list')}>
              Open Manager
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <DataGrid
          autoHeight
          rows={filteredRows}
          getRowId={row => row.id}
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

export default IndustriesListOnly
