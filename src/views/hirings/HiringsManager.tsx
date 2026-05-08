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

type HiringRow = {
  id: string
  title: string
  slug: string
  middleTitle: string
  lastTitle: string
  hasPage: boolean
  isActive: boolean
  metaTitle: string
}

const HiringsManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<HiringRow[]>([])
  const [search, setSearch] = useState('')

  const fetchHirings = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/menu-structure/hirings')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? item?.slug ?? ''}`,
          title: `${item?.title ?? item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          middleTitle: `${item?.middleTitle ?? ''}`,
          lastTitle: `${item?.lastTitle ?? ''}`,
          hasPage: item?.hasPage ?? true,
          isActive: item?.isActive ?? true,
          metaTitle: `${item?.metaTitle ?? ''}`
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load hirings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHirings().then(() => null)
  }, [])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.title} ${item.slug} ${item.middleTitle} ${item.lastTitle} ${item.metaTitle}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', minWidth: 220, flex: 0.24 },
    { field: 'slug', headerName: 'Slug', minWidth: 180, flex: 0.18 },
    { field: 'middleTitle', headerName: 'Middle Title', minWidth: 180, flex: 0.16 },
    {
      field: 'hasPage',
      headerName: 'Has Page',
      minWidth: 120,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.hasPage ? 'success' : 'secondary'} label={params.row?.hasPage ? 'True' : 'False'} />
      )
    },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 120,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.isActive ? 'success' : 'secondary'} label={params.row?.isActive ? 'Active' : 'Inactive'} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 140,
      flex: 0.12,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => router.push(`/hirings/add-hiring?mode=edit&slug=${encodeURIComponent(params.row?.slug ?? '')}`)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton onClick={() => router.push(`/hirings/sub-hirings-list?hiringSlug=${encodeURIComponent(params.row?.slug ?? '')}`)}>
            <Icon icon='tabler:list-details' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant='h5'>Hirings Manager</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Manage hiring pages and template data.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomTextField size='small' placeholder='Search hiring...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 220 }} />
            <Button variant='contained' onClick={() => router.push('/hirings/add-hiring')}>Add Hiring</Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
          <DataGrid autoHeight rows={filteredRows} getRowId={row => row.id} columns={columns} disableRowSelectionOnClick pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }} />
        </Box>
      </Card>
      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default HiringsManager
