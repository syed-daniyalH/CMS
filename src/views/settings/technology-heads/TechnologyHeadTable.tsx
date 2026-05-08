import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { TechnologyHeadSearchParams, getData } from 'src/store/settings/technology-heads'
import type { TechnologyHeadSchema } from './TechnologyHeadFormDrawer'

const columns = (toggleForm: (row: TechnologyHeadSchema) => void): GridColDef[] => [
  {
    flex: 0.2,
    minWidth: 200,
    field: 'name',
    headerName: 'Name',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.name ?? '-'}</Typography>
  },
  {
    flex: 0.18,
    minWidth: 160,
    field: 'slug',
    headerName: 'Slug',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.slug ?? '-'}</Typography>
  },
  {
    flex: 0.32,
    minWidth: 240,
    field: 'shortDescription',
    headerName: 'Short description',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2'>{`${params.row?.shortDescription ?? ''}`.slice(0, 120) || '-'}</Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 220,
    field: 'description',
    headerName: 'Description',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2'>{`${params.row?.description ?? ''}`.slice(0, 100) || '-'}</Typography>
    )
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
      <IconButton onClick={() => toggleForm(params.row)}>
        <Icon icon='tabler:edit' />
      </IconButton>
    )
  }
]

const TechnologyHeadTable = ({ toggleForm }: { toggleForm: (row?: TechnologyHeadSchema | null) => void }) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.technologyHeads)
  const [searchValue, setSearchValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    const params: TechnologyHeadSearchParams = {
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
          placeholder='Search technology heads...'
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
        getRowId={row => row.id ?? row._id ?? row.slug}
        columns={columns((row: TechnologyHeadSchema) => toggleForm(row))}
        columnHeaderHeight={34}
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  )
}

export default TechnologyHeadTable
