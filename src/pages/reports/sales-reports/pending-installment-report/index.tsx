// ** React imports
import React, {useEffect, useState} from 'react';

// ** MUI imports
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// ** Third party imports
import moment from 'moment';

// ** Hooks
import {useAuth} from "src/hooks/useAuth";
import {useRouter} from "next/router";

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom imports
import ActionBar from "src/views/reports/sales-reports/month-wise-pending-report/ActionBar";
import FilterDrawer from "src/views/reports/sales-reports/month-wise-pending-report/filter";
import MonthWisePending from "src/views/reports/sales-reports/month-wise-pending-report/MonthWisePending";

// ** Utils
import { formatCurrency, formatDate, formatDateFields, getDateRangeByFilter } from 'src/@core/utils/format'
import Spinner from 'src/@core/components/spinner';
import exportToExcel from "src/@core/utils/exportxlsx";

// ** Types
import {GET_PROPERTY_WISE_REPORT, } from "src/graph-ql/sale-reports/month-wise-pending";

import {LazyQueryHookOptions, QueryHookOptions, useLazyQuery, useQuery} from "@apollo/client";

// ** Pdf Export
import generatePDF, {Margin, Resolution, usePDF} from "react-to-pdf";

// ** Utils

import {decodeParameters, encodeParameters} from "src/@core/utils/encrypted-params";
import {useTranslation} from "react-i18next";
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Typography } from '@mui/material'

