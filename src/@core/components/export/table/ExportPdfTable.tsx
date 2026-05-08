// ** React Imports
import React from "react";

// ** MUI Imports
import {DataGrid, GridColDef, GridRenderCellParams, GridRowId} from '@mui/x-data-grid'
import {Typography} from "@mui/material"

// ** Types Imports


// ** Utils Imports
import {isDate} from "src/@core/utils/format";
//@ts-ignore
import dateFormat from 'dateformat';

const columns = (selected_columns : any[] = []) => {

  const table_columns: GridColDef[] = [];

  for(let i = 0 ; i < selected_columns.length; i++) {
    let isDescriptionColumn = selected_columns[i].columnName.toLowerCase().includes('description')

    if(selected_columns[i].isVisible) {
      let singleColumn: GridColDef = {
        flex: isDescriptionColumn ? 0.5 : (selected_columns[i].isAlignRight ? 0.15 : 0.2),

        // flex: selected_columns.length-1 === i ? :selected_columns[i].isAlignRight ? 0.12 : 0.2,
        field: `${selected_columns[i].columnName}`,
        minWidth: isDescriptionColumn
          ? 400
          : (selected_columns[i].columnName.length > 12
            ? selected_columns[i].columnName.length * 12
            : 200),        headerName: `${selected_columns[i].columnTitle}`
      };
      if(selected_columns[i].isAlignRight) {
        singleColumn.headerAlign = 'right';
        singleColumn.align = 'right';
      }

      singleColumn.renderCell = (params: GridRenderCellParams) => {
        const { row } = params

        const isTotal = row.isTotalRowBold === true

        if(isTotal){
          return (
            <Typography  sx={{fontSize:selected_columns.length >4?"18px":"12px", fontWeight: 600, textDecoration: 'none',color:theme => theme.palette.customColors.textColor }}>
              {row[`${selected_columns[i].formatedName && selected_columns[i].formatedName !== "" ? selected_columns[i].formatedName : selected_columns[i].columnName}`]}
            </Typography>
          )
        }
        return (
          <Typography variant='body2' sx={{  fontWeight:selected_columns.length >5? 300:300, textDecoration: 'none', color:`black`,fontSize:selected_columns.length >4?"18px":"12px", whiteSpace: 'normal', wordWrap: 'break-word',   overflow: 'visible', overflowWrap: 'break-word',   textOverflow: 'ellipsis'}} >
            {isDate(row[`${selected_columns[i].columnName}`]??"Some") ? (dateFormat(new Date((row[`${selected_columns[i].columnName}`] as string).substring(0, (row[`${selected_columns[i].columnName}`] as string).indexOf(".") )).toDateString(), "dd mmm, yyyy")) : isNaN(row[`${selected_columns[i].columnName}`]) || parseInt(row[`${selected_columns[i].columnName}`]) !== 0 ? row[`${selected_columns[i].formatedName && selected_columns[i].formatedName !== "" ? selected_columns[i].formatedName : selected_columns[i].columnName}`] : ""}
          </Typography>
        )
      }
    table_columns.push(singleColumn)
    }
  }

  return table_columns;
}

interface Props {
  data?: any | any[]
  selected_columns?: any | any[]
  idType?: string | null
  totalRows?: number
}

const ExportPdfTable = ({data, selected_columns,idType, totalRows} : Props) => {

  const getRowId = (row: any) : GridRowId => {
    switch (idType) {
      case 'pORecNo':
        return row.pORecNo;
        case 'id':
        return row.id;
      case 'itemId':
        return row.itemId;
      case 'customerId':
        return row.customerId;
      case 'classId':
        return row.classId;
      case 'vendorId':
        return row.vendorId;
        case 'accountId':
        return row.accountId;
      case 'coaId':
        return row.coaId;
      case 'cOAId':
        return row.cOAId;
      case 'rowId':
        return row.rowId;
      case 'recno':
        return row.recno;
      case 'paymentCoaId':
        return row.paymentCoaId;
      case 'coarecno':
        return row.coarecno;
      case 'itemIdLedger':
        return row.id;
      case 'itemCode':
        return row.itemCode;
      case 'billRecNo':
        return row.billRecNo;
      case 'billRecno':
        return row.billRecno;
      case 'invoiceRecno':
        return row.invoiceRecno;
      case 'billNo':
        return row.billNo;
      case 'uniqueId':
        return row.uniqueId;
      case 'creditNoteRecNo':
        return row.creditNoteRecNo;
      case 'allocatedBillRecno':
        return row.allocatedBillRecno;
      case 'taxTypeId':
        return row.taxTypeId;
      case 'dRecno':
        return row.dRecno;
      case 'employeeId':
        return row.employeeId;
      default:
        return row.recno;
    }
  };
  return (
    <div>
      <DataGrid
        disableColumnMenu
        columnHeaderHeight={40}
        autoHeight
        rowHeight={38}
        columns={columns(selected_columns)}
        rows={data?.slice(0,100)}
        // rows={data}
        getRowId={getRowId}

        hideFooterPagination
        hideFooter
        getRowHeight={() => 'auto'}

        sx={{
          backgroundColor: '#fff',
          '& .MuiDataGrid-row': {
            paddingBottom: '10px',
            paddingTop: '8px',
          },
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal !important',
            wordWrap: 'break-word !important',
            overflowWrap: 'break-word !important',
            overflow: 'visible !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
            color: 'black',
            fontSize: selected_columns.length > 4 ? '16px' : '12px',
          },
        }}

      />

      {totalRows && totalRows > 100 ? Array.from({ length: Math.floor(totalRows / 100) }).map((_, index) => {
          const startIndex = ((index + 1)  * 100) ;
          const endIndex = startIndex + 100;
          const finalIndex = endIndex > totalRows ? totalRows : endIndex
          const chunkedData = data.slice(startIndex, finalIndex);
          return (
            (chunkedData.length > 0) && (
              <DataGrid
                disableColumnMenu
                columnHeaderHeight={40}
                autoHeight
                rowHeight={38}
                columns={columns(selected_columns)}
                rows={chunkedData}
                getRowId={getRowId}
                getRowClassName={(params) =>
                  params.id === "totalRow" ? "total-row" : ""
                }

                hideFooterPagination
                hideFooter
                slots={{
                  columnHeaders: () => null,
                }}
                getRowHeight={() => 'auto'}
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiDataGrid-row': {
                    paddingBottom: '10px',
                    paddingTop: '8px',
                  },
                  '& .MuiDataGrid-cell': {
                    whiteSpace: 'normal !important',
                    wordWrap: 'break-word !important',
                    overflowWrap: 'break-word !important',
                    overflow: 'visible !important',
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: selected_columns.length > 4 ? '16px' : '12px',
                  },
                }}
              />
            )
          );
        })
        :
        null
      }
    </div>
  )
}

export default ExportPdfTable
