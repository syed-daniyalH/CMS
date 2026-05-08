// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid'

// ** Custom Components
import EDTableToolbar from './EDTableToolbar'

// ** Types Imports
import {ThemeColor} from 'src/@core/layouts/types'

// ** Utils Import
import CustomChip from "src/@core/components/mui/chip";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import DateViewFormat from "src/@core/components/date-view";
import CustomBackdrop from "src/@core/components/loading";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import {EmployeeDocumentsParams, getEmployeeDocuments} from "../../../../store/dashboard";
import Link from "next/link";
import {useTranslation} from "react-i18next";

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  "Expired": {title: 'Expired', color: 'error'},
  "Expiring": {title: 'Expiring', color: 'warning'},
  "Active": {title: 'Active', color: 'success'},
}

const tableColumns = (t: any): GridColDef[] => {
  return [
    {
      flex: 0.1,
      minWidth: 90,
      field: 'sDate',
      headerName: t('Expiry Date'),
      hideable: false,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const {row} = params

        return row && (
          <DateViewFormat date={row?.expiryDate??(new Date())} />
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: t('Employee Name'),
      field: 'empName',
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{
          color: theme => theme.palette.customColors.linkColor,
          textDecoration: 'underline',
          cursor: 'pointer'
        }}>
          {params?.row?.employeeName??""} {params?.row?.employeeLastName??""}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'docType',
      headerName: t('Document Type'),
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{color: 'text.primary'}}>
          {params?.row?.documentTypeName??""}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      field: 'docNo',
      headerName: t('Document No.'),
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{color: 'text.primary'}}>
          {params?.row?.documentName??""}
        </Typography>
      )
    },
    {
      flex: 0.125,
      field: 'status',
      minWidth: 80,
      headerName: t('Status'),
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return (
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={status?.color ?? "error"}
            label={status?.title ?? "Expired"}
            sx={{'& .MuiChip-label': {textTransform: 'capitalize', fontSize: '0.7rem'}}}
          />
        )
      }
    },
    {
      flex: 0.125,
      field: 'docs',
      minWidth: 80,
      headerName: t('Documents'),
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {

        return (
          <AvatarGroup max={4}>
            {
              (params?.row?.documentURLsList??[]).map((doc: any, index: number) => {
                return (
                  <Avatar component={Link} target={'_blank'} href={(`${process.env.NEXT_PUBLIC_IMAGE_URL}${doc}`).replace(/([^:]\/)\/+/g, "$1")} key={index} src={(`${process.env.NEXT_PUBLIC_IMAGE_URL}${doc}`).replace(/([^:]\/)\/+/g, "$1")} alt={doc} />
                )
              })
            }
          </AvatarGroup>
        )
      }
    }
  ]
}

const TableExpireDocuments = ({}: any) => {

  //store
  const store = useSelector((state: RootState) => state.dashboard)

  // ** States
  const dispatch = useDispatch<AppDispatch>()
  const [searchData, setSearchData] = useState<EmployeeDocumentsParams>({PageNo: 1, PageSize: 10})
  const [searchValue, setSearchValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 10})
  const { t } = useTranslation();


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          dispatch(
            getEmployeeDocuments({
              ...searchData
            })
          )
        }


      return () => {
        isActive = false;
      }
    }, [searchData])


  useEffect(() => {
      let isActive = true;

        if(isActive) {
          setSearchData({
            ...searchData,
            PageNo: paginationModel.page+1,
            PageSize: paginationModel.pageSize,
          })
        }


      return () => {
        isActive = false;
      }
    }, [paginationModel])


  return (
    <Card sx={{mx: 2}}>
      <DataGrid
        autoHeight
        pagination
        disableRowSelectionOnClick
        rows={store.emp_documents}
        getRowId={(row) => row?.documentRecno}
        rowCount={store.emp_documents_total??0}
        columnHeaderHeight={30}
        columns={tableColumns(t)}
        sortingMode='server'
        paginationMode='server'
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        slots={{toolbar: EDTableToolbar}}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'tonal'
          },
          toolbar: {
            value: searchValue,
            searchData: searchData,
            onMenuChange: (option: string) => {
              setSearchData({...searchData, DocumentStatus: option});
            },
            onChange: (e: any) => {
              setSearchValue(e.target.value);
              setSearchData({...searchData, DocumentName: e.target.value});
            },
            clearSearch: () => {
              setSearchData({...searchData, DocumentName: null});
            }
          }
        }}
      />

      <CustomBackdrop open={((store.loadingState.getData ?? false))}/>

    </Card>
  )
}

export default TableExpireDocuments
