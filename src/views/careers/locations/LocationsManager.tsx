import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import Icon from 'src/core/components/icon'
import CustomChip from 'src/core/components/mui/chip'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomBackdrop from 'src/core/components/loading'
import axiosInstance from 'src/core/utils/axiosInstence'

type DepartmentOption = { id: string; name: string; slug?: string }

type LocationRow = {
  id: string
  departmentId: string
  departmentIds: string[]
  departmentName: string
  name: string
  slug: string
  city: string
  stateProvince: string
  country: string
  zipPostalCode: string
  remoteOnsite: string
  sortOrder: number
  isActive: boolean
}

type LocationForm = {
  id?: string
  departmentId: string
  departmentIds: string[]
  name: string
  slug: string
  city: string
  stateProvince: string
  country: string
  zipPostalCode: string
  remoteOnsite: string
  sortOrder: number
  isActive: boolean
}

const defaultForm: LocationForm = {
  departmentId: '',
  departmentIds: [],
  name: '',
  slug: '',
  city: '',
  stateProvince: '',
  country: '',
  zipPostalCode: '',
  remoteOnsite: '',
  sortOrder: 0,
  isActive: true
}

const slugify = (value: string) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const getErrorMessage = (error: any) => error?.response?.data?.message || error?.message || 'Something went wrong.'

