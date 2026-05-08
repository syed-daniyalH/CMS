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

type TechnologyRow = {
  id: string
  name: string
  slug: string
  shortDescription: string
  sortOrder: number
  isActive: boolean
  headNames: string[]
}

const TechnologiesManager = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<TechnologyRow[]>([])
  const [search, setSearch] = useState('')

  const fetchTechnologies = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/menu-structure/technologies')
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? item?.slug ?? ''}`,
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          shortDescription: `${item?.shortDescription ?? ''}`,
          sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : Number(item?.sortOrder ?? 0) || 0,
          isActive: item?.isActive ?? true,
          headNames: Array.isArray(item?.heads)
            ? item.heads.map((h: any) => `${h?.name ?? ''}`.trim()).filter(Boolean)
            : Array.isArray(item?.technologyHeads)
              ? item.technologyHeads.map((h: any) => `${h?.name ?? ''}`.trim()).filter(Boolean)
              : []
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load technologies.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechnologies().then(() => null)
  }, [])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item =>
      `${item.name} ${item.slug} ${item.shortDescription} ${item.headNames.join(' ')}`.toLowerCase().includes(q)
    )
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Technology', minWidth: 200, flex: 0.22 },
    { field: 'slug', headerName: 'Slug', minWidth: 160, flex: 0.18 },
    { field: 'sortOrder', headerName: 'Order', minWidth: 80, flex: 0.08, type: 'number' },
    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 110,
      flex: 0.1,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params.row?.isActive ? 'success' : 'secondary'}
          label={params.row?.isActive ? 'Active' : 'Inactive'}
        />
      )
    },
    {
      field: 'heads',
      headerName: 'Heads',
      minWidth: 180,
      flex: 0.18,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const names = (params.row?.headNames ?? []) as string[]
        if (!names.length) return <Typography variant='body2'>-</Typography>
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
            {names.slice(0, 5).map((n: string, idx: number) => (
              <CustomChip key={`${n}-${idx}`} rounded size='small' skin='light' color='primary' label={n} />
            ))}
            {names.length > 5 ? (
              <Typography variant='caption' color='text.secondary' sx={{ alignSelf: 'center' }}>
                +{names.length - 5}
              </Typography>
            ) : null}
          </Box>
        )
      }
    },
    {
      field: 'shortDescription',
      headerName: 'Short description',
      minWidth: 240,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2'>{`${params.row?.shortDescription ?? ''}`.slice(0, 100) || '-'}</Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 90,
      flex: 0.06,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() =>
            router.push(`/technologies/add-technology?mode=edit&slug=${encodeURIComponent(params.row?.slug ?? '')}`)
          }
        >
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
            <Typography variant='h5'>Technologies</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Technology cards linked to technology heads.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomTextField
              size='small'
              placeholder='Search...'
              value={search}
              onChange={e => setSearch(e.target.value ?? '')}
              sx={{ minWidth: 220 }}
            />
            <Button variant='contained' onClick={() => router.push('/technologies/add-technology')}>
              Add technology
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

export default TechnologiesManager