const MonthWisePendingReport = () => {
    const {user} = useAuth();
   const {t} =useTranslation();
   const lang =window.localStorage.getItem("lang")

    const {toPDF, targetRef} = usePDF({
        filename: `general-ledger-summary.pdf`,
        //@ts-ignore
        options: {
            format: 'letter',
            tableWidth: 'auto',
            resolution: Resolution.LOW
        }
    });
    const {fromDate, toDate} = getDateRangeByFilter('month', user);
    const [state, setState] = useState<any>({fromDate: fromDate, toDate: toDate, period: "month"});

    //** token
    const [queries, setQueries] = useState<any>({
        fromDate: null,
        toDate: null,
    });

    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
    const [pdfData, setPdfData] = useState<any>([]);
    const [paginationModel, setPaginationModel] = useState<any>({page: 0, pageSize: 25,first:25});
    const [loadingExcel, setLoadingExcel] = useState<boolean>(false);
    const [loadingPdfPrint, setLoadingPdfPrint] = useState<boolean>(false);
    const [totalRowsPdf, setTotalRowsPdf] = useState<number>(0)
    const [filters, setFilters] = useState<any >({})
  const [shouldFetch, setShouldFetch] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<any>([
    // 🕓 Sale Information
    { columnName: 'propertyNo', columnTitle: t("Property No"), isVisible: true, sortNo: 2, isAlignRight: false, clickable: false, formatedName: null,width: 250, },
    { columnName: 'customerName', columnTitle: t("Customer Name"), isVisible: true, sortNo: 2, isAlignRight: false, clickable: false, formatedName: null,width: 250, },
  { columnName: 'propertyStatus', columnTitle: t("Status"), isVisible: true, sortNo: 7, isAlignRight: false, clickable: false, formatedName: null,width: 250, },
  { columnName: 'floorName', columnTitle: t("Land Status"), isVisible: true, sortNo: 7, isAlignRight: false, clickable: false, formatedName: null,width: 250, },
    // 📐 Property Size & Rate

  ]);


  const visibleColumns = columns.filter((column:any) => column.isVisible);
    //router back

    const handleBackClick = () => {
      router.back();
    };
    // url Link
    const router = useRouter();
    let {query_filter} = router.query;

//** decode Filter

    useEffect(() => {
        let isActive = true;

        if (isActive && query_filter) {
            let decodedObj = decodeParameters(query_filter);

            if(JSON.stringify(decodedObj) !== JSON.stringify(queries)) {
                const  cOAId = parseInt(decodedObj.cOAId as string)
                const  fromDate = decodedObj.fromDate as string
                const  toDate = decodedObj.toDate as string
                const  period = decodedObj.period as string
              const  floorId = parseInt(decodedObj.floorId as string)
              const  typeId = parseInt(decodedObj.typeId as string)
              const  statusId = parseInt(decodedObj.statusId as string)
              const  Floor = decodedObj.Floor as string
              const  Type = decodedObj.Type as string
              const  status = decodedObj.status as string
                const  accountName = decodedObj.accountName as string
                const fromDateFormat = new Date(fromDate)
                const toDateFormat = new Date(toDate)

                setQueries({...queries,fromDate: fromDate, toDate:toDate,cOAId,floorId:floorId ,typeId,statusId});
                setState({...state, ...decodedObj,cOAId ,fromDate: fromDateFormat, toDate:toDateFormat,period:period,accountName:accountName,floorId:floorId ,typeId,statusId,Floor,Type ,status});
              if(Floor  || Type || status){
                setFilters({Floor:Floor,Type:Type,status:status})
              }
                else{
                    setFilters({})
                }
            }

        }
        else{
            setQueries({fromDate:fromDate,toDate:toDate})
        }

        return () => {
            isActive = false;
        }
    }, [query_filter])


    // pdf print

    const clearAll = () => {
        router.replace(`?query_filter=${encodeParameters({fromDate: queries?.fromDate,toDate: queries?.toDate,cOAId:null,period:state?.period,})}`);
    };

    const handlePrint = async (fromPdf = false) => {
      const options:any = {
        resolution:  2,
        filename: `General-Ledger-Summary.pdf`,
        margin: 10,
        page: {

          format: visibleColumns.length > 4 ?'letter':"A4",
          margin: Margin.SMALL,
          orientation : visibleColumns.length > 4 ? "landscape" : "portrait",
        },
      };

        await new Promise(resolve => setTimeout(resolve, totalRowsPdf ? totalRowsPdf < 100 ? 2000 : totalRowsPdf < 200 ? 4000 : totalRowsPdf < 425 ? 6000 : 20000 : 2000));
        const generatePdf = await generatePDF(targetRef, options);

        setLoadingPdf(false);
        setPdfData([]);

        if (!fromPdf && generatePdf && generatePdf.output) {

            let blob = generatePdf.output('bloburl');
            let printWindow: any = window.open(blob, '_blank');

            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                    URL.revokeObjectURL(blob.toString());
                };
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            setPdfData([]);
            setLoadingPdfPrint(false);
        } else {
            console.error("generatePdf  is undefined.");
        }

    }

    //** reset Button
    const handleReset = ():any => {

        router.replace({
            pathname: "/reports/sales-reports/pending-installment-report/",

        });

        setQueries({
            fromDate: fromDate,
            toDate: toDate
        });
        setFilters({})
    };

    const onPaginationModelChange = (model: any) => {


      if (paginationModel.pageSize !== model.pageSize) {
        // Reset to the first page if page size changes
        model.page = 0;
        setPaginationModel({
          ...model,
          page: 0,
          after: null,
          before: null,
          first: model.pageSize,
          last: null,
        });
        } else {
            if (paginationModel.page > model.page) {
                // Backward pagination (previous page)

                setPaginationModel({
                    ...model,
                    before: dataWithPagination?.installmentsSummaryData?.pageInfo?.startCursor,
                    after: null,
                    last: paginationModel.pageSize,
                    first:null,
                });
            } else {
                // Forward pagination (next page)
                setPaginationModel({
                    ...model,
                    after: dataWithPagination?.installmentsSummaryData?.pageInfo?.endCursor,
                    before: null,
                    first: paginationModel.pageSize,  // Use 'first' for forward pagination
                });
            }
        }
    };

    const updateQueries = () => {
      const formattedFromDate = state?.fromDate ? moment(state.fromDate).format('YYYY-MM-DD') : fromDate;
      const formattedToDate = state?.toDate ? moment(state.toDate).format('YYYY-MM-DD') : toDate;
      if (shouldFetch) {
        refetch({
          model: {
            floorId:state.floorId,
            typeId:state.typeId,
            statusId:state.statusId,
            fromDate: formattedFromDate,
            toDate: formattedToDate,
          },

        });
      } else {
        setShouldFetch(true);
      }


        router.replace(`?query_filter=${encodeParameters({

            fromDate: formattedFromDate,
            toDate: formattedToDate,
            period:state?.period,
          Floor:state.Floor,
          Type:state.Type,
          status:state.status,
          typeId:state.typeId,
          statusId:state.statusId,
          floorId:state.floorId,

        })}`)
    };

    const toggleFilter = () => {
        setOpenFilter(!openFilter);
    }

    const { loading:loadingData, error: errorWithPagination, data: dataWithPagination,refetch } =
        useQuery( GET_PROPERTY_WISE_REPORT, {
            variables: {
              model:{
                fromDate:  formatDateFields(queries?.fromDate),
                toDate:  formatDateFields(queries?.toDate),
                floorId:queries?.floorId??null,
                statusId:queries?.statusId??null,
                typeId:queries?.typeId??null,

              },


            },
          fetchPolicy: 'no-cache',
            skip:!queries?.fromDate

        } as QueryHookOptions);

  useEffect(() => {
    if (!dataWithPagination?.installmentsSummaryData?.nodes) return;

    // Fixed columns
    const fixedColumns = [
      { columnName: 'propertyNo', columnTitle: t("Property No"), isVisible: true, sortNo: 2, isAlignRight: false, clickable: false, formatedName: null, width: 250 },
      { columnName: 'customerName', columnTitle: t("Customer Name"), isVisible: true, sortNo: 2, isAlignRight: false, clickable: false, formatedName: null, width: 250 },
      { columnName: 'propertyStatus', columnTitle: t("Status"), isVisible: true, sortNo: 7, isAlignRight: false, clickable: false, formatedName: null, width: 150 },
      { columnName: 'floorName', columnTitle: t("Floor/Block"), isVisible: true, sortNo: 7, isAlignRight: false, clickable: false, formatedName: null, width: 150 }
    ];

    // Extract unique months across all data
    const monthSet = new Set<string>();
    dataWithPagination?.installmentsSummaryData?.nodes.forEach((customer:any) => {
      customer.monthWiseAmounts?.forEach((m: any) => monthSet.add(m.monthYear));
    });

    // Month columns
    const monthColumns = Array.from(monthSet).sort().map(month => ({
      columnName: month,       // column name = month, e.g., "11-2025"
      columnTitle: month,      // column title
      isVisible: true,
      sortNo: 10,
      isAlignRight: true,
      clickable: false,
      width: 140
    }));

    // Total column at the end
    const totalColumn = {
      columnName: 'totalPending',
      columnTitle: t("Total Pending"),
      isVisible: true,
      sortNo: 11,
      isAlignRight: true,
      clickable: false,
      width: 160
    };

    setColumns([...fixedColumns, ...monthColumns, totalColumn]);

    // Prepare rows
    const flattened: any[] = [];
    dataWithPagination?.installmentsSummaryData?.nodes.forEach((customer:any) => {
      const row: any = {
        type: 'summary',
        agreeId: `summary-${customer.agreeId}`,
        propertyNo: customer.propertyNo,
        customerName: customer.customerName,
        propertyStatus: customer.propertyStatus,
        floorName: customer.floorName,
        totalPending: customer.monthWiseAmounts?.reduce(
          (sum: number, m: any) => sum + m.totalPendingAmount,
          0
        )
      };

      // Add each month as a separate field
      customer.monthWiseAmounts?.forEach((m: any) => {
        row[m.monthYear] = m.totalPendingAmount;
      });

      flattened.push(row);
    });

    setRows(flattened);

  }, [dataWithPagination?.installmentsSummaryData?.nodes]);




    const fetchData = async (exportType: string, fromPdf = false) => {
        try {
            if (fromPdf) {
                setLoadingPdf(true);
            }

            setTotalRowsPdf(rows?.length??0)
            const filteredColumns: any = columns.filter((col: any) => {
                return rows.some((row: any) => row[col.columnName] !== null && row[col.columnName] !== undefined);
            });

            if (exportType === 'pdf') {
            setLoadingPdf(false)
              return rows

            } else if (exportType === 'excel') {
                setLoadingExcel(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                exportToExcel("",rows, filteredColumns, t("Property Wise Pending Report"), (`${user?.tenantDetails[((user?.tenantDetails ?? []).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName ?? "No Name"}`), `${formatDate(new Date(queries?.fromDate ?? '2023-12-01'))} - ${formatDate(new Date(queries?.toDate ?? '2023-12-01'))}`);
                setLoadingExcel(false);
            } else if (exportType === 'print') {
                setLoadingPdfPrint(true);
                setLoadingPdfPrint(false);
               return rows

            }
        } catch (error) {
            console.error('Error refetch data', error);
        }
    };

    return (
      <Box sx={{p: theme => theme.spacing(2,3), height: 'calc(100vh - 56px)', overflow: 'hidden'}}>
            <DatePickerWrapper>
                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <ActionBar
                          selected_columns={visibleColumns}
                          title={`${user?.tenantDetails[((user?.tenantDetails ?? []).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName ?? "No Name"}`}
                          data={dataWithPagination?.installmentsSummaryData?.nodes ?? []} queries={queries} loadingPdfPrint={loadingPdfPrint}  loadingExcel={loadingExcel} state={state} handlePrint={handlePrint} handleBackClick={handleBackClick} loadingPdf={loadingPdf} setState={setState}
                                   toggleFilter={toggleFilter} fetchData={fetchData} updateQueries={updateQueries}/>
                    </Grid>
                    {loadingData || !queries?.fromDate? (
                        <Grid item lg={12} md={12} sm={12} xs={12}
                              sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Spinner/>
                        </Grid>
                    ) : (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <MonthWisePending queries={queries}
                                               selected_columns={columns}
                                               state={state} data={rows}
                                               totalRows={dataWithPagination?.installmentsSummaryData?.totalCount ?? 0}
                                               paginationModel={paginationModel}
                                               setPaginationModel={onPaginationModelChange}
                                               filters={filters}
                                               clearAll={clearAll}
                                               setState={setState}
                                               updateQueries={updateQueries}
                                               handleReset={handleReset}
                            />
                        </Grid>
                    )}
                </Grid>
            </DatePickerWrapper>

            {
                openFilter &&
                <FilterDrawer handleReset={handleReset} open={openFilter}
                              toggle={toggleFilter} setState={setState} state={state}  queries={queries}
                              updateQueries={updateQueries}/>
            }


        </Box>
    )
}
      MonthWisePendingReport.contentHeightFixed = true;
      MonthWisePendingReport.acl = {
        action:"read",
        subject: 'SaleAgreement'
      }

export default MonthWisePendingReport;
