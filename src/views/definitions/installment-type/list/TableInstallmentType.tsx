// ** React Imports
import React, {useEffect, useState} from 'react'

// ** MUI Imports
import Typography from '@mui/material/Typography'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams
} from '@mui/x-data-grid'

// ** Custom Components

// ** Utils Import
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useRouter} from "next/router";
import {useRouter as useNavigationRouter} from "next/navigation";
import {getData, InstallmentTypeSearchSchema} from "src/store/definitions/installment-type";
import {decodeParameters, encodeParameters} from "src/@core/utils/encrypted-params";
import {useTranslation} from "react-i18next";
import InstallmentTypeTableToolbar from "./InstallmentTypeTableToolbar";
import IconButton from "@mui/material/IconButton";
import Icon from 'src/@core/components/icon';
import CustomChip from '../../../../@core/components/mui/chip'
import { Box } from '@mui/material'


const columns= (toggleEdit: any, t: any) :GridColDef[] =>{
  return [
    {
      flex: 0.1,
      minWidth: 90,
      field: 'description',
      headerName: t('Name'),
      renderCell: (params: GridRenderCellParams) => {
        const {row} = params

        return row && (
          <Typography noWrap variant='body2' sx={{color: 'text.primary', fontWeight: 600}}>
            {row.description??""}
          </Typography>
        )
      }
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: t('Descriptions'),
      field: 'remarks',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => params.row && (
        <Typography variant='body2'>
          {params.row.remarks}
        </Typography>
      )
    },
    {
      flex: 0.175,
      minWidth: 120,
      headerName: t('Status'),
      field: 'Active',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => params.row && (
        <CustomChip
          rounded
          size='small'
          skin='light'
          color={params.row?.isActive ? 'success' : "secondary"}
          label={params.row?.isActive ? "Active" : "In-Active"}
          sx={{'& .MuiChip-label': {textTransform: 'capitalize', fontSize: '0.7rem'}}}
        />
      )
    },
    {
      flex: 0.125,
      field: 'action',
      minWidth: 80,
      maxWidth: 80,
      headerName: 'Actions',
      headerAlign: 'right',
      disableColumnMenu: true,
      sortable: false,
      align: 'right',
      renderCell: (params: GridRenderCellParams) => {
        return params.row && (
          <IconButton onClick={() => toggleEdit(params.row)}>
            <Icon icon={'tabler:edit'}/>
          </IconButton>
        )
      }
    }
  ]
}
const TableInstallmentType = ({toggleForm}: any) => {


  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.instTypes)
  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 50})
  const { t } = useTranslation();

  // ** States
  const [searchData, setSearchData] = useState<InstallmentTypeSearchSchema>({PageNo: 1, PageSize: 50})
  const [searchValue, setSearchValue] = useState<string>('')

  const router = useRouter();
  const navRouter = useNavigationRouter();

  const {filters}: any = router.query;

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if (filters) {
        let decodedObj: any = decodeParameters(filters);
        setSearchData({...(decodedObj ?? {})});

        if(decodedObj.Name) {
          setSearchValue(decodedObj.Name);
        } else {
          setSearchValue("");
        }

        dispatch(
          getData({
            ...(decodedObj ?? {})
          })
        );
      } else {
        navRouter.replace(`?filters=${encodeParameters(
          {
            ...searchData,
            loaded: true
          }
        )}`)
      }
    }

    return () => {
      isActive = false;
    }
  }, [filters]);

  const toggleEdit = (row: any) => {
    toggleForm(row)
  }

  const handleSearch = (value: string) => {
    navRouter.replace(`?filters=${encodeParameters(
      {
        Name: value
      }
    )}`)
  }

  const handleCancelSelection = () => {
    navRouter.replace(`?filters=${encodeParameters(
      {
        Name: ''
      }
    )}`)
  }

  return (
    <Box sx={{flexGrow: 1}}>

      <DataGrid
        pagination
        disableRowSelectionOnClick
        rows={store?.data??[]}
        getRowId={(row) => row.instTypeId}
        rowCount={store.totalRecords ?? 0}
        columnHeaderHeight={30}
        columns={columns(toggleEdit, t)}
        sortingMode='client'
        paginationMode='client'
        pageSizeOptions={[50, 75, 100]}
        paginationModel={paginationModel}
        slots={{toolbar: InstallmentTypeTableToolbar}}
        onPaginationModelChange={setPaginationModel}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'tonal'
          },
          toolbar: {
            value: searchValue,
            searchData: searchData,
            clearSearch: () => handleSearch(''),
            onChange: (event: any) => handleSearch(event.target.value),
            onCancel: () => handleCancelSelection(),
          }
        }}
      />
    </Box>
  )
}

export default TableInstallmentType
