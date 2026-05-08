import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextField from 'src/core/components/mui/text-field'
import Icon from 'src/core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { getData } from 'src/store/case-study'
import CustomChip from 'src/core/components/mui/chip'
import { useRouter } from 'next/navigation'

const columns = (onEdit: (id: string, slug: string) => void): GridColDef[] => [
  {
    flex: 0.24,
    minWidth: 220,
    field: 'title',
    headerName: 'Title',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.title ?? '-'}</Typography>
  },
  {
    flex: 0.18,
    minWidth: 170,
    field: 'slug',
    headerName: 'Slug',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.slug ?? '-'}</Typography>
  },
  {
    flex: 0.22,
    minWidth: 200,
    field: 'shortDescription',
    headerName: 'Short Description',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2'>{`${params.row?.shortDescription ?? ''}`.slice(0, 80) || '-'}</Typography>
    )
  },
  {
    flex: 0.14,
    minWidth: 120,
    field: 'publishStatus',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => {
      const status = params.row?.publishStatus ?? 'draft'
      const color = status === 'published' ? 'success' : status === 'scheduled' ? 'warning' : 'secondary'
      return <CustomChip rounded size='small' skin='light' color={color as any} label={status} />
    }
  },
  {
    flex: 0.14,
    minWidth: 140,
    field: 'category',
    headerName: 'Category',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2'>{params.row?.categories?.[0]?.name ?? '-'}</Typography>
    )
  },
  {
    flex: 0.08,
    minWidth: 100,
    field: 'industrySlug',
    headerName: 'Industry',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2'>{params.row?.industrySlug ?? '-'}</Typography>
    )
  },
  {
    flex: 0.08,
    minWidth: 80,
    maxWidth: 80,
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    filterable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <IconButton onClick={() => onEdit(params.row?._id, params.row?.slug)}>
        <Icon icon='tabler:edit' />
      </IconButton>
    )
  }
]

const CaseStudyTable = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.caseStudies)
  const [searchValue, setSearchValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    dispatch(
      getData({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: searchValue.trim()
      })
    )
  }, [dispatch, paginationModel, searchValue])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'end' }}>
        <CustomTextField
          value={searchValue}
          onChange={e => setSearchValue(e.target.value ?? '')}
          placeholder='Search case study...'
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            )
          }}
        />
      </Box>

      <DataGrid
        pagination
        disableRowSelectionOnClick
        rows={store?.data ?? []}
        rowCount={store?.totalRecords ?? 0}
        getRowId={row => row._id}
        columns={columns((id: string, slug: string) => router.push(`/case-study/add?id=${id}&slug=${encodeURIComponent(slug || '')}`))}
        columnHeaderHeight={34}
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  )
}

export default CaseStudyTable
