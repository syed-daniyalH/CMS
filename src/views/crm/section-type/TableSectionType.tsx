// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  DataGrid, GridCellParams,
  GridColDef,
  GridRenderCellParams, useGridApiRef
} from '@mui/x-data-grid'

// ** Utils Import
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useRouter } from "next/router";
import { useRouter as useNavigationRouter } from "next/navigation";
import { FilterListObj } from "src/context/types";
import { getData, SectionTypeSearchParams, setLoading } from "src/store/crm/section-type/index";
import { decodeParameters, encodeParameters } from "src/@core/utils/encrypted-params";
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import { Card } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { useSectionType } from './add-section-type/context/useSectionType'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'


const columns = (handleMouseEnter: any): GridColDef[] => [



  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'name',
    headerName: 'Types',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.name}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'slug',
    headerName: 'Slug',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.slug}
      </Typography>
    )
  },

  {
    flex: 0.15,
    minWidth: 120,
    field: 'isActive',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => (
      <CustomChip
        rounded
        size='small'
        skin='light'
        color={params.row?.isActive ? 'success' : 'secondary'}
        label={params.row?.isActive ? 'Active' : 'Inactive'}
      />
    )
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'description',
    headerName: 'Descriptions',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.description || '-'}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 100,
    maxWidth: 100,
    field: 'actions',
    headerName: 'Actions',
    hideable: false,
    sortable: false,
    filterable: false,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params: GridRenderCellParams) => {
      return (

        <Card sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={(e) => handleMouseEnter(params, e)}>
            <Icon icon={'tabler:dots-vertical'} />
          </IconButton>
        </Card>
      )
    }
  },
]

// Defined outside of component so MUI DataGrid slot reference stays stable
const NoRowsOverlay = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <Typography variant='body2' color='text.secondary'>No rows</Typography>
  </Box>
)

