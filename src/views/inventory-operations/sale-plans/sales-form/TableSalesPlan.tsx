// // @ts-nocheck
// // ** React imports
// import React, { useMemo } from "react";
//
// // ** MUI Imports
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import {
//   DataGrid,
//   GridColDef,
//   GridRenderCellParams,
//   GridRowParams,
//   useGridApiRef,
//   GridFooterContainer,
// } from "@mui/x-data-grid";
// import IconButton from "@mui/material/IconButton";
// import {
//   Divider,
//   Typography,
//   Tooltip,
//   Checkbox,
//   Button,
// } from "@mui/material";
//
// // ** Data Import
// import { GridStartRowEditModeParams } from "@mui/x-data-grid/models/api/gridEditingApi";
//
// // ** Custom Imports
// import Icon from "src/@core/components/icon";
// import CustomTextField from "src/@core/components/mui/text-field";
// import CustomEmptyState from "src/custom-components/form-table-add-button";
// import DateViewFormat from "src/@core/components/date-view";
// import InstallmentTypeSelector from "src/@core/dropdown-selectors/InstallmentTypeSelector";
// import CustomDatePicker from "src/@core/components/custom-date-picker";
// import CustomChip from "src/@core/components/mui/chip";
//
// // ** Utils / i18n
// import { useTranslation } from "react-i18next";
// import {
//   cvalue,
//   formatCurrency,
//   getLastEnableColumn,
//   globalSendDateFormat,
// } from "src/@core/utils/format";
//
// //@ts-ignore
// import dateFormat from "dateformat";
//
// import { useSalePlans } from "../context/useSalePlans";
// import { SubSalePlan } from '../context/types'
//
// // ---------- Helpers ----------
// const round2 = (n: number) =>
//   Math.round((Number(n) + Number.EPSILON) * 100) / 100;
//
// // ---------- Columns ----------
// const makeColumns = (
//   apiRef: any,
//   onClickDelete: (recno: number) => void,
//   handleInstallmentDetailData: any,
//   t: any,
//   salePlans: any,
//   recalcFrom: any
// ): GridColDef[] => [
//   // 🔹 Action
//   {
//     flex: 0.08,
//     field: "Action",
//     minWidth: 50,
//     maxWidth: 60,
//     headerName: "",
//     sortable: false,
//     filterable: false,
//     disableColumnMenu: false,
//     hideable: false,
//     renderHeader: (params) =>
//       params.field && (
//         <Tooltip title={"Columns Customization"}>
//           <IconButton
//             disableFocusRipple
//             onClick={() => apiRef.current.showColumnMenu("Action")}
//           >
//             <Icon icon={"tabler:columns"} />
//           </IconButton>
//         </Tooltip>
//       ),
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       if (params.hasFocus) params.api.setCellFocus(params.id, "instTypeId");
//       return (
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             width: "100%",
//           }}
//         >
//           <IconButton
//             onBlur={(_) => params.api.setCellFocus(params.id, "instTypeId")}
//             onClick={(_) => onClickDelete(row?.recno??0)}
//             sx={{ color: (theme) => theme.palette.error.main }}
//           >
//             <Icon icon="tabler:trash" fontSize={"1.025rem"} />
//           </IconButton>
//         </Box>
//       );
//     },
//   },
//
//   // 🔹 Installment Type
//   {
//     flex: 0.16,
//     minWidth: 160,
//     maxWidth: 280,
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     field: "instTypeId",
//     headerName: "Type",
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <Box style={{ width: "100%" }}>
//           <InstallmentTypeSelector
//             selected_value={row?.instTypeId ?? null}
//             handleChange={(value:any) => {
//               handleInstallmentDetailData(
//                 { instTypeId: value?.value as number },
//                 row.recno
//               );
//             }}
//             props={{
//               label: null,
//               sx: { mb: 0 },
//               autoFocus: params.hasFocus,
//               focused: params.hasFocus,
//             }}
//             noBorder
//           />
//         </Box>
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <InstallmentTypeSelector
//           selected_value={row?.instTypeId ?? null}
//           handleChange={() => {}}
//           preview
//           props={{
//             label: null,
//             sx: { mb: 0 },
//             autoFocus: params.hasFocus,
//             focused: params.hasFocus,
//           }}
//           noBorder
//         />
//       );
//     },
//   },
//
//   // 🔹 Included
//   {
//     flex: 0.12,
//     minWidth: 120,
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     field: "isInclude",
//     headerName: "Included",
//     align: "center",
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <Box
//           sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//         >
//           <Checkbox
//             checked={!!row.isInclude}
//             onChange={(e) =>
//               handleInstallmentDetailData({ isInclude: e.target.checked }, row.recno)
//             }
//           />
//         </Box>
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => (
//       <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//         <Checkbox checked={!!(params.row as SubSalePlan).isInclude} disabled />
//       </Box>
//     ),
//   },
//
//   // 🔹 Month Gap
//   {
//     flex: 0.12,
//     minWidth: 120,
//     field: "monthGap",
//     type: "number",
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     headerName: "Month Gap",
//     align: "right",
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <CustomTextField
//           fullWidth
//           type="number"
//           variant="outlined"
//           focused={params.hasFocus}
//           autoFocus={params.hasFocus}
//           placeholder={t("Months") as string}
//           defaultValue={(row?.monthGap ?? 0) > 0 ? row.monthGap : ""}
//           onChange={(e) =>
//             handleInstallmentDetailData({ monthGap: cvalue(e.target.value) }, row.recno)
//           }
//           noBorder
//         />
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return <Typography>{row?.monthGap ?? ""}</Typography>;
//     },
//   },
//
//   // 🔹 Installment %
//   {
//     flex: 0.14,
//     minWidth: 140,
//     field: "percentage",
//     type: "number",
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     headerName: "Installment %",
//     align: "right",
//     hideable: false,
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <CustomTextField
//           fullWidth
//           type="number"
//           variant="outlined"
//           focused={params.hasFocus}
//           autoFocus={params.hasFocus}
//           placeholder={t("Percentage") as string}
//           defaultValue={(row?.percentage ?? 0) > 0 ? row.percentage : ""}
//           onChange={(e) => {
//             const val = e.target.value === "" ? null : Number(e.target.value);
//             const updated = recalcFrom(
//               "percentage",
//               { ...row, percentage: val },
//               { defSalePrice: salePlans?.defSalePrice }
//             );
//             console.log(updated,"updatupdateded")
//             handleInstallmentDetailData({ ...updated }, row.recno);
//           }}
//           noBorder
//         />
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <Typography>
//           {(row?.percentage ?? 0) > 0 ? `${row.percentage}%` : ""}
//         </Typography>
//       );
//     },
//   },
//
//   // 🔹 No of Installments
//   {
//     flex: 0.14,
//     minWidth: 140,
//     field: "noOfInst",
//     type: "number",
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     headerName: "No. of Installments",
//     align: "right",
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <CustomTextField
//           fullWidth
//           type="number"
//           variant="outlined"
//           focused={params.hasFocus}
//           autoFocus={params.hasFocus}
//           placeholder={t("Count") as string}
//           defaultValue={(row?.noOfInst ?? 0) > 0 ? row.noOfInst : ""}
//           onChange={(e) => {
//             const val =
//               e.target.value === "" ? null : Math.max(0, Math.floor(Number(e.target.value)));
//             const updated = recalcFrom(
//               "noOfInst",
//               { ...row, noOfInst: val },
//               { defSalePrice: salePlans?.defSalePrice }
//             );
//             handleInstallmentDetailData({ ...updated }, row.recno);
//           }}
//           noBorder
//         />
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return <Typography>{row?.noOfInst ?? ""}</Typography>;
//     },
//   },
//
//   // 🔹 Installment Amount
//   {
//     flex: 0.16,
//     minWidth: 160,
//     field: "instAmount",
//     type: "number",
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     headerName: "Installment Amount",
//     align: "right",
//     hideable: false,
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <CustomTextField
//           fullWidth
//           type="number"
//           variant="outlined"
//           focused={params.hasFocus}
//           autoFocus={params.hasFocus}
//           placeholder={t("Amount") as string}
//           defaultValue={(row?.instAmount ?? 0) > 0 ? row.instAmount : ""}
//           onChange={(e) => {
//             const val = e.target.value === "" ? null : Number(e.target.value);
//             const updated = recalcFrom(
//               "instAmount",
//               { ...row, instAmount: val },
//               { defSalePrice: salePlans?.defSalePrice }
//             );
//             handleInstallmentDetailData({ ...updated }, row.recno);
//           }}
//           noBorder
//         />
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <p>
//           {(row.instAmount ?? 0) > 0 ? formatCurrency(row.instAmount, null) : ""}
//         </p>
//       );
//     },
//   },
//
//   // 🔹 Total Installment Amount
//   {
//     flex: 0.16,
//     minWidth: 160,
//     field: "totalInstAmount",
//     type: "number",
//     editable: true,
//     sortable: false,
//     disableColumnMenu: true,
//     headerName: "Total Installment Amount",
//     align: "right",
//     hideable: false,
//     renderEditCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       return (
//         <CustomTextField
//           fullWidth
//           type="number"
//           variant="outlined"
//           focused={params.hasFocus}
//           autoFocus={params.hasFocus}
//           placeholder={t("Amount") as string}
//           defaultValue={(row?.totalInstAmount ?? 0) > 0 ? row.totalInstAmount : ""}
//           onChange={(e) => {
//             const val = e.target.value === "" ? null : Number(e.target.value);
//             const updated = recalcFrom(
//               "totalInstAmount",
//               { ...row, totalInstAmount: val },
//               { defSalePrice: salePlans?.defSalePrice }
//             );
//             handleInstallmentDetailData({ ...updated }, row.recno);
//           }}
//           noBorder
//         />
//       );
//     },
//     renderCell: (params: GridRenderCellParams) => {
//       const row = params.row as SubSalePlan;
//       const explicitTotal = Number(row.totalInstAmount ?? 0);
//       const fallback = Number(row.instAmount ?? 0) * Number(row.noOfInst ?? 0);
//       const total = explicitTotal > 0 ? explicitTotal : round2(fallback);
//       return (
//         <Typography>
//           {total > 0 ? formatCurrency(total, null) : "0.00"}
//         </Typography>
//       );
//     },
//   },
// ];
// // ---------- Total Footer ----------
// const TotalFooter = ({ columns, totalPerc, totalCount, totalInstAmount, totalAmount }: any) => {
//   const firstN = 4;
//   const leftCols = columns.slice(0, firstN);
//   const rightCols = columns.slice(firstN);
//   const flexOf = (c: GridColDef) => (typeof c.flex === "number" ? c.flex : 0.1);
//   const leftFlex = leftCols.reduce((s:any, c:any) => s + flexOf(c), 0);
//
//   return (
//     <GridFooterContainer sx={{ px: 0 }}>
//       <Box
//         sx={{
//           display: "flex",
//           width: "100%",
//           alignItems: "center",
//           borderTop: (theme) => `1px solid ${theme.palette.divider}`,
//           bgcolor: (theme) => theme.palette.action.hover,
//           height: 56,
//         }}
//       >
//         <Box sx={{ flexGrow: leftFlex, px: 2, display: "flex", alignItems: "center" }}>
//           <Typography sx={{ fontWeight: 800 }}>TOTAL</Typography>
//         </Box>
//
//         {rightCols.map((col:any) => (
//           <Box
//             key={col.field}
//             sx={{
//               flexGrow: flexOf(col),
//               px: 2,
//               display: "flex",
//               alignItems: "center",
//               justifyContent:
//                 col.align === "right"
//                   ? "flex-end"
//                   : col.align === "center"
//                   ? "center"
//                   : "flex-start",
//             }}
//           >
//             {col.field === "percentage" && (
//               <Typography sx={{ fontWeight: 600 }}>{round2(totalPerc)}%</Typography>
//             )}
//             {col.field === "noOfInst" && (
//               <Typography sx={{ fontWeight: 600 }}>{totalCount}</Typography>
//             )}
//             {col.field === "instAmount" && (
//               <Typography sx={{ fontWeight: 700 }}>
//                 {formatCurrency(round2(totalInstAmount), null)}
//               </Typography>
//             )}
//             {col.field === "totalinstAmount" && (
//               <Typography sx={{ fontWeight: 800 }}>
//                 {formatCurrency(round2(totalAmount), null)}
//               </Typography>
//             )}
//           </Box>
//         ))}
//       </Box>
//     </GridFooterContainer>
//   );
// };
//
// // ---------- Component ----------
// const SalesPlansEditTable = ({ details, originalPrice }: any) => {
//   const { t } = useTranslation();
//   const tableRef = useGridApiRef();
//   const { salePlans, addSalePlanDetail, removeInstallmentDetail, handleInstallmentDetailData, recalcFrom } = useSalePlans();
//
//   const rows = (details ?? []).map((r:any) => ({
//     ...r,
//     totalinstAmount:
//       r.totalinstAmount > 0
//         ? round2(r.totalinstAmount)
//         : round2((r.instAmount ?? 0) * (r.noOfInst ?? 0)),
//   }));
//
//   const totals = rows.reduce(
//     (acc:any, r:any) => {
//       acc.perc += Number(r.percentage ?? 0);
//       acc.count += Number(r.noOfInst ?? 0);
//       acc.instAmount += Number(r.instAmount ?? 0);
//       acc.amount +=
//         (r.totalinstAmount && r.totalinstAmount > 0
//           ? Number(r.totalinstAmount)
//           : Number(r.instAmount ?? 0) * Number(r.noOfInst ?? 0)) || 0;
//       return acc;
//     },
//     { perc: 0, count: 0, instAmount: 0, amount: 0 }
//   );
//
//   const cols = useMemo(
//     () => makeColumns(tableRef, removeInstallmentDetail, handleInstallmentDetailData, t, salePlans, recalcFrom),
//     [salePlans]
//   );
//
//   return (
//     <Grid container spacing={4}>
//
//       {/* 🔹 DataGrid Table Section */}
//       <Grid item md={12} xs={12}>
//         <Box>
//           <DataGrid
//             autoHeight
//             apiRef={tableRef}
//             hideFooter={false}
//             getRowHeight={() => 56}
//             getRowId={(row: any) => row.recno}
//             isCellEditable={() => !salePlans.agreeId}
//             slots={{
//               noRowsOverlay: () => <CustomEmptyState onClickAdd={addSalePlanDetail} />,
//               footer: () => (
//                 <TotalFooter
//                   columns={cols}
//                   totalPerc={totals.perc}
//                   totalCount={totals.count}
//                   totalInstAmount={totals.instAmount}
//                   totalAmount={totals.amount}
//                 />
//               ),
//             }}
//             columns={cols}
//             rows={rows}
//             editMode="row"
//           />
//           {salePlans.length > 0 && !salePlans.planId && (
//             <>
//               <Divider sx={{ mt: 2 }} />
//               <Box sx={{ p: 4, display: "flex", justifyContent: "flex-end" }}>
//                 <Button variant="tonal" color="success" onClick={() => addSalePlanDetail()}>
//                   {t("+ Add New Row")}
//                 </Button>
//               </Box>
//             </>
//           )}
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };
//
// export default SalesPlansEditTable;
