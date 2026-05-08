// ** React imports
import { useState, useMemo } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import CustomChip from "src/@core/components/mui/chip";

// ** Utils
import { formatCurrency } from "src/@core/utils/format";
import DateViewFormat from "src/@core/components/date-view";
import { useTranslation } from "react-i18next";

interface Transfer {
  oldCustomerName: string;
  newCustomerName: string;
  transferDate: string;
  transferBy: string;
  transferCharges: number;
  oldCustomerIdentityNo?: string;
  oldCustomerContactNo?: string;
  oldCustomerAddress?: string;
  oldCustomerEmail?: string;
  oldGuardianName?: string;
  newCustomerIdentityNo?: string;
  newCustomerContactNo?: string;
  newCustomerAddress?: string;
  newCustomerEmail?: string;
  newGuardianName?: string;
}

interface Property {
  propertyId: number;
  propertyNo: string;
  floorName: string;
  status: string;
  typeName: string;
  saleDate: string;
  saleAgentName: string;
  customerName: string;
  customerIdentityNo: string;
  customerContactNo?: string;
  customerAddress?: string;
  customerEmail?: string;
  guardianName?: string;
  vMPropertyTransferHistoriesDetail: Transfer[];
}

interface Props {
  data: Property[];
  filters: any;
  state: any;
  queries: any;
  totalRows: number;
  paginationModel: any;
  setPaginationModel: any;
  selected_columns: any[];
}

const TransferPropertySummaryTable = ({
                                        data,
                                        filters,
                                      }: Props) => {
  const { t } = useTranslation();

  // Build hierarchical rows with indentation
  const rows = useMemo(() => {
    const hierarchicalRows: any[] = [];

    data.forEach((property:any) => {
      // Property row
      hierarchicalRows.push({
        id: `property-${property.propertyId}`,
        name: `${property.propertyNo} - ${property.floorName}`,
        type: property.typeName,
        status: property.status,
        saleDate: property.saleDate,
        saleAgentName: property.saleAgentName || "N/A",
        soldAmount: property.saleablePrice,
        _treeLevel: 0,
      });

      // Customer row
      hierarchicalRows.push({
        id: `customer-${property.propertyId}`,
        name: `Current Owner: ${property.customerName}`,
        identityNo: property.customerIdentityNo,
        contactNo: property.customerContactNo,
        email: property.customerEmail,
        address: property.customerAddress,
        guardianName: property.guardianName,
        _treeLevel: 1,
      });

      // Transfer history rows
      property.vMPropertyTransferHistoriesDetail.forEach((transfer:any, index:any) => {
        hierarchicalRows.push({
          id: `transfer-${property.propertyId}-${index}`,
          name: `Transfer: ${transfer.oldCustomerName} → ${transfer.newCustomerName}`,
          transferDate: transfer.transferDate,
          transferBy: transfer.transferBy,
          transferCharges: transfer.transferCharges,
          oldCustomerIdentityNo: transfer.oldCustomerIdentityNo,
          newCustomerIdentityNo: transfer.newCustomerIdentityNo,
          _treeLevel: 2,
        });
      });
    });

    return hierarchicalRows;
  }, [data]);

  // Columns
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name / Info",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const indent = params.row._treeLevel * 3; // Adjust indentation
        return (
          <Box sx={{ pl: indent }}>
            <Typography
              variant="body2"
              color={(theme) => theme.palette.customColors.textColor}
              sx={{ fontWeight: params.row._treeLevel === 0 ? "bold" : 400 }}
            >
              {params.value}
            </Typography>
            {params.row._treeLevel === 1 && (
              <Typography variant="caption" sx={{ display: "block" }}>
                {`ID: ${params.row.identityNo} | Contact: ${params.row.contactNo}`}
              </Typography>
            )}
            {params.row._treeLevel === 2 && (
              <Typography variant="caption" sx={{ display: "block" }}>
                {`Old ID: ${params.row.oldCustomerIdentityNo} | New ID: ${params.row.newCustomerIdentityNo}`}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: (params: GridRenderCellParams) =>
        params.row._treeLevel === 0 ? (
          <Typography variant="body2" color={(theme) => theme.palette.customColors.textColor}>
            {params.value}
          </Typography>
        ) : null,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row._treeLevel === 0) {
          const isActive = params.value?.toLowerCase() === "active";
          return (
            <CustomChip
              rounded
              size="small"
              skin="light"
              color={isActive ? "success" : "secondary"}
              label={isActive ? "Active" : "Inactive"}
            />
          );
        }
        return null;
      },
    },
    {
      field: "saleDate",
      headerName: "Sale Date",
      width: 120,
      renderCell: (params: GridRenderCellParams) =>
        params.row._treeLevel === 0 ? <DateViewFormat date={params.value} /> : null,
    },
    {
      field: "soldAmount",
      headerName: "Sold Amount",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.row._treeLevel === 0 ? formatCurrency(params.value, null) : null,
    },
    {
      field: "transferDate",
      headerName: "Transfer Date",
      width: 130,
      renderCell: (params: GridRenderCellParams) =>
        params.row._treeLevel === 2 ? <DateViewFormat date={params.value} /> : null,
    },
    {
      field: "transferBy",
      headerName: "Transfer By",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        params.row._treeLevel === 2 ? params.value : null,
    },
    {
      field: "transferCharges",
      headerName: "Charges",
      width: 120,
      renderCell: (params: GridRenderCellParams) =>
        params.row._treeLevel === 2 ? formatCurrency(params.value, null) : null,
    },
  ];

  return (
    <Box sx={{ height: `calc(100vh - ${Object.keys(filters).length > 0 ? "340px" : "310px"})` }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        disableColumnMenu
        hideFooter
        columnHeaderHeight={40}
        rowHeight={38}
        sx={{
          ".MuiDataGrid-columnHeaders": {
            color: "black",
            fontWeight: "bold",
            backgroundColor: "white",
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
          },
        }}
      />
    </Box>
  );
};

export default TransferPropertySummaryTable;
