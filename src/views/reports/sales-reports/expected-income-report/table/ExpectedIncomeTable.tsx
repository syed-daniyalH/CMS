
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

export const columns = (
  selected_columns: any[] = [],
  queries: any,
  t: any,
  state: any
): GridColDef[] => {
  const table_columns: GridColDef[] = [];

  for (let i = 0; i < selected_columns.length; i++) {
    const col = selected_columns[i];

    if (col.isVisible) {
      // ✅ Dynamic width calculation
      const width = col.width
        ? col.width
        : col.columnTitle.length * 12 < 140
          ? 140
          : col.columnTitle.length * 12 > 300
            ? 300
            : col.columnTitle.length * 12;

      const singleColumn: GridColDef = {
        field: `${col.columnName}`,
        headerName: `${col.columnTitle}`,
        sortable: false,
        width,
        minWidth: 100,
        maxWidth: 350,
        flex: col.flex ?? undefined,
        ...(col.isAlignRight && { headerAlign: "right", align: "right" })
      };

      singleColumn.renderCell = (params: GridRenderCellParams) => {
        const { row } = params;
        const isTotal = row.name === t("Total");
        const columnKey = col.formatedName || col.columnName;
        const cellValue = row[columnKey];

        // ✅ Sale Date formatting
        if (col.columnName.toLowerCase() === "saledate") {
          return <DateViewFormat date={params?.row?.saleDate} />;
        }

        // ✅ Property Status Chip
        if (col.columnName.toLowerCase() === "propertystatus") {
          const isActive =
            params?.row?.propertyStatus?.toLowerCase() === "active";
          return (
            <CustomChip
              rounded
              size="small"
              skin="light"
              color={isActive ? "success" : "secondary"}
              label={isActive ? "Active" : "In-Active"}
              sx={{
                "& .MuiChip-label": {
                  textTransform: "capitalize",
                  fontSize: "0.7rem"
                }
              }}
            />
          );
        }

        // ✅ Right-aligned numeric values with currency
        if (col.isAlignRight && !isNaN(cellValue)) {
          return (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 400,
                color: (theme) => theme.palette.customColors.textColor,
                textAlign: "right"
              }}
            >
              {formatCurrency(cellValue, null)}
            </Typography>
          );
        }

        // ✅ Total row styling
        if (isTotal) {
          return (
            <Typography
              sx={{
                fontWeight: 500,
                color: (theme) => theme.palette.customColors.textColor
              }}
            >
              {cellValue}
            </Typography>
          );
        }

        // ✅ Clickable links
        if (col.clickable) {
          return (
            <Typography
              component={Link}
              href={`/reports/accounts/journal-ledgers?query_filter=${encodeParameters(
                {
                  fromDate: queries?.fromDate,
                  toDate: queries?.toDate,
                  agreeId: row.agreeId,
                  name: row.name,
                  period: state?.period
                }
              )}`}
              variant="body2"
              sx={{
                cursor: "pointer",
                color: "#568FDF",
                fontWeight: 500,
                textDecoration: "none"
              }}
            >
              {cellValue}
            </Typography>
          );
        }

        // ✅ Generic date formatting
        if (isDate(cellValue ?? "")) {
          return <DateViewFormat date={cellValue} />;
        }

        // ✅ Default plain text
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 300,
              color: (theme) => theme.palette.customColors.textColor
            }}
          >
            {cellValue ?? ""}
          </Typography>
        );
      };

      table_columns.push(singleColumn);
    }
  }

  return table_columns;
};
const ExpectedIncomeTable = ({filters,state, data,queries, totalRows, paginationModel, setPaginationModel, selected_columns}:any) => {


  const {t} = useTranslation();


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
                getRowId={(row) => row.agreeId}

                 />

          </Box>

        </>
    )
}

export default ExpectedIncomeTable;
