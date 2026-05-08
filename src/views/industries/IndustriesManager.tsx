import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
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

type IndustryRow = {
  id: string
  name: string
  slug: string
  shortDescription: string
  scope: string
  isActive: boolean
}

const IndustriesManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<IndustryRow[]>([])
  const [search, setSearch] = useState('')

  const fetchIndustries = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/menu-structure/industries')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? item?.slug ?? ''}`,
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          shortDescription: `${item?.shortDescription ?? ''}`,
          scope: `${item?.scope ?? 'blog'}`,
          isActive: item?.isActive ?? true
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load industries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIndustries().then(() => null)
  }, [])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.name} ${item.slug} ${item.shortDescription}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Industry', minWidth: 220, flex: 0.24 },
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
        <IconButton onClick={() => router.push(`/industries/add-industry?mode=edit&slug=${encodeURIComponent(params.row?.slug ?? '')}`)}>
          <Icon icon='tabler:edit' />
        </IconButton>
      )
    }
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant='h5'>Industries Manager</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              CMS industries — same flow as services (full-page form).
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <CustomTextField size='small' placeholder='Search industry...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 220 }} />
            <Button variant='outlined' onClick={() => router.push('/industries/industries-list')}>
              Industries List
            </Button>
            <Button variant='contained' onClick={() => router.push('/industries/add-industry')}>
              Add Industry
            </Button>
          </Box>
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
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          />
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default IndustriesManager