const TableSectionType = () => {
  // ** States
  const [searchData, setSearchData] = useState<SectionTypeSearchParams>({ PageNo: 1, PageSize: 10 })
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [_filterList, setFilterList] = useState<FilterListObj[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const apiRef = useGridApiRef();

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [hoveredRow, setHoveredRow] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<any>(null);
  const [preview, setPreview] = useState<{ open: boolean, data: any, type: any }>({ open: false, data: null, type: null })

  const router = useRouter();
  const navRouter = useNavigationRouter();

  const { filters, type, sectionTypeId }: any = router.query;

  const { t } = useTranslation();

  // ** Stores
  const store = useSelector((state: RootState) => state.sectionType)
  const dispatch = useDispatch<AppDispatch>()
  const { deleteSectionType, updateSectionTypeStatus } = useSectionType()


  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (sectionTypeId) {
        setPreview({ open: true, data: { recno: parseInt(sectionTypeId) }, type: type })
      } else {
        setPreview({ open: false, data: null, type: null })
      }
    }

    return () => {
      isActive = false;
    }
  }, [sectionTypeId])

  useEffect(() => {
    let tempFilter: any = [];
    if (searchData) {
      if (searchData?.searchModel?.Email) {
        tempFilter.push({
          name: 'Email',
          title: "Email",
          value: searchData?.searchModel?.Email
        })
      }
      if (searchData?.searchModel?.Name) {
        tempFilter.push({
          name: 'Name',
          title: "Name",
          value: searchData?.searchModel?.Name
        })
      }

      if (searchData?.searchModel?.Type) {
        tempFilter.push({
          name: 'Type',
          title: 'Type',
          value: searchData?.searchModel?.Type
        })
      }
    }
    setFilterList(tempFilter);
  }, [searchData]);


  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (filters) {
        let decodedObj: any = decodeParameters(filters);
        setSearchData({
          ...(decodedObj ?? {}),
          isActive: !decodedObj?.isActive ? null : decodedObj.isActive === 'true',
          VatRegistered: !decodedObj?.VatRegistered ? null : decodedObj.VatRegistered === 'true'
        });
        if (decodedObj?.PageSize) {
          setPaginationModel({
            pageSize: parseInt(`${decodedObj.PageSize ?? 10}`),
            page: (parseInt(`${decodedObj.PageNo ?? 1}`)) - 1
          });
        }

        dispatch(
          getData({
            ...(decodedObj ?? {}),
            isActive: !decodedObj?.isActive ? null : decodedObj.isActive === 'true',
            VatRegistered: !decodedObj?.VatRegistered ? null : decodedObj.VatRegistered === 'true',
            showBalances: true
          })
        );
      } else {
        navRouter.replace(`?filters=${encodeParameters(
          {
            ...searchData,
            PageNo: paginationModel.page + 1,
            PageSize: parseInt(`${paginationModel.pageSize}`)
          }
        )}`)
      }
    }

    return () => {
      isActive = false;
    }
  }, [filters]);


  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (`${paginationModel.page}` !== `${(searchData.PageNo - 1)}` || `${paginationModel.pageSize}` !== `${searchData.PageSize}`) {
        navRouter.replace(`?filters=${encodeParameters(
          {
            ...searchData,
            showBalance: true,
            PageNo: parseInt(`${paginationModel.page + 1}`),
            PageSize: parseInt(`${paginationModel.pageSize ?? 10}`)
          }
        )}`)
      }
    }


    return () => {
      isActive = false;
    }
  }, [paginationModel])


  const handleMouseEnter = (params: GridCellParams, event: any) => {
    event.preventDefault();
    const mouseX = event.clientX;
    const mouseY = event.clientY + 20;
    setMenuPosition({
      top: mouseY,
      left: mouseX,
    });
    setHoveredRow(params.row);
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
    setHoveredRow(null);
    setMenuPosition(null);
  };

  const handleCloseMenu = async (option: number) => {
    switch (option) {
      case 1:
        navRouter.push(`/crm/section-type/edit-section-type/${hoveredRow?._id}`)
        break;
      case 2:
        if (window.confirm('Are you sure you want to delete this section type?')) {
          dispatch(setLoading({ getData: true }))
          await deleteSectionType(hoveredRow?._id)
          dispatch(getData({
            PageNo: paginationModel.page + 1,
            PageSize: paginationModel.pageSize,
            searchModel: { Name: searchValue.trim() }
          }))
        }
        break;
      case 3:
        dispatch(setLoading({ getData: true }))
        await updateSectionTypeStatus(hoveredRow?._id, !hoveredRow?.isActive)
        dispatch(getData({
          PageNo: paginationModel.page + 1,
          PageSize: paginationModel.pageSize,
          searchModel: { Name: searchValue.trim() }
        }))
        break;
    }
    setAnchorEl(null);
    setHoveredRow(null);
    setMenuPosition(null);
  };

  const toggleSingleSectionTypePreview = (data: any) => {
    setAnchorEl(false)
    if (data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          sectionTypeId: data,
          type: "view-section-type"
        }
      }).then(r => console.log(r));
    } else {
      router.back()
    }
  }

  // ** Dispatch getData whenever search value or pagination changes
  useEffect(() => {
    dispatch(
      getData({
        PageNo: paginationModel.page + 1,
        PageSize: paginationModel.pageSize,
        searchModel: { Name: searchValue.trim() }
      })
    )
  }, [dispatch, paginationModel, searchValue])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'end' }}>
        <CustomTextField
          value={searchValue}
          onChange={e => setSearchValue(e.target.value ?? '')}
          placeholder={t('Search section type...') as string}
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: searchValue ? (
              <IconButton size='small' onClick={() => setSearchValue('')}>
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            ) : null
          }}
        />
      </Box>

      <DataGrid
        autoHeight
        pagination
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        disableRowSelectionOnClick
        rows={store.data ?? []}
        rowCount={store?.totalRecords || (store?.data?.length ?? 0)}
        getRowId={(row: any) => row._id}
        columnHeaderHeight={30}
        columns={columns(handleMouseEnter)}
        sortingMode='server'
        apiRef={apiRef}
        slots={{ noRowsOverlay: NoRowsOverlay }}
        sx={{
          '& .MuiDataGrid-row:hover .hover-actions': {
            display: 'flex',
          },
        }}
      />


      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        anchorReference="anchorPosition"
        onClose={handleClose}
        anchorPosition={
          menuPosition ? { top: menuPosition?.top, left: menuPosition?.left } : undefined
        }
        sx={{ p: 0 }}
      >
        <MenuItem onClick={() => handleCloseMenu(1)} sx={{ p: theme => theme.spacing(2) }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={'tabler:edit'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ ml: 2, mr: 4 }}>
              {t("Edit")}
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem onClick={() => handleCloseMenu(3)} sx={{ p: theme => theme.spacing(2) }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={hoveredRow?.isActive ? 'tabler:toggle-right' : 'tabler:toggle-left'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ ml: 2, mr: 4 }}>
              {hoveredRow?.isActive ? t("Deactivate") : t("Activate")}
            </Typography>
          </Box>
        </MenuItem>

        <MenuItem onClick={() => handleCloseMenu(2)} sx={{ p: theme => theme.spacing(2), color: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={'tabler:trash'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ ml: 2, mr: 4 }}>
              {t("Delete")}
            </Typography>
          </Box>
        </MenuItem>

      </Menu>



    </Box>
  )
}

export default TableSectionType
