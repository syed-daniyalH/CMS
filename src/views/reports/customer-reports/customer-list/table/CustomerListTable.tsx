
// ** React imports
import {useEffect, useState} from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import {Box, Tooltip, Typography} from "@mui/material"
import CustomChip from 'src/core/components/mui/chip'
// ** Types Imports


// ** Utils
import { fixedGridHeaderTop, formatCurrency, formatDate, isDate } from 'src/core/utils/format'
import {encodeParameters} from "src/core/utils/encrypted-params";
import {useTranslation} from "react-i18next";
//@ts-ignore
import dateFormat from 'dateformat';
import {StatusColor} from "../../../../../core/utils/default-color";
import DateViewFormat from '../../../../../core/components/date-view'

const columns = (
  selected_columns: any[] = [],
  queries: any,
  t: any,
  state: any
) => {
  const table_columns: GridColDef[] = []

  for (let i = 0; i < selected_columns.length; i++) {
    if (selected_columns[i].isVisible) {
      let singleColumn: GridColDef = {
        flex: selected_columns[i].isAlignRight ? 0.12 : 0.2,
        field: `${selected_columns[i].columnName}`,
        minWidth:
          selected_columns[i].columnName.length > 12
            ? selected_columns[i].columnName.length * 12
            : 200,
        maxWidth:
          selected_columns[i].columnName.toLowerCase() === 'name'
            ? 180
            : selected_columns[i].isAlignRight
            ? 500
            : 220,
        headerName: `${selected_columns[i].columnTitle}`,
        sortable: false
      }

      if (selected_columns[i].isAlignRight) {
        singleColumn.headerAlign = 'right'
        singleColumn.align = 'right'
      }

      singleColumn.renderCell = (params: GridRenderCellParams) => {
        const { row } = params
        const isTotal = row.name === t('Total')
        const columnKey =
          selected_columns[i].formatedName &&
          selected_columns[i].formatedName !== ''
            ? selected_columns[i].formatedName
            : selected_columns[i].columnName
        const cellValue = row[columnKey]

        // ✅ Show DateViewFormat for Sale Date column
        if (selected_columns[i].columnName.toLowerCase() === 'saledate') {
          return <DateViewFormat date={params?.row?.saleDate} />
        }
        if (selected_columns[i].columnName.toLowerCase() === 'propertystatus') {
          const isActive = params?.row?.propertyStatus?.toLowerCase() === 'active'
          return (
            <CustomChip
              rounded
              size='small'
              skin='light'
              color={isActive ? 'success' : 'secondary'}
              label={isActive ? 'Active' : 'In-Active'}
              sx={{
                '& .MuiChip-label': {
                  textTransform: 'capitalize',
                  fontSize: '0.7rem'
                }
              }}
            />
          )
        }
        // ✅ Format numeric values (right-aligned) with currency
        if (selected_columns[i].isAlignRight && !isNaN(cellValue)) {
          return (
            <Typography
              variant='body2'
              sx={{
                fontWeight: 400,
                color: theme => theme.palette.customColors.textColor
              }}
            >
              {formatCurrency(cellValue, null)}
            </Typography>
          )
        }

        // ✅ Handle total row
        if (isTotal) {
          return (
            <Typography
              sx={{
                fontWeight: 500,
                color: theme => theme.palette.customColors.textColor
              }}
            >
              {cellValue}
            </Typography>
          )
        }

        // ✅ Handle clickable links
        if (selected_columns[i].clickable) {
          return (
            <Typography
              component={Link}
              href={
                selected_columns[i].columnName === 'name'
                  ? '#'
                  : `/reports/accounts/journal-ledgers?query_filter=${encodeParameters(
                  {
                    fromDate: queries?.fromDate,
                    toDate: queries?.toDate,
                    customerId: row.customerId,
                    name: row.name,
                    period: state?.period
                  }
                  )}`
              }
              variant='body2'
              sx={{
                cursor: 'pointer',
                color: '#568FDF',
                fontWeight: 500,
                textDecoration: 'none'
              }}
            >
              {cellValue}
            </Typography>
          )
        }

        // ✅ Handle generic date formatting (for other date columns)
        if (isDate(cellValue ?? '')) {
          return <DateViewFormat date={cellValue} />
        }

        // ✅ Default plain text
        return (
          <Typography
            variant='body2'
            sx={{
              fontWeight: 300,
              color: theme => theme.palette.customColors.textColor
            }}
          >
            {cellValue ?? ''}
          </Typography>
        )
      }

      table_columns.push(singleColumn)
    }
  }

  return table_columns
}
const CustomerListTable = ({filters,state, sumData, data,queries, totalRows, paginationModel, setPaginationModel, selected_columns}:any) => {


  const {t} = useTranslation();

    const sumRow = { ...sumData[0], customerId: -100, name: t("Total"), clickable: false , sortNo:1};

    const updatedData =data.length ? [...data, sumRow] :data;
    const getRowClassName = (params:any) => {
        return params.row.name === 'Total' ? 'total-row' : '';
    };

    return (
        <>
          <Box sx={{height: `calc(100vh - ${Object.keys(filters).length > 0 ? '340px' : "310px"})`}}>
            <DataGrid
                disableColumnMenu
                columnHeaderHeight={40}
                rowHeight={38}
                columns={columns(selected_columns, queries,t,state)}
                paginationMode={'server'}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={(model) => {
                    setPaginationModel(model);
                }}
                sx={{
                  '.MuiDataGrid-columnHeaders': {

                    color: 'black',
                    fontWeight: 'bold',
                    backgroundColor:"white",
                    borderTop: `1px solid black`,

                    borderBottom: '1px solid black',
                  },
                }}
                rows={data}
                rowCount={data?.length ?  totalRows:totalRows}
                getRowId={(row) => row.customerId}
                getRowClassName={getRowClassName}
                 />

          </Box>

        </>
    )
}

export default CustomerListTable;
