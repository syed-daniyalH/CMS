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

type DepartmentRow = {
  id: string
  name: string
  slug: string
  description: string
  sortOrder: number
  isActive: boolean
}

type DepartmentForm = {
  id?: string
  name: string
  slug: string
  description: string
  sortOrder: number
  isActive: boolean
}

const defaultForm: DepartmentForm = {
  name: '',
  slug: '',
  description: '',
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

const DepartmentsManager = () => {
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<DepartmentRow[]>([])
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [form, setForm] = useState<DepartmentForm>(defaultForm)

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/api/career-departments')
      const list = Array.isArray(res?.data?.data) ? res.data.data : []
      setRows(
        list.map((item: any) => ({
          id: `${item?.id ?? item?._id ?? ''}`,
          name: `${item?.name ?? ''}`,
          slug: `${item?.slug ?? ''}`,
          description: `${item?.description ?? ''}`,
          sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : Number(item?.sortOrder ?? 0) || 0,
          isActive: item?.isActive ?? true
        }))
      )
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments().then(() => null)
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

  const openEdit = (row: DepartmentRow) => {
    setForm({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
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
    if (!form.name.trim()) return toast.error('Department name is required.')
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        isActive: !!form.isActive,
        sortOrder: Number(form.sortOrder ?? 0) || 0
      }
      if (form.id) {
        await axiosInstance.put(`/api/career-departments/${form.id}`, payload)
        toast.success('Department updated successfully.')
      } else {
        await axiosInstance.post('/api/career-departments', payload)
        toast.success('Department created successfully.')
      }
      closeForm()
      await fetchDepartments()
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (row: DepartmentRow) => {
    const ok = window.confirm(`Delete department "${row.name}"?`)
    if (!ok) return
    setLoading(true)
    try {
      await axiosInstance.delete(`/api/career-departments/${row.id}`)
      toast.success('Department deleted successfully.')
      await fetchDepartments()
    } catch (error: any) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(item => `${item.name} ${item.slug} ${item.description}`.toLowerCase().includes(q))
  }, [rows, search])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Department', minWidth: 220, flex: 0.22 },
    { field: 'slug', headerName: 'Slug', minWidth: 170, flex: 0.18 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 280,
      flex: 0.32,
      renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{`${params.row?.description ?? ''}`.slice(0, 120) || '-'}</Typography>
    },
    { field: 'sortOrder', headerName: 'Order', minWidth: 90, flex: 0.08, type: 'number' },
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
            <Typography variant='h5'>Career Departments</Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Manage job departments used in career postings.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomTextField size='small' placeholder='Search department...' value={search} onChange={e => setSearch(e.target.value ?? '')} sx={{ minWidth: 240 }} />
            <Button variant='contained' onClick={openCreate}>
              Add Department
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
        <DialogTitle>{form.id ? 'Edit Department' : 'Create Department'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <CustomTextField fullWidth label='Name' value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value ?? '' }))} />
            <CustomTextField
              fullWidth
              label='Slug'
              value={form.slug}
              onChange={e => {
                setSlugTouched(true)
                setForm(prev => ({ ...prev, slug: slugify(e.target.value ?? '') }))
              }}
            />
            <CustomTextField fullWidth multiline rows={3} label='Description' value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value ?? '' }))} />
            <CustomTextField fullWidth type='number' label='Sort Order' value={form.sortOrder} onChange={e => setForm(prev => ({ ...prev, sortOrder: Number(e.target.value ?? 0) || 0 }))} />
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

export default DepartmentsManager
