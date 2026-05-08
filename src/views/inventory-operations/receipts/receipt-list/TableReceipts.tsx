// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {
  DataGrid, GridCellParams,
  GridColDef,
  GridRenderCellParams, useGridApiRef
} from '@mui/x-data-grid'

// ** Utils Import
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useRouter} from "next/router";
import {useRouter as useNavigationRouter} from "next/navigation";
import {FilterListObj} from "src/context/types";
import {getData, ReceiptDataParams} from "src/store/inventory-operations/receipts";
import {decodeParameters, encodeParameters} from "src/@core/utils/encrypted-params";
import DateViewFormat from 'src/@core/components/date-view'
import { formatCurrency } from 'src/@core/utils/format'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from '../../../../@core/components/icon'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import { Card } from '@mui/material'
import Link from 'next/link'
import SingleReceiptDetail from 'src/previews/inventory-operations/receipt/single-receipt-detail/index'

const columns = (handleMouseEnter: any): GridColDef[] => [


  {
    flex: 0.15,
    minWidth: 190,
    field: 'receiptNo',
    headerName: 'Receipt#',
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ fontWeight: 600 }}>
                {row.rno}
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
    field: 'date',
    headerName: 'Date',
    align: 'left',
    headerAlign: 'left',
    renderCell: (params: GridRenderCellParams) => params.row.date && (
      <DateViewFormat date={params.row?.date} />
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'manualReceipt',
    headerName: 'Manual Receipt',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.manualRNo}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'typeNo',
    headerName: 'Type#',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.installmentType}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'propertyNo',
    headerName: 'Property#',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params?.row?.propertyNo}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'receiptAmount',
    headerName: 'Receipt Amount',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatCurrency(params.row?.recepitAmount??0, null)}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'paidAmount',
    headerName: 'Paid Amount',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatCurrency(params.row?.amount??0, null)}
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
          <IconButton onClick={(e) => handleMouseEnter(params, e)}>
            <Icon icon={'tabler:dots-vertical'} />
          </IconButton>



        </Card>
      )
    }
  },
]

const TableReceipts = () => {
  // ** States
  const [searchData, setSearchData] = useState<ReceiptDataParams>({PageNo: 1, PageSize: 10})
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [_filterList, setFilterList] = useState<FilterListObj[]>([])
  const apiRef = useGridApiRef();

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [hoveredRow, setHoveredRow] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<any>(null);
  const [preview, setPreview] = useState<{ open: boolean, data: any,type:any }>({open: false, data: null,type:null})

  const router = useRouter();
  const navRouter = useNavigationRouter();

  const { filters,type ,recepitId} : any = router.query;

  const { t } = useTranslation();

  // ** Stores
  const store = useSelector((state: RootState) => state.receipts)
  const dispatch = useDispatch<AppDispatch>()



  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (recepitId) {
        setPreview({open: true, data: {recno: parseInt(recepitId)},type:type})
      } else {
        setPreview({open: false, data: null,type:null})
      }
    }

    return () => {
      isActive = false;
    }
  }, [recepitId])
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
        navRouter.push(`/inventory-operations/receipts/edit-receipt/${encodeParameters({recno: hoveredRow?.recepitId})}`)
        break;
    }
    setAnchorEl(null);
    setHoveredRow(null);
    setMenuPosition(null);
  };

  const toggleSingleReceiptPreview = (data: any) => {
    setAnchorEl(false)
    if(data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          recepitId: data,
          type: "view-receipt"
        }
      }).then (r => console.log(r));
    } else {
      router.back()
    }
  }

  console.log(preview,"previvpreviewew")
  return (
    <Box sx={{flexGrow: 1}}>
      <DataGrid
        pagination
        disableRowSelectionOnClick
        rows={store.data??[]}
        rowCount={store.totalRecords}
        getRowId={(row: any) => row.refId}
        columnHeaderHeight={30}
        columns={columns(handleMouseEnter)}
        sortingMode='server'
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        apiRef={apiRef}
        onPaginationModelChange={setPaginationModel}
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
        <MenuItem onClick={() => toggleSingleReceiptPreview(hoveredRow?.recepitId)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:eye'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("View Receipt ")}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>


      { preview.open &&preview.type==="view-receipt" &&
      <SingleReceiptDetail open={preview.open} toggle={toggleSingleReceiptPreview} recepitId={preview.data}/>
      }
    </Box>
  )
}

export default TableReceipts
