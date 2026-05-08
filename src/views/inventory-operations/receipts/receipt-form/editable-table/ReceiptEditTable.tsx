// ** React imports
import React, { useEffect, useState } from 'react'


// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  useGridApiRef
} from '@mui/x-data-grid'
import IconButton from "@mui/material/IconButton";

// ** Data Import
import {GridStartRowEditModeParams} from "@mui/x-data-grid/models/api/gridEditingApi";

// ** Custom Imports
import Icon from 'src/core/components/icon'
import CustomTextField from "src/core/components/mui/text-field";

// ** Translation
import {useTranslation} from "react-i18next";
import { CardHeader, Divider } from '@mui/material'
import { cvalue, formatCurrency, getLastEnableColumn } from 'src/core/utils/format'
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CustomEmptyState from "src/components/form-table-add-button";
import InstallmentTypeSelector from 'src/core/dropdown-selectors/InstallmentTypeSelector'
import Button from '@mui/material/Button'

//@ts-ignore
import { ReceiptDataList } from '../../context/types'
import { useReceipt } from '../../context/useReceipt'
import PropertyByCustomerSelector from '../../../../../core/dropdown-selectors/PropertyByCustomerSelector'
import InstallmentByCustomerSelector from '../../../../../core/dropdown-selectors/InstallmentByPropertySelector'
import toast from 'react-hot-toast'

