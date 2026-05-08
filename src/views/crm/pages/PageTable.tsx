import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/core/components/icon'
import CustomTextField from 'src/core/components/mui/text-field'
import CustomChip from 'src/core/components/mui/chip'
import { AppDispatch, RootState } from 'src/store'
import { CmsPagesSearchParams, getData } from 'src/store/crm/pages'

const columns = (onEdit: (row: any) => void, onDelete: (row: any) => void): GridColDef[] => [
  {
    flex: 0.24,
    minWidth: 200,
    field: 'title',
    headerName: 'Title',
    renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{row?.title ?? '-'}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 170,
    field: 'slug',
    headerName: 'Slug',
    renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{row?.slug ?? '-'}</Typography>
  },
  {
    flex: 0.14,
    minWidth: 120,
    field: 'sectionsCount',
    headerName: 'Sections',
    renderCell: ({ row }: GridRenderCellParams) => <Typography variant='body2'>{row?.sections?.length ?? 0}</Typography>
  },
  {
    flex: 0.18,
    minWidth: 130,
    field: 'isPublished',
    headerName: 'Published',
    renderCell: ({ row }: GridRenderCellParams) => (
      <CustomChip rounded size='small' skin='light' color={row?.isPublished ? 'success' : 'secondary'} label={row?.isPublished ? 'Yes' : 'No'} />
    )
  },
  {
    flex: 0.18,
    minWidth: 130,
    field: 'isTemplate',
    headerName: 'Template',
    renderCell: ({ row }: GridRenderCellParams) => (
      <CustomChip rounded size='small' skin='light' color={row?.isTemplate ? 'primary' : 'secondary'} label={row?.isTemplate ? 'Yes' : 'No'} />
    )
  },
  {
    flex: 0.16,
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

const PageTable = ({ onEdit, onDelete }: { onEdit: (row: any) => void; onDelete: (row: any) => void }) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.cmsPages)
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    const params: CmsPagesSearchParams = {
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
          placeholder='Search pages...'
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

export default PageTable
