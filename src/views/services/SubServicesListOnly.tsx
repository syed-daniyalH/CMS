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
import ServiceSlugSelector from 'src/@core/dropdown-selectors/ServiceSlugSelector'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

type RowType = {
  id: string
  name: string
  slug: string
  parentService: string
  scope: string
  isActive: boolean
  shortDescription: string
  industryNames: string[]
}

const SubServicesListOnly = () => {
  const router = useRouter()
  const serviceLinks = useSelector((state: RootState) => state.cmsDropdowns?.serviceLinks ?? [])
  const [loading, setLoading] = useState(false)
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('')
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<RowType[]>([])

  const fetchSubServices = async (serviceSlug: string) => {
    if (!serviceSlug) return
    setLoading(true)
    try {
      const selected = serviceLinks.find((item: any) => `${item?.slug ?? ''}` === `${serviceSlug}`)
      const res = await axiosInstance.get(`/api/menu-structure/services/${encodeURIComponent(serviceSlug)}/sub-services`)
      const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : []
      setRows(
        list.map((subService: any) => ({
          id: `${subService?.id ?? subService?._id ?? subService?.slug ?? ''}`,
          name: `${subService?.name ?? ''}`.trim(),
          slug: `${subService?.slug ?? ''}`.trim(),
          parentService: selected?.name || serviceSlug,
          scope: `${subService?.scope ?? 'blog'}`.trim(),
          isActive: subService?.isActive ?? true,
          shortDescription: `${subService?.shortDescription ?? ''}`.trim(),
          industryNames: Array.isArray(subService?.industries)
            ? subService.industries.map((i: any) => `${i?.name ?? i?.title ?? ''}`.trim()).filter(Boolean)
            : []
        }))
      )
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to load sub services.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedServiceSlug && serviceLinks.length) {
      setSelectedServiceSlug(serviceLinks[0]?.slug ?? '')
    }
  }, [serviceLinks, selectedServiceSlug])

  useEffect(() => {
    if (!selectedServiceSlug) return
    fetchSubServices(selectedServiceSlug).then(() => null)
  }, [selectedServiceSlug, serviceLinks])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item =>
      `${item.name} ${item.slug} ${item.parentService} ${item.industryNames.join(' ')}`.toLowerCase().includes(q)
    )
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Sub Service', flex: 0.24, minWidth: 220 },
    { field: 'slug', headerName: 'Slug', flex: 0.2, minWidth: 180 },
    { field: 'parentService', headerName: 'Parent Service', flex: 0.2, minWidth: 180 },
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
      field: 'industries',
      headerName: 'Industries',
      flex: 0.18,
      minWidth: 180,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const names = (params.row?.industryNames ?? []) as string[]
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
          onClick={() =>
            router.push(
              `/services/add-sub-service?mode=edit&serviceSlug=${encodeURIComponent(selectedServiceSlug)}&slug=${encodeURIComponent(
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
          <Typography variant='h5'>Sub Services Manager</Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: { xs: '100%', md: 760 } }}>
          <Grid item xs={12} md={4}>
            <ServiceSlugSelector
              selectedValue={selectedServiceSlug}
              handleChange={val => setSelectedServiceSlug(val?.slug ?? '')}
              
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <CustomTextField fullWidth size='small' placeholder='Search sub service...' value={search} onChange={e => setSearch(e.target.value ?? '')} />
          </Grid>
         
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant='contained'
              disabled={!selectedServiceSlug}
              onClick={() => router.push(`/services/add-sub-service?serviceSlug=${encodeURIComponent(selectedServiceSlug)}`)}
            >
              Add Sub Service
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box sx={{ p: { xs: 2, md: 3 } }}>
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

export default SubServicesListOnly

