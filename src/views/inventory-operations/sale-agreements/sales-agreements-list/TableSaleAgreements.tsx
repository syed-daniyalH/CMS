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

// ** Custom Components
import CustomAvatar from 'src/core/components/mui/avatar'

// ** Types Imports
import { ThemeColor } from 'src/core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/core/utils/get-initials'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useRouter} from "next/router";
import {useRouter as useNavigationRouter} from "next/navigation";
import {FilterListObj} from "src/context/types";
import {PropertyDataParams} from "src/store/inventory-operations/sale-agreements";
import {getData} from "src/store/inventory-operations/sale-agreements";
import {decodeParameters, encodeParameters} from "src/core/utils/encrypted-params";
import CustomerFilterSidebar from "./sidebar/CustomerFilterSidebar";
import DateViewFormat from '../../../../core/components/date-view'
import { formatCurrency } from '../../../../core/utils/format'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Icon from '../../../../core/components/icon'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import InstallmentPlansSidebar from './sidebar/InstallmentPlansSidebar'
import DatePickerWrapper from '../../../../core/styles/libs/react-datepicker'
import WelcomeLetterPreview from '../../../../previews/inventory-operations/sale-agreements/welcome-letter'
import InstallmentPlanPreview from '../../../../previews/inventory-operations/sale-agreements/installment-plan'
import { useAuth } from '../../../../hooks/useAuth'
import SaleAgreementPreview from '../../../../previews/inventory-operations/sale-agreements/sale-agreement'
import Link from 'next/link'
import { Card, Divider } from '@mui/material'
import AllotmentCertificatePreview
  from '../../../../previews/inventory-operations/sale-agreements/allotment-certificate'
import TransferProperty from '../transfer-property'



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
        {getInitials(row.customerName ? row.customerName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const columns = (handleMouseEnter: any): GridColDef[] => [


  {
    flex: 0.35,
    minWidth: 290,
    field: 'customerName',
    headerName: 'Name',
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ fontWeight: 600 }}>
                {row.customerName}
              </Typography>
              <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
                {row.customerIdentityNo}
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
    field: 'propertyNo',
    headerName: 'Property#',
    align: 'left',
    headerAlign: 'left',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.propertyNo}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'floorName',
    headerName: 'Floor',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.floorName}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'saleDate',
    headerName: 'Sale Date',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        <DateViewFormat date={params?.row?.saleDate} />
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'orgPrice',
    headerName: 'Original Amount',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatCurrency(params.row?.orgPrice, null)}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'discountAmount',
    headerName: 'Discount Amount',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatCurrency(params.row?.discountAmount, null)}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 110,
    sortable: false,
    filterable: false,
    field: 'soldPrice',
    headerName: 'Sold Amount',
    align: 'right',
    headerAlign: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatCurrency(params.row?.soldPrice, null)}
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
                      href={`/inventory-operations/sale-agreements/edit-sales-agreement/${encodeParameters({recno: params?.row?.agreeId})}`}>
            <Icon icon={'tabler:edit'} fontSize={'1.2rem'}/>
          </IconButton>
          <Divider orientation={'vertical'} sx={{height: '15px'}}/>

          <Divider orientation={'vertical'} sx={{height: '15px'}}/>
          <IconButton onClick={(e) => handleMouseEnter(params, e)}>
            <Icon icon={'tabler:dots'} fontSize={'1.2rem'}/>
          </IconButton>
        </Card>
      )
    }
  },
]

interface Props {
  toggleFilter: () => void,
  openFilter: boolean
}

