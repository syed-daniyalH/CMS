import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextField from 'src/core/components/mui/text-field'
import Icon from 'src/core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { CaseStudySubCategorySearchParams, getData } from 'src/store/case-study/sub-category'
import CustomChip from 'src/core/components/mui/chip'
import type { CaseStudySubCategorySchema } from './SubCategoryFormDrawer'

const getCategoryLabel = (row: any) => row?.parentCategoryName || row?.category?.name || row?.categoryName || row?.category?.title || '-'

const columns = (toggleForm: (row: CaseStudySubCategorySchema) => void): GridColDef[] => [
  {
    flex: 0.2,
    minWidth: 180,
    field: 'name',
    headerName: 'Name',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.name ?? '-'}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: 'categoryName',
    headerName: 'Category',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{getCategoryLabel(params.row)}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 160,
    field: 'slug',
    headerName: 'Slug',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.slug ?? '-'}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'isActive',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => (
      <CustomChip rounded size='small' skin='light' color={params.row?.isActive ? 'success' : 'secondary'} label={params.row?.isActive ? 'Active' : 'InActive'} />
    )
  },
  {
    flex: 0.25,
    minWidth: 200,
    field: 'shortDescription',
    headerName: 'Description',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.shortDescription ?? '-'}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 80,
    maxWidth: 80,
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    filterable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <IconButton
        onClick={() =>
          toggleForm({
            ...params.row,
            categoryId: params.row?.parentCategoryId || params.row?.categoryId || params.row?.category?._id || ''
          })
        }
      >
        <Icon icon='tabler:edit' />
      </IconButton>
    )
  }
]

const SubCategoryTable = ({ toggleForm }: { toggleForm: (row?: CaseStudySubCategorySchema | null) => void }) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.caseStudySubCategory)
  const [searchValue, setSearchValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    const params: CaseStudySubCategorySearchParams = {
      PageNo: paginationModel.page + 1,
      PageSize: paginationModel.pageSize,
      search: searchValue?.trim() || ''
    }
    dispatch(getData(params))
  }, [dispatch, paginationModel, searchValue])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'end' }}>
        <CustomTextField
          value={searchValue}
          onChange={e => setSearchValue(e.target.value ?? '')}
          placeholder='Search sub category...'
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
        getRowId={row => row.id ?? row._id}
        columns={columns((row: CaseStudySubCategorySchema) => toggleForm(row))}
        columnHeaderHeight={34}
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  )
}

export default SubCategoryTable
