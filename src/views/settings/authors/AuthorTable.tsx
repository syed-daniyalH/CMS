import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Avatar, Box } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { AuthorSearchParams, getData } from 'src/store/settings/authors'
import CustomChip from 'src/@core/components/mui/chip'
import type { AuthorSchema } from './AuthorFormDrawer'

const columns = (toggleForm: (row: AuthorSchema) => void): GridColDef[] => [
  {
    flex: 0.1,
    minWidth: 180,
    field: 'name',
    headerName: 'Name',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.name ?? '-'}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: 'email',
    headerName: 'Email',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.email ?? '-'}</Typography>
  },

  {
    flex: 0.2,
    minWidth: 160,
    field: 'slug',
    headerName: 'Slug',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.slug ?? '-'}</Typography>
  },
  {
    flex: 0.12,
    minWidth: 120,
    field: 'role',
    headerName: 'Role',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.role ?? '-'}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 220,
    field: 'shortDescription',
    headerName: 'Description',
    renderCell: (params: GridRenderCellParams) => <Typography variant='body2'>{params.row?.shortDescription ?? '-'}</Typography>
  },
 {
  flex: 0.2,
  minWidth: 160,
  field: 'avatar',
  headerName: 'Avatar',
  renderCell: (params: GridRenderCellParams) => {
    const imageUrl = params.row?.avatar;

    return imageUrl ? (
      <Avatar
        src={imageUrl}
        alt="avatar"
        sx={{ width: 40, height: 40 }}
      />
    ) : (
      '-'
    );
  }
},
  {
    flex: 0.25,
    minWidth: 240,
    field: 'socialLinks',
    headerName: 'Social Links',
    renderCell: (params: GridRenderCellParams) => {
      const links = params.row?.socialLinks ?? {}
      const values = [links.facebook, links.twitter, links.instagram, links.linkedin].filter(Boolean)
      return <Typography variant='body2'>{values.length ? values.join(' | ') : '-'}</Typography>
    }
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

const AuthorTable = ({ toggleForm }: { toggleForm: (row?: AuthorSchema | null) => void }) => {
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.authors)
  const [searchValue, setSearchValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    const params: AuthorSearchParams = {
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
          placeholder='Search author...'
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
        columns={columns((row: AuthorSchema) => toggleForm(row))}
        columnHeaderHeight={34}
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  )
}

export default AuthorTable
