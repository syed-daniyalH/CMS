// ** React Imports
import {useEffect, useState, ChangeEvent} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  DataGrid, GridCellParams,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel, useGridApiRef
} from '@mui/x-data-grid'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import AgentsTableActions from "./AgentsTableActions";

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useRouter} from "next/router";
import {useRouter as useNavigationRouter} from "next/navigation";
import {FilterListObj} from "src/context/types";
import {AgentDataParams} from "src/store/inventory-operations/agents";
import {getData} from "src/store/inventory-operations/agents";
import {decodeParameters, encodeParameters} from "src/@core/utils/encrypted-params";
import CustomChip from "src/@core/components/mui/chip";
import AgentFilterSidebar from "./sidebar/AgentFilterSidebar";
import ConfirmationDialog from "src/custom-components/confirmation-dialog";
import toast from "react-hot-toast";
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "src/@core/components/icon";
import {useTranslation} from "react-i18next";
import { Card } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'


// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if ((row.agentImageUrl??"").length) {
    return <CustomAvatar src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${row.agentImageUrl}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.firstName ? row.firstName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const columns = (): GridColDef[] => ([
  {
    flex: 0.25,
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
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{fontWeight: 600 }}>
                {row.firstName} {row.secondName??""}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
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
    field: 'type',
    headerName: 'Type',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.type}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'gender',
    headerName: 'Gender',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.gender}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'identityNo',
    headerName: 'Identity#',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.identityNo}
      </Typography>
    )
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
          color={params.row?.isActive ? "success" :"error"}
          label={params.row?.isActive ? "Active" : "In-Active"}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      )
    }
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
                      href={`/inventory-operations/agents/edit-agents/${encodeParameters({recno: params?.row?.agentId})}`}>
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

const TableAgents = ({toggleFilter, openFilter}: Props) => {
  // ** States
  const [searchData, setSearchData] = useState<AgentDataParams>({PageNo: 1, PageSize: 10})
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
  const store = useSelector((state: RootState) => state.agents)
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
        response = await axios.put('/Agents/BulkActiveAgent', {data: showStatus.ids});
      } else {
        response = await axios.put('/Agents/BulkInactiveAgent', {data: showStatus.ids});
      }

      let res = response?.data;

      if(res?.succeeded) {
        toast.success("Agent Status Changed Successfully.");
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

  const handleClose = () => {
    setAnchorEl(null);
    setHoveredRow(null);
    setMenuPosition(null);
  };

  const handleCloseMenu = (option: number) => {
    switch (option) {
      case 1:
        navRouter.push(`/inventory-operations/agents/edit-agent/${encodeParameters({recno: hoveredRow?.recno})}`)
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
        getRowId={(row: any) => row.agentId}
        columnHeaderHeight={30}
        columns={columns()}
        sortingMode='server'
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        apiRef={apiRef}
        slots={{ toolbar: selectedRows.length > 0 ? AgentsTableActions : null }}
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
              if(option === "Active Agents") {
                data.isActive = true;
              } else if(option === "In-Active Agents") {
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
        <AgentFilterSidebar toggle={toggleFilter} open={openFilter} searchData={searchData} onSearch={doSearch} clearSearch={clearSearch} />
      }

      {
        showStatus.open &&
        <ConfirmationDialog loading={loading} positiveText={(showStatus.type === 1) ? "In-Activate" : "Activate"} onSuccess={onSubmitStatus} title={`${(showStatus.type === 1) ? "In-Activate" : "Activate"} Agent(s)`} open={showStatus.open}
                            toggle={toggleChangeStatus} sub_description={`Do you confirmed you want to ${(showStatus.type === 1) ? "in-activate" : "activate"} selected agents? You can make these agent ${(showStatus.type === 1) ? "active" : "in-active"} any time.`} description={(showStatus.type === 1) ? `By making agent(s) in-active you won't able to add new transactions like invoice, bills, expenses etc. against selected agents.` : `By making agent(s) activate you will able to add transactions like invoice, bills, expenses etc. against selected agent(s).`} />
      }

    </Box>
  )
}

export default TableAgents
