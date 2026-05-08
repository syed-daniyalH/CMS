import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/core/components/icon'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomChip from 'src/core/components/mui/chip'
import { AppDispatch, RootState } from 'src/store'
import { getData, SectionsSearchParams } from 'src/store/crm/sections'

const columns = (onEdit: (row: any) => void, onDelete: (row: any) => void): GridColDef[] => [
  {
    flex: 0.28,
    minWidth: 220,
    field: 'sectionType',
    headerName: 'Section Type',
    renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{row?.sectionType?.name ?? '-'}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 130,
    field: 'isVisible',
    headerName: 'Visibility',
    renderCell: ({ row }: GridRenderCellParams) => (
      <CustomChip rounded size='small' skin='light' color={row?.isVisible ? 'success' : 'secondary'} label={row?.isVisible ? 'Visible' : 'Hidden'} />
    )
  },
  {
    flex: 0.3,
    minWidth: 220,
    field: 'createdAt',
    headerName: 'Created',
    renderCell: ({ row }: GridRenderCellParams) => (
      <Typography variant='body2'>{row?.createdAt ? new Date(row.createdAt).toLocaleString() : '-'}</Typography>
    )
  },
  {
    flex: 0.18,
    minWidth: 120,
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    filterable: false,
    renderCell: ({ row }: GridRenderCellParams) => (
      <Box>
        <IconButton onClick={() => onEdit(row)}>
          <Icon icon='tabler:edit' />
        </IconButton>
        <IconButton color='error' onClick={() => onDelete(row)}>
          <Icon icon='tabler:trash' />
        </IconButton>
      </Box>
    )
  }
]

const SectionTable = ({ onEdit, onDelete }: { onEdit: (row: any) => void; onDelete: (row: any) => void }) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.sections)
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    const params: SectionsSearchParams = {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: searchValue.trim()
    }
    dispatch(getData(params))
  }, [dispatch, paginationModel, searchValue])

  return (
    <Box>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <CustomTextField
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder='Search sections...'
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
        disableRowSelectionOnClick
        rows={store?.data ?? []}
        rowCount={store?.totalRecords ?? 0}
        getRowId={row => row?._id}
        columns={columns(onEdit, onDelete)}
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  )
}

export default SectionTable