const TableSaleAgreements = ({toggleFilter, openFilter}: Props) => {
  // ** States
  const [searchData, setSearchData] = useState<PropertyDataParams>({PageNo: 1, PageSize: 10})
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [_filterList, setFilterList] = useState<FilterListObj[]>([])
  const apiRef = useGridApiRef();

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [hoveredRow, setHoveredRow] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<{open: boolean, data: any }>({open: false, data: null});
  const [menuPosition, setMenuPosition] = useState<any>(null);
  const [preview, setPreview] = useState<{ open: boolean, data: any,type:any }>({open: false, data: null,type:null})

  const router = useRouter();
  const navRouter = useNavigationRouter();

  const { filters ,propertyId,type} : any = router.query;

  const { t } = useTranslation();

  // ** Stores
  const store = useSelector((state: RootState) => state.saleAgreements)
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

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (propertyId) {
        setPreview({open: true, data: {recno: parseInt(propertyId)},type:type})
      } else {
        setPreview({open: false, data: null,type:null})
      }
    }

    return () => {
      isActive = false;
    }
  }, [propertyId])

  const togglePreview = (data: any) => {
    setAnchorEl(false)
    if(data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          propertyId: data,
          type: "welcome-letter"
        }
      }).then (r => console.log(r));
    } else {
      router.back()
    }
  }

  const toggleInstallmentPlan = (data: any) => {
    setAnchorEl(false)
    if(data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          propertyId: data,
          type: "installment-plan"
        }
      }).then (r => console.log(r));
    } else {
      router.back()
    }
  }
  const toggleSaleAgreement = (data: any) => {
    setAnchorEl(false)
    if(data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          propertyId: data,
          type: "sale-agreement"
        }
      }).then (r => console.log(r));
    } else {
      router.back()
    }
  }
  const toggleAllotmentLetter = (data: any) => {
    setAnchorEl(false)
    if(data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          propertyId: data,
          type: "allotment-certificate"
        }
      }).then (r => console.log(r));
    } else {
      router.back()
    }
  }
  const toggleTransferProperty = (data: any) => {
    setAnchorEl(false)
    if(data) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          propertyId: data,
          type: "transfer-property"
        }
      }).then (r => console.log(r));
    } else {
      router.back()
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
        navRouter.push(`/inventory-operations/sale-agreements/edit-sales-agreement/${encodeParameters({recno: hoveredRow?.agreeId})}`)
        break;
      case 2:
        toggleInstallmentPlans(hoveredRow);
        break;
    }
    setAnchorEl(null);
    setHoveredRow(null);
    setMenuPosition(null);
  };

  const toggleInstallmentPlans = (data: any) => {
    setSelectedRow({
      open: data != null,
      data: data
    })
  }



  return (
    <Box sx={{flexGrow: 1}}>
      <DataGrid
        pagination
        disableRowSelectionOnClick
        rows={store.data??[]}
        rowCount={store.totalRecords}
        getRowId={(row: any) => row.agreeId}
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
        <MenuItem onClick={() => handleCloseMenu(2)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:calendar-time'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("Edit Installment Plans")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => togglePreview(hoveredRow?.propertyId)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:snowboarding'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("Welcome Letter")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleInstallmentPlan(hoveredRow?.propertyId)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:eye-check'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("View Installment Plan")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleSaleAgreement(hoveredRow?.propertyId)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:device-projector'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("Sale Agreement")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleAllotmentLetter(hoveredRow?.propertyId)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:printer'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("Allotment Certificate")}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => toggleTransferProperty(hoveredRow?.propertyId)} sx={{p: theme => theme.spacing(2)}}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Icon icon={'tabler:home-down'} fontSize={'1rem'} />
            <Typography variant={'body1'} sx={{ml: 2, mr: 4}}>
              {t("Transfer Property")}
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {
        selectedRow.open &&
        <DatePickerWrapper>
          <InstallmentPlansSidebar open={selectedRow.open} toggle={toggleInstallmentPlans} agreement={selectedRow.data} />
        </DatePickerWrapper>
      }

      {
        preview.open && preview.type==="welcome-letter" &&
        <WelcomeLetterPreview open={preview.open} toggle={togglePreview} propertyId={preview.data}/>
      }
      {
        preview.open &&preview.type==="installment-plan" &&
        <InstallmentPlanPreview open={preview.open} toggle={togglePreview} propertyId={preview.data}/>
      }
      {
        preview.open &&preview.type==="sale-agreement" &&
        <SaleAgreementPreview open={preview.open} toggle={togglePreview} propertyId={preview.data}/>
      }
      {
        preview.open &&preview.type==="allotment-certificate" &&
        <AllotmentCertificatePreview open={preview.open} toggle={togglePreview} propertyId={preview.data}/>
      }
      {
        preview.open &&preview.type==="transfer-property" &&

        <TransferProperty open={preview.open} toggle={togglePreview} hoveredRow={hoveredRow}/>
      }
      {
        openFilter &&
        <CustomerFilterSidebar toggle={toggleFilter} open={openFilter} searchData={searchData} onSearch={doSearch} clearSearch={clearSearch} />
      }

    </Box>
  )
}

export default TableSaleAgreements
