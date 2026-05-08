import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import Icon from 'src/core/components/icon'
import CustomChip from 'src/core/components/mui/chip'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'

type HiringOption = { id: string; title: string; slug: string }
type RowType = {
  id: string
  title: string
  slug: string
  parentHiring: string
  isActive: boolean
  hasPage: boolean
  metaTitle: string
}

const SubHiringsListOnly = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [hirings, setHirings] = useState<HiringOption[]>([])
  const [selectedHiringSlug, setSelectedHiringSlug] = useState('')
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<RowType[]>([])

  const fetchHiringsDropdown = async () => {
    try {
      const res = await axiosInstance.get('/api/dropdowns/hirings')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      const options = list
        .map((item: any) => ({
          id: `${item?.id ?? item?._id ?? ''}`.trim(),
          title: `${item?.title ?? item?.name ?? ''}`.trim(),
          slug: `${item?.slug ?? ''}`.trim()
        }))
        .filter((item: HiringOption) => item.slug)
      setHirings(options)
      const querySlug = `${router.query?.hiringSlug ?? ''}`.trim()
      setSelectedHiringSlug(querySlug || options?.[0]?.slug || '')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load hirings.')
    }
  }

  const fetchSubHirings = async (hiringSlug: string) => {
    if (!hiringSlug) return
    setLoading(true)
    try {
      const selected = hirings.find(item => item.slug === hiringSlug)
      const res = await axiosInstance.get(`/api/menu-structure/hirings/${encodeURIComponent(hiringSlug)}/sub-hirings`)
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? item?.slug ?? ''}`,
          title: `${item?.title ?? item?.name ?? ''}`.trim(),
          slug: `${item?.slug ?? ''}`.trim(),
          parentHiring: selected?.title || hiringSlug,
          isActive: item?.isActive ?? true,
          hasPage: item?.hasPage ?? true,
          metaTitle: `${item?.metaTitle ?? ''}`.trim()
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load sub hirings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHiringsDropdown().then(() => null)
  }, [])

  useEffect(() => {
    if (!selectedHiringSlug) return
    fetchSubHirings(selectedHiringSlug).then(() => null)
  }, [selectedHiringSlug, hirings])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.title} ${item.slug} ${item.parentHiring} ${item.metaTitle}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Sub Hiring', flex: 0.24, minWidth: 220 },
    { field: 'slug', headerName: 'Slug', flex: 0.2, minWidth: 180 },
    { field: 'parentHiring', headerName: 'Parent Hiring', flex: 0.2, minWidth: 180 },
    {
      field: 'hasPage',
      headerName: 'Has Page',
      flex: 0.12,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.hasPage ? 'success' : 'secondary'} label={params.row?.hasPage ? 'True' : 'False'} />
      )
    },
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
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 90,
      flex: 0.08,
      renderCell: (params: GridRenderCellParams) => (
        <IconButton
          onClick={() =>
            router.push(
              `/hirings/add-sub-hiring?mode=edit&hiringSlug=${encodeURIComponent(selectedHiringSlug)}&slug=${encodeURIComponent(
                params.row?.slug ?? ''
              )}`
            )
          }
        >
          <Icon icon='tabler:edit' />
        </IconButton>
      )
    }
  ]

  return (
    <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant='h5'>Sub Hirings Manager</Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: { xs: '100%', md: 760 } }}>
          <Grid item xs={12} md={4}>
            <CustomTextField select fullWidth size='small'  value={selectedHiringSlug} onChange={e => setSelectedHiringSlug(e.target.value ?? '')}>
              {hirings.map(item => (
                <MenuItem key={item.slug} value={item.slug}>
                  {item.title}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField fullWidth size='small' placeholder='Search sub hiring...' value={search} onChange={e => setSearch(e.target.value ?? '')} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button fullWidth variant='contained' disabled={!selectedHiringSlug} onClick={() => router.push(`/hirings/add-sub-hiring?hiringSlug=${encodeURIComponent(selectedHiringSlug)}`)}>
              Add Sub Hiring
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <DataGrid autoHeight rows={filteredRows} columns={columns} disableRowSelectionOnClick pageSizeOptions={[10, 25, 50]} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }} />
      </Box>

      <CustomBackdrop open={loading} />
    </Card>
  )
}

export default SubHiringsListOnly
