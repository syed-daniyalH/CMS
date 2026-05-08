
// ** React imports
import {useEffect, useState} from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import {DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid'
import {Box, Tooltip, Typography} from "@mui/material"
import CustomChip from 'src/@core/components/mui/chip'
// ** Types Imports


// ** Utils
import { fixedGridHeaderTop, formatCurrency, formatDate, isDate } from 'src/@core/utils/format'
import {encodeParameters} from "src/@core/utils/encrypted-params";
import {useTranslation} from "react-i18next";
//@ts-ignore
import dateFormat from 'dateformat';
import {StatusColor} from "../../../../../@core/utils/default-color";
import DateViewFormat from '../../../../../@core/components/date-view'

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
        const isTotal = row?.type === t("total");
        const isSummary = row?.type ==="summary"
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


        if (col.columnName === "customerName" && isSummary) {
          return (
            <Box>
              <Typography sx={{ fontWeight: 600,     fontSize:"12px" }}>
                {row.customerName}
              </Typography>
              <Typography sx={{      fontSize:"11px", color: "gray" }}>
                {row.propertyNo}
              </Typography>
            </Box>
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
                color: (theme) => theme.palette.customColors.textColor,
                fontSize:"11px"
              }}
            >
              {cellValue}
            </Typography>
          );
        }
        // if (isSummary) {
        //   return (
        //     <Typography
        //       sx={{
        //         fontWeight: 500,
        //         color: (theme) => theme.palette.customColors.textColor
        //       }}
        //     >
        //       {cellValue}
        //     </Typography>
        //   );
        // }

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
const PropertyWisePendingTable = ({filters,state, data,queries, totalRows, paginationModel, setPaginationModel, selected_columns}:any) => {

  const flattened: any[] = []

  data?.forEach((customer:any) => {

    flattened.push({
      type: 'summary',
      agreeId: `summary-${customer.agreeId}`,
      customerName: customer.customerName ,
      plotAmount: customer.plotAmount,
      propertyNo: customer.propertyNo,
      totalInRecAmount: customer.totalInRecAmount,
      totalPendingAmount: customer.totalPendingAmount,
      totalInPendingAmount: customer.totalInPendingAmount
    });

    let totalRec = 0;
    let totalPending = 0;
    let totalIn = 0;
    let totalInRec = 0;
    let totalInPending = 0;
    let totalPlot = 0;

    // MONTH rows
    customer?.monthWiseAmounts?.forEach((month:any, index:any) => {
      totalRec += month.totalRecAmount || 0;
      totalPending += month.totalPendingAmount || 0;
      totalIn += month.totalInAmount || 0;
      totalInRec += month.totalInRecAmount || 0;
      totalInPending += month.totalInPendingAmount || 0;
      totalPlot += month.totalAmount || 0;

      flattened.push({
        type: 'month',
        agreeId: `month-${customer.agreeId}-${index}`,
        customerName: month.monthYear,
        plotAmount: month.totalAmount,
        totalRecAmount: month.totalRecAmount,
        totalPendingAmount: month.totalPendingAmount,
        totalInAmount: month.totalInAmount,
        totalInRecAmount: month.totalInRecAmount,
        totalInPendingAmount: month.totalInPendingAmount
      });
    });

    // ADD TOTAL FINAL ROW
    flattened.push({
      type: 'total',
      agreeId: `total-${customer.agreeId}`,
      customerName: (
        <>
          Total <br /> ({customer.customerName})
        </>
      ),
      plotAmount: totalPlot,
      totalRecAmount: totalRec,
      totalPendingAmount: totalPending,
      totalInAmount: totalIn,
      totalInRecAmount: totalInRec,
      totalInPendingAmount: totalInPending
    });

  });
  console.log(flattened,"datadatadatdataaddataata")
  const {t} = useTranslation();


    return (
        <>
          <Box sx={{height: `calc(100vh - ${Object.keys(filters).length > 0 ? '340px' :  "310px"})`}}>
            <DataGrid
              getRowClassName={(params) => {
                if (params.row.type === "summary") return "summary-row";
                if (params.row.type === "total") return "total-row";
                return "";
              }}
                disableColumnMenu
                columnHeaderHeight={40}
                rowHeight={38}
                columns={columns(selected_columns, queries,t,state)}
              hideFooter

                sx={{
                  '.MuiDataGrid-columnHeaders': {

                    color: 'black',
                    fontWeight: 'bold',
                    backgroundColor:"white",
                    borderTop: `1px solid black`,

                    borderBottom: '1px solid black',
                  },
                  '& .summary-row': {
                    backgroundColor: "rgb(255 159 67 / 0.08)",
                    fontWeight: 'bold',
                    textDecorationColor: "red !important",
                  },
                  "& .total-row": {
                    backgroundColor: "rgb(40 199 111 / 0.04)" ,
                    fontWeight: "bold",
                    color: "#000"
                  }
                }}
                rows={flattened}
                // rowCount={flattened?.length ?  totalRows:totalRows}
                getRowId={(row) => row.agreeId}

                 />

          </Box>

        </>
    )
}

export default PropertyWisePendingTable;
