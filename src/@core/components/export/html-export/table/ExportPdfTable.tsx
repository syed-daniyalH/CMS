// 'use client'
//
// import React from 'react'
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Typography, Paper
// } from '@mui/material'
//
// import dateFormat from 'dateformat'
// import { isDate } from 'src/@core/utils/format'
// import { SaleCustomerDetailColumnsModal } from 'src/graph-ql/sales-reports/SaleBycustomerDetail'
//
// interface Props {
//   data?: any[]
//   selected_columns?: SaleCustomerDetailColumnsModal[]
//   idType?: string | null
//   totalRows?: number
// }
//
// const ExportPdfTable = ({ data = [], selected_columns = [], idType, totalRows }: Props) => {
//
//   const getRowId = (row: any): string | number => {
//     const keys: any = {
//       pORecNo: row.pORecNo,
//       id: row.id,
//       itemId: row.itemId,
//       customerId: row.customerId,
//       classId: row.classId,
//       vendorId: row.vendorId,
//       coaId: row.coaId,
//       cOAId: row.cOAId,
//       rowId: row.rowId,
//       recno: row.recno,
//       paymentCoaId: row.paymentCoaId,
//       coarecno: row.coarecno,
//       itemIdLedger: row.id,
//       itemCode: row.itemCode,
//       billRecNo: row.billRecNo,
//       billRecno: row.billRecno,
//       invoiceRecno: row.invoiceRecno,
//       billNo: row.billNo,
//       uniqueId: row.uniqueId,
//       creditNoteRecNo: row.creditNoteRecNo,
//       allocatedBillRecno: row.allocatedBillRecno,
//       taxTypeId: row.taxTypeId,
//       dRecno: row.dRecno,
//       employeeId: row.employeeId
//     }
//
//     return keys[idType as keyof typeof keys] ?? row.recno
//   }
//
//   const renderCellValue = (row: any, column: SaleCustomerDetailColumnsModal) => {
//     const key = column.formatedName && column.formatedName !== "" ? column.formatedName : column.columnName
//     const value = row[key]
//     const isTotal = row.isTotalRowBold === true
//
//     if (isTotal) {
//       return (
//         <Typography sx={{
//           fontSize: selected_columns.length > 4 ? "18px" : "12px",
//           fontWeight: 600,
//           color: theme => theme.palette.customColors.textColor
//         }}>
//           {value}
//         </Typography>
//       )
//     }
//
//     if (isDate(row[column.columnName])) {
//       const dateStr = new Date((row[column.columnName] as string).split(".")[0]).toDateString()
//       return dateFormat(dateStr, "dd mmm, yyyy")
//     }
//
//     return isNaN(value) || parseInt(value) !== 0 ? value : ""
//   }
//
//   const renderRows = (dataSet: any[]) => {
//     return dataSet.map((row: any, idx: number) => (
//       <TableRow
//         key={`${getRowId(row)}-${idx}`}
//         sx={{
//           pageBreakInside: 'avoid',
//           ...(row.isTotalRowBold ? {
//             fontWeight: 'bold',
//             backgroundColor: '#f0f0f0'
//           } : {})
//         }}
//       >
//         {selected_columns.filter(col => col.isVisible).map((column, idx2) => (
//           <TableCell
//             key={`${getRowId(row)}-${idx2}`}
//             align={column.isAlignRight ? 'right' : 'left'}
//             sx={{
//               whiteSpace: 'normal',
//               wordWrap: 'break-word',
//               overflowWrap: 'break-word',
//               fontSize: selected_columns.length > 4 ? "18px" : "12px",
//               fontWeight: selected_columns.length > 5 ? 300 : 300,
//               width: `${100 / selected_columns.filter(col => col.isVisible).length}%`,
//               maxWidth: 200,
//               lineHeight: 1.5,
//               padding: '8px',
//               pageBreakInside: 'avoid',
//               color: 'black'
//             }}
//           >
//             <Typography sx={{ color: 'black' }}>
//               {renderCellValue(row, column)}
//             </Typography>
//           </TableCell>
//         ))}
//       </TableRow>
//     ))
//   }
//
//   const chunks = totalRows && totalRows > 100
//     ? Array.from({ length: Math.ceil(totalRows / 100) }, (_, i) => data.slice(i * 100, (i + 1) * 100))
//     : [data]
//
//   return (
//     <div style={{ padding: '16px' }}>
//       {chunks.map((chunk, index) => (
//         <TableContainer
//           key={index}
//           component={Paper}
//           sx={{
//             mb: 4,
//             pageBreakAfter: 'always',
//             overflowX: 'auto',
//             pageBreakInside: 'avoid'
//           }}
//         >
//           <Table
//             sx={{
//               borderCollapse: 'collapse',
//               tableLayout: 'fixed',
//               width: '100%',
//               pageBreakInside: 'avoid'
//             }}
//           >
//             {/* Header */}
//             {index === 0 && (
//               <TableHead>
//                 <TableRow sx={{ pageBreakInside: 'avoid' }}>
//                   {selected_columns.filter(col => col.isVisible).map((column, idx) => (
//                     <TableCell
//                       key={`header-${idx}`}
//                       align={column.isAlignRight ? 'right' : 'left'}
//                       sx={{
//                         fontWeight: 'bold',
//                         fontSize: selected_columns.length > 4 ? "16px" : "12px",
//                         borderTop: '1px solid black',
//                         borderBottom: '1px solid black',
//                         color: 'black !important',
//                         whiteSpace: 'normal',
//                         wordWrap: 'break-word',
//                         overflowWrap: 'break-word',
//                         width: `${100 / selected_columns.filter(col => col.isVisible).length}%`,
//                         maxWidth: 200,
//                         lineHeight: 1.5,
//                         padding: '8px',
//                         pageBreakInside: 'avoid'
//                       }}
//                     >
//                       {column.columnTitle}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//             )}
//
//             {/* Body */}
//             <TableBody sx={{ color: 'black' }}>
//               {renderRows(chunk)}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ))}
//     </div>
//   )
// }
//
// export default ExportPdfTable
