// ** React imports
import React from "react";


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
import Icon from 'src/@core/components/icon'
import CustomTextField from "src/@core/components/mui/text-field";

// ** Translation
import {useTranslation} from "react-i18next";
import { CardHeader, Divider } from '@mui/material'
import { cvalue, formatCurrency, getLastEnableColumn, globalSendDateFormat } from 'src/@core/utils/format'
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import CustomEmptyState from "src/custom-components/form-table-add-button";
import { InstallmentPlansDataType } from '../InstallmentPlansSidebar'
import DateViewFormat from '../../../../../../@core/components/date-view'
import InstallmentTypeSelector from '../../../../../../@core/dropdown-selectors/InstallmentTypeSelector'
import Button from '@mui/material/Button'
import CustomDatePicker from '../../../../../../@core/components/custom-date-picker'

//@ts-ignore
import dateFormat from 'dateformat';

interface Props {
  handleInstallmentDetailData: (data: any, index: number) => void,
  removeInstallmentDetail: (index: number) => void,
  addInstallmentDetail: () => void,
  details: InstallmentPlansDataType[]
}

const tableColumns = (apiRef: any, onClickAdd: any, onClickDelete: any, handleInstallmentDetailData: any, details: InstallmentPlansDataType[], t: any) => {

  const columns: GridColDef[] = [

    {
      flex: 0.05,
      minWidth: 100,
      maxWidth: 130,
      type: 'number',
      editable: false,
      sortable: false,
      disableColumnMenu: true,
      field: 'instNo',
      headerName: 'Installment#',
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        return (
          <p>{row.instNo??0}</p>
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
      field: 'instTypeId',
      headerName: 'Type',
      renderEditCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        let detail_row = details.find((element: InstallmentPlansDataType) => element.instNo === row.instNo);

        return params.hasFocus ? (
          <Box style={{width: '100%'}}>
            <InstallmentTypeSelector selected_value={row?.instTypeId} handleChange={(value:any) => {
              handleInstallmentDetailData({instTypeId: value?.value}, detail_row?.instNo);
            }} props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
          </Box>
        ) : (
          <Box style={{width: '100%'}}>
            <InstallmentTypeSelector selected_value={row?.instTypeId} handleChange={(value:any) => {
              console.log(`no ${value}`)
            }} preview props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
          </Box>
        )
      },
      renderCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        return (
          <InstallmentTypeSelector selected_value={row?.instTypeId} handleChange={(value:any) => {
            console.log(`no ${value}`)
          }} preview props={{label: null, sx: { mb: 0 }, autoFocus: params.hasFocus, focused: params.hasFocus}} noBorder />
        )
      }
    },
    {
      flex: 0.05,
      minWidth: 80,
      maxWidth: 140,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      field: 'dueDate',
      headerName: 'Due Date',
      renderEditCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        let detail_row = details.find((element: InstallmentPlansDataType) => element.instNo === row.instNo);

        return params.hasFocus ? (
          <CustomDatePicker date={detail_row?.dueDate} onChange={(date: Date) => {
            handleInstallmentDetailData({dueDate: dateFormat(new Date(date), globalSendDateFormat)}, row.instNo)
          }} label={null} noBorder />
        ) : <DateViewFormat date={detail_row?.dueDate??""} />
      },
      renderCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        return (
          <DateViewFormat date={row?.dueDate??""} />
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
        let row: InstallmentPlansDataType = params.row;
        let detail_row = details.find((element: InstallmentPlansDataType) => element.instNo === row.instNo);

        return params.hasFocus ? (
          <CustomTextField
            fullWidth
            type='number'
            variant='outlined'
            focused={params.hasFocus}
            autoFocus={params.hasFocus}
            placeholder={t('Qty') as string}
            defaultValue={(detail_row?.instAmount??0) > 0 ? detail_row?.instAmount : ""}
            onChange={(e) => handleInstallmentDetailData({instAmount: cvalue(e.target.value)}, row.instNo)}
            noBorder
          />
        ) : <Typography>{(detail_row?.instAmount??0) > 0 ? detail_row?.instAmount : ""}</Typography>
      },
      renderCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        let detail_row = details.find((element: InstallmentPlansDataType) => element.instNo === row.instNo);
        return (
          <p>{row.instAmount > 0 ? formatCurrency(detail_row?.instAmount, null) : ""}</p>
        )
      }
    },
    {
      flex: 0.07,
      minWidth: 80,
      field: 'recAmount',
      type: 'number',
      editable: false,
      sortable: false,
      disableColumnMenu: true,
      headerName: 'Paid Amount',
      align: 'right',
      hideable: false,
      renderCell: (params: GridRenderCellParams) => {
        let row: InstallmentPlansDataType = params.row;
        return (
          <p>{row.recAmount > 0 ? formatCurrency(row.recAmount, null) : "0.00"}</p>
        )
      }
    },
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
            {!(params.row?.recAmount > 0)  &&(<IconButton onBlur={(_) => params.api.setCellFocus(params.id, 'instNo')}
                         onClick={(_) => onClickDelete(params.row.instNo)}
                         sx={{ color: theme => theme.palette.error.main }}>
              <Icon icon="tabler:trash" fontSize={'1.025rem'} />
            </IconButton>)}
          </Box>
        )
      }
    },
  ];

  return columns;
}