const LocationsManager = () => {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<LocationRow[]>([])
  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [form, setForm] = useState<LocationForm>(defaultForm)

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/api/dropdowns/career-departments')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      setDepartments(list.map((item: any) => ({ id: `${item?.id ?? item?._id ?? ''}`, name: `${item?.name ?? ''}`, slug: `${item?.slug ?? ''}` })))
    } catch (_error) {
      setDepartments([])
    }
  }

  const fetchLocations = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/career-locations')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      setRows(
        list.map((item: any) => ({
          constDepartmentIds: Array.isArray(item?.departmentIds)
            ? item.departmentIds.map((dep: any) => `${dep?.id ?? dep?._id ?? dep}`).filter((dep: string) => !!dep)
            : [],
          id: `${item?.id ?? item?._id ?? ''}`,
          departmentId: `${item?.departmentId ?? item?.department?._id ?? item?.department?.id ?? ''}`,
          departmentIds: [],
          departmentName: '',
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          city: `${item?.city ?? ''}`,
          stateProvince: `${item?.stateProvince ?? ''}`,
          country: `${item?.country ?? ''}`,
          zipPostalCode: `${item?.zipPostalCode ?? ''}`,
          remoteOnsite: `${item?.remoteOnsite ?? ''}`,
          sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : Number(item?.sortOrder ?? 0) || 0,
          isActive: item?.isActive ?? true
        }))
          .map((row: any, index: number) => {
            const item: any = list[index]
            const primaryDepartmentId = row.departmentId || row.constDepartmentIds?.[0] || ''
            const mergedDepartmentIds = Array.from(
              new Set([...(row.constDepartmentIds || []), ...(primaryDepartmentId ? [primaryDepartmentId] : [])])
            ).filter(Boolean) as string[]
            const namesFromArray = Array.isArray(item?.departments)
              ? item.departments.map((dep: any) => `${dep?.name ?? ''}`.trim()).filter(Boolean)
              : []
            const singleName = `${item?.department?.name ?? ''}`.trim()
            const departmentNames = namesFromArray.length > 0 ? namesFromArray : singleName ? [singleName] : []
            return {
              ...row,
              departmentId: primaryDepartmentId,
              departmentIds: mergedDepartmentIds,
              departmentName: departmentNames.join(', ')
            }
          })
      )
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments().then(() => null)
    fetchLocations().then(() => null)
  }, [])

  useEffect(() => {
    if (!formOpen || slugTouched) return
    setForm(prev => ({ ...prev, slug: slugify(prev.name) }))
  }, [form.name, slugTouched, formOpen])

  const openCreate = () => {
    setForm(defaultForm)
    setSlugTouched(false)
    setFormOpen(true)
  }

  const openEdit = (row: LocationRow) => {
    setForm({
      id: row.id,
      departmentId: row.departmentId,
      departmentIds: row.departmentIds?.length ? row.departmentIds : row.departmentId ? [row.departmentId] : [],
      name: row.name,
      slug: row.slug,
      city: row.city,
      stateProvince: row.stateProvince,
      country: row.country,
      zipPostalCode: row.zipPostalCode,
      remoteOnsite: row.remoteOnsite,
      sortOrder: row.sortOrder,
      isActive: row.isActive
    })
    setSlugTouched(true)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setForm(defaultForm)
    setSlugTouched(false)
  }

  const handleSave = async () => {
    const normalizedDepartmentIds = Array.from(
      new Set((Array.isArray(form.departmentIds) ? form.departmentIds : []).map(item => `${item ?? ''}`.trim()).filter(Boolean))
    )
    if (normalizedDepartmentIds.length === 0) return toast.error('At least one department is required.')
    if (!form.name.trim()) return toast.error('Location name is required.')
    setLoading(true)
    try {
      const primaryDepartmentId = normalizedDepartmentIds[0] || ''
      const payload = {
        departmentId: primaryDepartmentId,
        departmentIds: normalizedDepartmentIds,
        name: form.name.trim(),
        slug: form.slug.trim(),
        city: form.city.trim(),
        stateProvince: form.stateProvince.trim(),
        country: form.country.trim(),
        zipPostalCode: form.zipPostalCode.trim(),
        remoteOnsite: form.remoteOnsite.trim(),
        isActive: !!form.isActive,
        sortOrder: Number(form.sortOrder ?? 0) || 0
      }
      if (form.id) {
        await axiosInstance.put(`/api/career-locations/${form.id}`, payload)
        toast.success('Location updated successfully.')
      } else {
        await axiosInstance.post('/api/career-locations', payload)
        toast.success('Location created successfully.')
      }
      closeForm()
      await fetchLocations()
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (row: LocationRow) => {
    const ok = window.confirm(`Delete location "${row.name}"?`)
    if (!ok) return
    setLoading(true)
    try {
      await axiosInstance.delete(`/api/career-locations/${row.id}`)
      toast.success('Location deleted successfully.')
      await fetchLocations()
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.name} ${item.slug} ${item.departmentName} ${item.city} ${item.country}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Address', minWidth: 170, flex: 0.17 },
    { field: 'departmentName', headerName: 'Department', minWidth: 180, flex: 0.16 },
    { field: 'slug', headerName: 'Slug', minWidth: 160, flex: 0.14 },

    {
      field: 'isActive',
      headerName: 'Status',
      minWidth: 110,
      flex: 0.09,
      renderCell: (params: GridRenderCellParams) => (
        <CustomChip rounded size='small' skin='light' color={params.row?.isActive ? 'success' : 'secondary'} label={params.row?.isActive ? 'Active' : 'Inactive'} />
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
          <IconButton onClick={() => openEdit(params.row)}>
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
            <Typography variant='h5'>Career Locations</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Manage job locations grouped by department.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomTextField size='small' placeholder='Search location...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 240 }} />
            <Button variant='contained' onClick={openCreate}>
              Add Location
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

      <Dialog open={formOpen} onClose={closeForm} fullWidth maxWidth='sm'>
        <DialogTitle>{form.id ? 'Edit Location' : 'Create Location'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          
            <CustomTextField
              select
              fullWidth
              label='Departments'
              SelectProps={{
                multiple: true,
                value: form.departmentIds,
                onChange: e => {
                  const selected = ((e.target.value as string[]) ?? []).map(item => `${item ?? ''}`.trim()).filter(Boolean)
                  setForm(prev => ({
                    ...prev,
                    departmentIds: selected,
                    departmentId: selected[0] ?? ''
                  }))
                },
                renderValue: selected =>
                  (selected as string[])
                    .map(id => departments.find(dep => dep.id === id)?.name || id)
                    .join(', ')
              }}
            >
              {departments.map(dep => (
                <MenuItem key={dep.id} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </CustomTextField>
            <CustomTextField fullWidth label='Address' value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value ?? '' }))} />
            <CustomTextField
              fullWidth
              label='Slug'
              value={form.slug}
              onChange={e => {
                setSlugTouched(true)
                setForm(prev => ({ ...prev, slug: slugify(e.target.value ?? '') }))
              }}
            />
            <CustomTextField select fullWidth label='Status' value={form.isActive ? 'active' : 'inactive'} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.value === 'active' }))}>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </CustomTextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant='outlined' onClick={closeForm}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSave}>
            {form.id ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <CustomBackdrop open={loading} />
    </Box>
  )
}

export default LocationsManager
