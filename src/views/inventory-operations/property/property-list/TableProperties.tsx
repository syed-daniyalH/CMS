// ** React Imports
import {useEffect, useState, ChangeEvent} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import {
  DataGrid, GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel, useGridApiRef
} from '@mui/x-data-grid'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import PropertiesTableToolbar from './PropertiesTableToolbar'
import PropertiesTableActions from "./PropertiesTableActions";

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useRouter} from "next/router";
import {useRouter as useNavigationRouter} from "next/navigation";
import {FilterListObj} from "src/context/types";
import {PropertyDataParams} from "src/store/inventory-operations/property";
import {getData} from "src/store/inventory-operations/property";
import {decodeParameters, encodeParameters} from "src/@core/utils/encrypted-params";
import CustomChip from "src/@core/components/mui/chip";
import CustomerFilterSidebar from "./sidebar/CustomerFilterSidebar";
import ConfirmationDialog from "src/custom-components/confirmation-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "src/@core/components/icon";
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";
import { formatCurrency } from '../../../../@core/utils/format'
import Link from 'next/link'


// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if ((row.imageUrl??"").length) {
    return <CustomAvatar src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.imageUrl}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.floorName ? row.floorName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const columns = (handleMouseEnter: any): GridColDef[] => ([
  {
    flex: 0.25,
    minWidth: 290,
    field: 'name',
    headerName: 'Property',
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{fontWeight: 600 }}>
                {row.propertyNo}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.floorName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'none'
          }} className="hover-actions">
            <IconButton onClick={(e) => handleMouseEnter(params, e)}>
              <Icon icon={'tabler:category-2'} />
            </IconButton>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'typeName',
    headerName: 'Type',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.typeName}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'regNo',
    headerName: 'Registration#',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.regNo}
      </Typography>
    )
  },
  {
    flex: 0.175,
    sortable: false,
    filterable: false,
    minWidth: 120,
    headerName: 'Current Status',
    field: 'currentStatus',
    renderCell: (params: GridRenderCellParams) => {
      return (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params.row?.currentStatus === "UnSold" ? "info" : "primary"}
          label={params.row?.currentStatus??"UnSold"}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
  },
  {
    flex: 0.175,
    sortable: false,
    filterable: false,
    minWidth: 120,
    headerName: 'Status',
    field: 'status',
    renderCell: (params: GridRenderCellParams) => {
      return (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params.row?.status === "Active" ? "success" :"error"}
          label={params.row?.status??"Active"}
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
    field: 'saleablePrice',
    headerName: 'Sale Price',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatCurrency(params.row.saleablePrice, null)}
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
                      href={`/inventory-operations/property/edit-property/${encodeParameters({recno: params?.row?.propertyId})}`}>
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

const TableProperties = ({toggleFilter, openFilter}: Props) => {
  // ** States
  const [searchData, setSearchData] = useState<PropertyDataParams>({PageNo: 1, PageSize: 10})
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [showStatus, setShowStatus] = useState<{type: number, open: boolean, ids: number[]}>({ type: -1, open: false, ids: [] })
  const [loading, setLoading] = useState<boolean>(false)
  const [_filterList, setFilterList] = useState<FilterListObj[]>([])
  const apiRef = useGridApiRef();

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [hoveredRow, setHoveredRow] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<any>(null);

  const router = useRouter();
  const navRouter = useNavigationRouter();
  const { t } = useTranslation();

  const { filters } : any = router.query;

  // ** Stores
  const store = useSelector((state: RootState) => state.property)
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


  const markActive = (ids: number[]) => {
    setShowStatus({type: 0, open: true, ids: ids})
  }

  const markInActive = (ids: number[]) => {
    setShowStatus({type: 1, open: true, ids: ids})
  }

  const onSubmitStatus = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response: any;
      if(showStatus.type === 0) {
        response = await axios.put('/Customers/BulkActiveCustomer', {data: showStatus.ids});
      } else {
        response = await axios.put('/Customers/BulkInactiveCustomer', {data: showStatus.ids});
      }

      let res = response?.data;

      if(res?.succeeded) {
        toast.success("Customer Status Changed Successfully.");
        dispatch(getData({
          ...searchData,
          PageNo: paginationModel.page + 1,
          PageSize: parseInt(`${paginationModel.pageSize}`)
        }));
        setShowStatus({type: -1, open: false, ids: []});
      } else {
        let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
        toast.error(`Error while changing status!. ${message}`)
      }
    } catch (res: any) {
      let message : any = res.response?.message || res.response?.data?.message || res.data?.message || res.message || res.data;
      toast.error(`Error while changing status!. ${message}`)
    } finally {
      setLoading(false);
    }
  }

  const toggleChangeStatus = () => {
    setShowStatus({type: -1, open: false, ids: []})
  }


  const handleMouseEnter = (params: GridCellParams, event: any) => {
    event.preventDefault();
    const mouseX = event.clientX;
    const mouseY = event.clientY+20;
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

  const handleCloseMenu = (option: number) => {
    switch (option) {
      case 1:
        navRouter.push(`/financial-operations/sales/customers/edit-customer/${encodeParameters({recno: hoveredRow?.recno})}`)
        break;
      case 2:
          hoveredRow?.isActive ? markInActive([hoveredRow?.recno??0]) : markActive([hoveredRow?.recno??0]);
        break;
    }
    setAnchorEl(null);
    setHoveredRow(null);
    setMenuPosition(null);
  };

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
        getRowId={(row: any) => row.propertyId}
        columnHeaderHeight={30}
        columns={columns(handleMouseEnter)}
        sortingMode='server'
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        apiRef={apiRef}
        slots={{ toolbar: selectedRows.length > 0 ? PropertiesTableActions : null }}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'tonal'
          },
          toolbar: {
            selectionModel: selectedRows,
            searchData: searchData,
            markInActive: markInActive,
            markActive: markActive,
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
        onCellClick={(params, event) => {
          if(params.field !== 'name' && params.field !== '__check__') {
            handleMouseEnter(params, event);
          }
        }}
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
        sx={{p: 0}}
      >
        <MenuItem onClick={() => handleCloseMenu(1)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:edit'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("Edit")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleCloseMenu(2)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={hoveredRow?.isActive ? 'tabler:deselect' : 'tabler:select-all'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {hoveredRow?.isActive ? t("Deactivate") :t("Activate")}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {
        openFilter &&
        <CustomerFilterSidebar toggle={toggleFilter} open={openFilter} searchData={searchData} onSearch={doSearch} clearSearch={clearSearch} />
      }

      {
        showStatus.open &&
        <ConfirmationDialog loading={loading} positiveText={(showStatus.type === 1) ? "In-Activate" : "Activate"} onSuccess={onSubmitStatus} title={`${(showStatus.type === 1) ? "In-Activate" : "Activate"} Customer(s)`} open={showStatus.open}
                            toggle={toggleChangeStatus} sub_description={`Do you confirmed you want to ${(showStatus.type === 1) ? "in-activate" : "activate"} selected customers? You can make these customer ${(showStatus.type === 1) ? "active" : "in-active"} any time.`} description={(showStatus.type === 1) ? `By making customer(s) in-active you won't able to add new transactions like invoice, bills, expenses etc. against selected customers.` : `By making customer(s) activate you will able to add transactions like invoice, bills, expenses etc. against selected customer(s).`} />
      }

    </Box>
  )
}

export default TableProperties
