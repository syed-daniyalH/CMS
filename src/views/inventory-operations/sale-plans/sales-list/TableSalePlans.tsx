// ** React Imports
import {useEffect, useState, ChangeEvent} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel, useGridApiRef
} from '@mui/x-data-grid'

// ** Custom Components
import CustomAvatar from 'src/core/components/mui/avatar'
import SalePlansTableActions from "./SalePlansTableActions";

// ** Types Imports
import { ThemeColor } from 'src/core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/core/utils/get-initials'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useRouter} from "next/router";
import {useRouter as useNavigationRouter} from "next/navigation";
import {FilterListObj} from "src/context/types";
import {PropertyDataParams} from "src/store/inventory-operations/sale-plans";
import {getData} from "src/store/inventory-operations/sale-plans";
import {decodeParameters, encodeParameters} from "src/core/utils/encrypted-params";
import CustomChip from "src/core/components/mui/chip";
import CustomerFilterSidebar from "./sidebar/CustomerFilterSidebar";
import { Card, Divider } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import Icon from '../../../../core/components/icon'


const columns = (): GridColDef[] => ([
  {
    flex: 0.35,
    minWidth: 290,
    field: 'name',
    headerName: 'Name',
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{fontWeight: 600 }}>
                {row.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.175,
    sortable: false,
    filterable: false,
    minWidth: 120,
    headerName: 'Default',
    field: 'isDefault',
    renderCell: (params: GridRenderCellParams) => {
      return (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params.row?.isDefault ? "success" :"primary"}
          label={params.row?.isDefault ? "Yes" : "No"}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'areaSqft',
    headerName: 'Area Square Ft',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.areaSqft}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'areaMarla',
    headerName: 'Area Per Marla',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.areaMarla}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'defSalePrice',
    headerName: 'Sale Price',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.defSalePrice}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 125,
    maxWidth: 125,
    field: 'actions',
    headerName: 'Actions',
    hideable: false,
    sortable: false,
    filterable: false,
    headerAlign: 'right',
    align: 'right',
    renderCell: (params: GridRenderCellParams) => {
      return (

        <Card sx={{display: 'flex', alignItems: 'center'}}>
          <IconButton component={Link}
                      href={`/inventory-operations/sale-plans/edit-sales/${encodeParameters({recno: params?.row?.planId})}`}>
            <Icon icon={'tabler:edit'} fontSize={'1.2rem'}/>
          </IconButton>



        </Card>
      )
    }
  },
])

interface Props {
  toggleFilter: () => void,
  openFilter: boolean
}

const TableSalePlans = ({toggleFilter, openFilter}: Props) => {
  // ** States
  const [searchData, setSearchData] = useState<PropertyDataParams>({PageNo: 1, PageSize: 10})
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [_filterList, setFilterList] = useState<FilterListObj[]>([])
  const apiRef = useGridApiRef();

  const router = useRouter();
  const navRouter = useNavigationRouter();

  const { filters } : any = router.query;

  // ** Stores
  const store = useSelector((state: RootState) => state.salePlans)
  const dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    let tempFilter: any = [];
    if (searchData) {
      if(searchData?.searchModel?.Email) {
        tempFilter.push({
          name: 'Email',
          title: "Email",
          value: searchData?.searchModel?.Email
        })
      }
      if(searchData?.searchModel?.Name) {
        tempFilter.push({
          name: 'Name',
          title: "Name",
          value: searchData?.searchModel?.Name
        })
      }

      if(searchData?.searchModel?.Type) {
        tempFilter.push({
          name: 'Type',
          title: 'Type',
          value: searchData?.searchModel?.Type
        })
      }
    }
    setFilterList(tempFilter);
  }, [searchData]);

  const handleSearch = (value: string) => {
    if(!(store.loadingState?.getData)) {
      navRouter.replace(`?filters=${encodeParameters(
        {
          ...searchData,
          Name: value,
          showBalances: true,
          PageNo: parseInt(`${1}`),
          PageSize: parseInt(`${paginationModel.pageSize ?? 10}`)
        }
      )}`)
    }
  }

  const clearSearch = () => {
    setSearchData({PageSize: 10, PageNo: 1});
    navRouter.replace(`?filters=${encodeParameters(
      {
        showBalances: true,
        PageNo: parseInt(`${1}`),
        PageSize: parseInt(`${paginationModel.pageSize ?? 10}`)
      }
    )}`)
  }


  useEffect(() => {
    let isActive = true;

    if(isActive) {
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

    if(isActive) {
      if(`${paginationModel.page}` !== `${(searchData.PageNo-1)}` || `${paginationModel.pageSize}` !== `${searchData.PageSize}`) {
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

  const doSearch = (data: any) => {
    setSearchData({...searchData, ...data})

    navRouter.replace(`?filters=${encodeParameters(
      {
        ...searchData,
        ...data,
        PageNo: 1,
        PageSize: paginationModel.pageSize+1,
      }
    )}`)

  }

  const handleCancelSelection = () => {
    apiRef.current.setRowSelectionModel([]);
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <DataGrid
        pagination

        onRowSelectionModelChange={(row_selection: GridRowSelectionModel) => {
          setSelectedRows(row_selection);
        }}
        disableRowSelectionOnClick
        rows={store.data??[]}
        rowCount={store.totalRecords}
        getRowId={(row: any) => row.planId}
        columnHeaderHeight={30}
        columns={columns()}
        sortingMode='server'
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        apiRef={apiRef}
        slots={{ toolbar: selectedRows.length > 0 ? SalePlansTableActions : null }}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'tonal'
          },
          toolbar: {
            selectionModel: selectedRows,
            searchData: searchData,
            onMenuChange: (option: string) => {
              let data: any = {};
              if(option === "Active Customers") {
                data.isActive = true;
              } else if(option === "In-Active Customers") {
                data.isActive = false;
              } else {
                data.isActive = null;
              }
              doSearch(data)
            },
            clearSearch: () => handleSearch(''),
            onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
            onCancel: () => handleCancelSelection()
          }
        }}
        sx={{
          '& .MuiDataGrid-row:hover .hover-actions': {
            display: 'flex',
          },
        }}
      />

      {
        openFilter &&
        <CustomerFilterSidebar toggle={toggleFilter} open={openFilter} searchData={searchData} onSearch={doSearch} clearSearch={clearSearch} />
      }

    </Box>
  )
}

export default TableSalePlans