const InstallmentPlansEditTable = ({handleInstallmentDetailData, details, addInstallmentDetail, removeInstallmentDetail} : Props) => {

  // ** States
  const {t} = useTranslation();

  const tableRef = useGridApiRef();

  const handleCellEditStart = (params: GridRowParams) => {
    handleInstallmentDetailData({isEditing: true}, parseInt(`${params.id}`));
  };

  const handleCellEditCommit = (params: any, event: any) => {

    const currentRowIndex = details.findIndex((row: any) => row.instNo === params.id);

    if(params.id > -1) {
      handleInstallmentDetailData({ isEditing: false }, params.id);
    }

    if (event.key === 'Tab' || event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
      try {
        const nextRow = details[currentRowIndex + 1];
        if (params.field === getLastEnableColumn(tableRef, 'tax') && nextRow) {
          handleInstallmentDetailData({isEditing: true}, currentRowIndex + 1);
          tableRef.current.startRowEditMode({id: nextRow.instNo, fieldToFocus: 'instTypeId'} as GridStartRowEditModeParams);
        }
      } catch (e) {
        console.log(e);
      }
    }

    return false;
  };


  const onClickAdd = (params: any) => {
    const currentRowIndex = details.findIndex((row: any) => row.instNo === params.row.instNo);

    if(currentRowIndex >= 0) {
      details[currentRowIndex].isEditing = false;
    }

    addInstallmentDetail();

    if(params.id >= 0) {
      tableRef.current.stopRowEditMode({id: params.id});
    }
  }

  const onClickDelete = (id: any) => {
    removeInstallmentDetail(id);
  };

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
        title={"Products Details"}
      />
      <Box>
        <DataGrid
          autoHeight
          apiRef={tableRef}
          hideFooter
          columnHeaderHeight={35}
          getRowHeight={() => 50}
          getRowId={(row: InstallmentPlansDataType) => row.instNo}
          isCellEditable={(params) => (params.row?.recAmount??0) <= 0}
          getRowClassName={(params) =>
            (params.row?.recAmount ?? 0) > 0 ? 'non-editable-row' : ''
          }
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
            },
            '& .non-editable-row': {
              backgroundColor: theme => theme.palette.action.disabledBackground,
              color: theme => theme.palette.text.primary,
            },
          }}
          onCellClick={(params) => {
            if(params.field !== "Action") {
              if(!params.row.isEditing) {
                handleInstallmentDetailData({ isEditing: true }, params.row.instNo);
                tableRef.current.startRowEditMode({id: params.id})
              }
            }
          }}
          columns={tableColumns(tableRef, onClickAdd, onClickDelete, handleInstallmentDetailData, details, t)}
          rows={details}
          onRowEditStop={handleCellEditCommit}
          onRowEditStart={handleCellEditStart}
          editMode="row"
        />
      </Box>

      <Divider />

      <Box sx={{p: 4, display: 'flex', justifyContent: 'end'}}>
        <Button variant='tonal' color='success' onClick={() => {
          addInstallmentDetail();
        }}>
          {t("+Add New Row")}
        </Button>
      </Box>

    </Card>
  )
}

export default InstallmentPlansEditTable
