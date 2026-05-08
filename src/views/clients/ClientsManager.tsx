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
import Icon from 'src/core/components/icon'
import CustomChip from 'src/core/components/mui/chip'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'

type ClientRow = {
  id: string
  name: string
  slug: string
  websiteUrl: string
  shortDescription: string
  sortOrder: number
  isActive: boolean
}

const ClientsManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<ClientRow[]>([])
  const [search, setSearch] = useState('')

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/clients')
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.docs)
          ? res.data.docs
          : Array.isArray(res?.data)
            ? res.data
            : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? ''}`,
          name: `${item?.name ?? ''}`.trim(),
          slug: `${item?.slug ?? ''}`.trim(),
          websiteUrl: `${item?.websiteUrl ?? ''}`.trim(),
          shortDescription: `${item?.shortDescription ?? ''}`.trim(),
          sortOrder: Number(item?.sortOrder ?? 0) || 0,
          isActive: item?.isActive ?? true
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load clients.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients().then(() => null)
  }, [])

  const onDelete = async (id: string) => {
    if (!id) return
    const ok = typeof window !== 'undefined' ? window.confirm('Delete this client?') : false
    if (!ok) return
    try {
      setLoading(true)
      await axiosInstance.delete(`/api/clients/${encodeURIComponent(id)}`)
      toast.success('Client deleted successfully.')
      await fetchClients()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to delete client.')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.name} ${item.slug} ${item.shortDescription} ${item.websiteUrl}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Client', minWidth: 180, flex: 0.18 },
    { field: 'slug', headerName: 'Slug', minWidth: 160, flex: 0.16 },
    {
      field: 'websiteUrl',
      headerName: 'Website',
      minWidth: 220,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' noWrap>{params.row?.websiteUrl || '-'}</Typography>
      )
    },
    {
      field: 'sortOrder',
      headerName: 'Sort',
      minWidth: 90,
      flex: 0.08,
      renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.sortOrder ?? 0}</Typography>
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
      field: 'shortDescription',
      headerName: 'Short Description',
      minWidth: 260,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{`${params.row?.shortDescription ?? ''}`.slice(0, 90) || '-'}</Typography>
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 110,
      flex: 0.08,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => router.push(`/clients/add-client?mode=edit&id=${encodeURIComponent(params.row?.id ?? '')}`)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton color='error' onClick={() => onDelete(`${params.row?.id ?? ''}`)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant='h5'>Clients Manager</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Manage Our Clients cards from CMS.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <CustomTextField size='small' placeholder='Search client...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 220 }} />
            <Button variant='contained' onClick={() => router.push('/clients/add-client')}>
              Add Client
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

export default ClientsManager