const tableColumns = (apiRef: any, onClickAdd: any, onClickDelete: any, handleReceiptDetailData: any, details: ReceiptDataList[], t: any, customerId: any) => {

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'Action',
      minWidth: 50,
      maxWidth: 50,
      headerName: '',
      sortable: false,
      filterable: false,
      disableColumnMenu: false,
      hideable: false,
      renderHeader: (params) => params.field && (
        <Tooltip title={'Columns Customization'}>
          <IconButton disableFocusRipple onClick={() => apiRef.current.showColumnMenu("Action")}>
            <Icon icon={'tabler:columns'} />
          </IconButton>
        </Tooltip>
      ),
      renderCell: (params: GridRenderCellParams) => {

        if(params.hasFocus) {
          params.api.setCellFocus( params.id, 'instTypeId');
        }

        return (
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            {
              params.row.isEditing ?
                <IconButton onBlur={(_) => params.api.setCellFocus(params.id, 'instTypeId')} onClick={(_) => {
                  onClickAdd(params);
                }}>
                  <Icon icon='tabler:circle-plus-filled' color={'#043612'} fontSize={'1.525rem'}/>
                </IconButton> :
                <IconButton onBlur={(_) => params.api.setCellFocus(params.id, 'instTypeId')}
                            onClick={(_) => onClickDelete(params.row.lineno)}
                            sx={{color: theme => theme.palette.error.main}}>
                  <Icon icon='tabler:trash' fontSize={'1.025rem'}/>
                </IconButton>
            }
          </Box>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 80,
      maxWidth: 280,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      field: 'propertyId',
      headerName: 'Property',
      renderEditCell: (params: GridRenderCellParams) => {
        let row: ReceiptDataList = params.row;
        let detail_row = details.find((element: ReceiptDataList) => element.lineno === row.lineno);

        return params.hasFocus ? (
          <Box style={{width: '100%'}}>
            <PropertyByCustomerSelector customerId={customerId} selected_value={row?.propertyId??null} handleChange={(value) => {
              handleReceiptDetailData({propertyId: value?.value}, detail_row?.lineno);
            }} props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
          </Box>
        ) : (
          <Box style={{width: '100%'}}>
            <PropertyByCustomerSelector customerId={customerId} selected_value={row?.propertyId??null} handleChange={(value) => {
              console.log(`no ${value}`)
            }} preview props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
          </Box>
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        let row: ReceiptDataList = params.row;
        return (
          <PropertyByCustomerSelector customerId={customerId} selected_value={row?.propertyId??null} handleChange={(value) => {
            console.log(`no ${value}`)
          }} preview props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 700,
      maxWidth: 700,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      field: 'instTypeId',
      headerName: 'Installment',
      renderEditCell: (params: GridRenderCellParams) => {
        let row: ReceiptDataList = params.row
        let detail_row = details.find(
          (element: ReceiptDataList) => element.lineno === row.lineno
        )

        return params.hasFocus ? (
          <Box style={{ width: '100%' }}>
            <InstallmentByCustomerSelector
              customerId={customerId}
              propertyId={detail_row?.propertyId ?? null}
              selected_value={row?.installmentId ?? null}
              handleChange={(value:any) => {
                // ✅ Check for duplicate installmentId
                const alreadyExists = details.some(
                  (item: ReceiptDataList) =>
                    item.installmentId === value?.installmentId &&
                    item.lineno !== detail_row?.lineno // allow same row
                )

                if (alreadyExists) {
                  toast.error('This installment has already been added!')
                  return
                }

                // ✅ If not duplicate, proceed
                handleReceiptDetailData(
                  {
                    installmentId: value?.installmentId,
                    agreeId: value?.agreeId,
                    amount: value?.dueAmount ?? 0,
                    instTypeId: value?.instTypeId ?? 0 ,
                  },
                  detail_row?.lineno
                )
              }}
              props={{
                label: null,
                sx: { mb: 0 },
                autoFocus: params.hasFocus,
                focused: params.hasFocus,
              }}
              noBorder
            />
          </Box>
        ) : (
          <Box style={{ width: '100%' }}>
            <InstallmentByCustomerSelector
              customerId={customerId}
              propertyId={detail_row?.propertyId ?? null}
              selected_value={row?.installmentId ?? null}
              handleChange={() => {
                console.log("handleChange fired");
              }}
              preview
              props={{
                label: null,
                sx: { mb: 0 },
                autoFocus: params.hasFocus,
                focused: params.hasFocus,
              }}
              noBorder
            />
          </Box>
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        let row: ReceiptDataList = params.row;
        let detail_row = details.find((element: ReceiptDataList) => element.lineno === row.lineno);

        return (
          <InstallmentByCustomerSelector customerId={customerId} propertyId={detail_row?.propertyId??null} selected_value={row?.installmentId??null} handleChange={(value) => {
            console.log(`no ${value}`)
          }} preview props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 80,
      field: 'instAmount',
      type: 'number',
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Installment Amount',
      align: 'right',
      hideable: false,
      renderEditCell: (params: GridRenderCellParams) => {
        let row: ReceiptDataList = params.row;
        let detail_row = details.find((element: ReceiptDataList) => element.lineno === row.lineno);

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            type='number'
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Amount') as string}
            defaultValue={(detail_row?.amount??0) > 0 ? detail_row?.amount : ""}
            onChange={(e) => handleReceiptDetailData({amount: cvalue(e.target.value)}, row.lineno)}
            noBorder
          />
        ) : <Typography>{(detail_row?.amount??0) > 0 ? detail_row?.amount : ""}</Typography>
      },
      renderCell: (params: GridRenderCellParams) => {
        let row: ReceiptDataList = params.row;
        let detail_row = details.find((element: ReceiptDataList) => element.lineno === row.lineno);
        return (
          <p>{row.amount > 0 ? formatCurrency(detail_row?.amount, null) : ""}</p>
        )
      }
    }
  ];

  return columns;
}


const ReceiptEditTable = () => {

  // ** States
  const {t} = useTranslation();

  const tableRef = useGridApiRef();
  const { receipt, handleReceiptDetailData, removeReceiptDetail, addReceiptDetail } = useReceipt();

  const [details, setDetails] = useState<ReceiptDataList[]>([]);


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      setDetails(receipt?.vMRecepitRefrenceLists??[]);
    }


    return () => {
      isActive = false;
    }
  }, [receipt?.vMRecepitRefrenceLists])

  const handleCellEditStart = (params: GridRowParams) => {
    handleReceiptDetailData({isEditing: true}, parseInt(`${params.id}`));
  };

  const handleCellEditCommit = (params: any, event: any) => {

    const currentRowIndex = details.findIndex((row: any) => row.lineno === params.id);

    if(params.id > -1) {
      handleReceiptDetailData({ isEditing: false }, params.id);
    }

    if (event.key === 'Tab' || event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
      try {
        const nextRow = details[currentRowIndex + 1];
        if (params.field === getLastEnableColumn(tableRef, 'tax') && nextRow) {
          handleReceiptDetailData({isEditing: true}, currentRowIndex + 1);
          tableRef.current.startRowEditMode({id: nextRow.lineno, fieldToFocus: 'instTypeId'} as GridStartRowEditModeParams);
        }
      } catch (e) {
        console.log(e);
      }
    }

    return false;
  };


  const onClickAdd = (params: any) => {
    const currentRowIndex = details.findIndex((row: any) => row.lineno === params.row.lineno);

    if(currentRowIndex >= 0) {
      details[currentRowIndex].isEditing = false;
    }

    addReceiptDetail();

    if(params.id >= 0) {
      tableRef.current.stopRowEditMode({id: params.id});
    }
  }

  const onClickDelete = (id: any) => {
    const index = details.findIndex((obj: ReceiptDataList) => obj.lineno === id);

    if(index > -1) {
      removeReceiptDetail(index);
    }
  }

  const CustomColumnMenuIcon = () => (
    <p/>
  );

  return (
    <Card>
      <CardHeader
        sx={{
          width: '100%',
          display: 'flex',
          p: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(3)} !important`]
        }}
        title={"Agreements Details"}
      />
      <Box>
        <DataGrid
          autoHeight
          apiRef={tableRef}
          hideFooter
          columnHeaderHeight={35}
          getRowHeight={() => 50}
          getRowId={(row: ReceiptDataList) => row.lineno}
          slots={{
            noRowsOverlay: ()  => <CustomEmptyState onClickAdd={onClickAdd} />,
            columnMenuIcon: CustomColumnMenuIcon
          }}
          onCellKeyDown={(_params, event) => {
            if(event.key === 'Enter') {
              event.stopPropagation();
              event.preventDefault();
            }
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              border: theme => `0.05px solid ${theme.palette.secondary.light}`,
              '&:not(.MuiDataGrid-cellCheckbox)': {
                paddingLeft: 2,
                paddingRight: 2,
                '&:first-of-type': {
                  paddingLeft: 0,
                  paddingRight: 0,
                }
              }
            }
          }}
          onCellClick={(params) => {
            if(params.field !== "Action") {
              if(!params.row.isEditing) {
                handleReceiptDetailData({ isEditing: true }, params.row.lineno);
                tableRef?.current?.startRowEditMode({id: params?.id})
              }
            }
          }}
          columns={tableColumns(tableRef, onClickAdd, onClickDelete, handleReceiptDetailData, details, t, receipt?.customerId)}
          rows={details}
          onRowEditStop={handleCellEditCommit}
          onRowEditStart={handleCellEditStart}
          editMode="row"
        />
      </Box>

      <Divider />

      <Box sx={{p: 4, display: 'flex', justifyContent: 'end'}}>
        <Button variant='tonal' color='success' onClick={() => {
          addReceiptDetail();
        }}>
          {t("+Add New Row")}
        </Button>
      </Box>

    </Card>
  )
}

export default ReceiptEditTable
