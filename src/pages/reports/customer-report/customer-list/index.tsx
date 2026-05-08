// ** React imports
import React, {useEffect, useState} from 'react';

// ** MUI imports
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// ** Third party imports
import moment from 'moment';
//@ts-ignore
import dateFormat from 'dateformat';
// ** Hooks
import {useAuth} from "src/hooks/useAuth";
import {useRouter} from "next/router";

// ** Styled Components
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'

// ** Custom imports
import ActionBar from "src/views/reports/customer-reports/customer-list/ActionBar";
import FilterDrawer from "src/views/reports/customer-reports/customer-list/filter";
import CustomerListReport from "src/views/reports/customer-reports/customer-list/CustomerListReport";

// ** Utils
import { formatDate, formatDateFields, getDateRangeByFilter, globalSendDateFormat } from 'src/core/utils/format'
import Spinner from 'src/core/components/spinner';
import exportToExcel from "src/core/utils/exportxlsx";

// ** Types
import {GET_CUSTOMER_LIST, } from "src/graphql/customer-reports/CustomerList";

import {LazyQueryHookOptions, QueryHookOptions, useLazyQuery, useQuery} from "@apollo/client";

// ** Pdf Export
import generatePDF, {Margin, Resolution, usePDF} from "react-to-pdf";

// ** Utils

import {decodeParameters, encodeParameters} from "src/core/utils/encrypted-params";
import {useTranslation} from "react-i18next";



const CustomerListSummary = () => {
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

    const [state, setState] = useState<any>({});

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

  const [columns, setColumns] = useState<any>([
    // 🕓 Sale Information
    { columnName: 'firstName', columnTitle: t("Name"), isVisible: true, sortNo: 1, isAlignRight: false, clickable: false, formatedName: null },
    { columnName: 'customerType', columnTitle: t("Customer Type"), isVisible: true, sortNo: 2, isAlignRight: false, clickable: false, formatedName: null },
    { columnName: 'identityNo', columnTitle: t("Identity No "), isVisible: true, sortNo: 3, isAlignRight: false, clickable: false, formatedName: null },
    { columnName: 'guardianName', columnTitle: t("Father/Husband"), isVisible: true, sortNo: 4, isAlignRight: false, clickable: false, formatedName: null },
    { columnName: 'phone1', columnTitle: t("Contact"), isVisible: true, sortNo: 5, isAlignRight: false, clickable: false, formatedName: null },
    // 👤 Customer Details
    { columnName: 'permAddress', columnTitle: t("Customer Address"), isVisible: true, sortNo: 6, isAlignRight: false, clickable: false, formatedName: null },
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
                const  customerId = parseInt(decodedObj.customerId as string)
                const  fromDate = decodedObj.fromDate as string
                const  toDate = decodedObj.toDate as string
                const  period = decodedObj.period as string
                const  accountName = decodedObj.accountName as string
              const fromDateFormat =fromDate ? new Date(fromDate):null
              const toDateFormat =toDate? new Date(toDate):null


                setQueries({...queries,customerId,fromDate:fromDateFormat,toDate:toDateFormat });
                setState({...state, ...decodedObj,customerId ,fromDate: fromDateFormat, toDate:toDateFormat,period:period,accountName:accountName });
                if(accountName){
                    setFilters({accountName:accountName})
                }
                else{
                    setFilters({})
                }
            }

        }
        else{
            setQueries({fromDate:state?.fromDate,toDate:state?.toDate})
        }

        return () => {
            isActive = false;
        }
    }, [query_filter])


    // pdf print

    const clearAll = () => {
        router.replace(`?query_filter=${encodeParameters({})}`);
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
            pathname: "/reports/customer-report/customer-list/",

        });

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
                    before: dataWithPagination?.customerDetailList?.pageInfo?.startCursor,
                    after: null,
                    last: paginationModel.pageSize,
                    first:null,
                });
            } else {
                // Forward pagination (next page)
                setPaginationModel({
                    ...model,
                    after: dataWithPagination?.customerDetailList?.pageInfo?.endCursor,
                    before: null,
                    first: paginationModel.pageSize,  // Use 'first' for forward pagination
                });
            }
        }
    };

    const updateQueries = () => {
      const formattedFromDate = state?.fromDate ? moment(state.fromDate).format('YYYY-MM-DD') : null;
      const formattedToDate = state?.toDate ? moment(state.toDate).format('YYYY-MM-DD') : null;
        router.replace(`?query_filter=${encodeParameters({

          fromDate: formattedFromDate,
          toDate: formattedToDate,
          period:state?.period,
          customerId :state?.customerId,


        })}`)
    };

    const toggleFilter = () => {
        setOpenFilter(!openFilter);
    }

    const { loading:loadingData, error: errorWithPagination, data: dataWithPagination  } =
        useQuery( GET_CUSTOMER_LIST, {
            variables: {
              model:{

                fromDate: queries?.fromDate? formatDateFields(queries?.fromDate):null,
                toDate: queries?.toDate? formatDateFields(queries?.toDate):null,
                customerId:queries?.customerId
              },

            },
          fetchPolicy: 'no-cache',

        } as QueryHookOptions);


    // total Data**
    const  sumData=dataWithPagination?.customerDetailListSum ?? []

    const [fetchDataWithoutPagination, { data:datawithOutPagination ,  loading,error,  }]:any
        = useLazyQuery(
        GET_CUSTOMER_LIST,
        {
            variables: { searchVm: queries,lang:lang}
        } as LazyQueryHookOptions);



    const fetchData = async (exportType: string, fromPdf = false) => {
        try {
            if (fromPdf) {
                setLoadingPdf(true);
            }

            const { data } = await fetchDataWithoutPagination();



            if(error){
                console.error(error,"data not found")
            }
            const rows =  data?.customerDetailList?.nodes ?? [];

            const sumRow = { ...sumData[0], cOAId: -100, name: "Total", clickable: false , sortNo:1, isTotalRowBold: true};
            const updatedData = rows.length ? [...rows, sumRow] : rows;

            const totalCount = updatedData.length ?? 0;
            setTotalRowsPdf(totalCount)
            const filteredColumns: any = columns.filter((col: any) => {
                return rows.some((row: any) => row[col.columnName] !== null && row[col.columnName] !== undefined);
            });

            if (exportType === 'pdf') {
            setLoadingPdf(false)
              return updatedData

            } else if (exportType === 'excel') {
                setLoadingExcel(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                exportToExcel("",rows, filteredColumns, t("General-Ledger-Summary"), (`${user?.tenantDetails[((user?.tenantDetails ?? []).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName ?? "No Name"}`), `${formatDate(new Date(queries?.fromDate ?? '2023-12-01'))} - ${formatDate(new Date(queries?.toDate ?? '2023-12-01'))}`);
                setLoadingExcel(false);
            } else if (exportType === 'print') {
                setLoadingPdfPrint(true);
                setLoadingPdfPrint(false);
               return updatedData

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
                          data={dataWithPagination?.customerDetailList?.nodes ?? []} queries={queries} loadingPdfPrint={loadingPdfPrint}  loadingExcel={loadingExcel} state={state} handlePrint={handlePrint} handleBackClick={handleBackClick} loadingPdf={loadingPdf} setState={setState}
                                   toggleFilter={toggleFilter} fetchData={fetchData} updateQueries={updateQueries}/>
                    </Grid>
                    {loadingData ? (
                        <Grid item lg={12} md={12} sm={12} xs={12}
                              sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Spinner/>
                        </Grid>
                    ) : (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <CustomerListReport sumData={sumData} queries={queries}
                                                selected_columns={columns.sort((a: any, b: any) => a.sortNo - b.sortNo)}
                                                state={state} data={dataWithPagination?.customerDetailList?.nodes ?? []}
                                                totalRows={dataWithPagination?.customerDetailList?.totalCount ?? 0}
                                                paginationModel={paginationModel}
                                                setPaginationModel={onPaginationModelChange}
                                                filters={filters}
                                                clearAll={clearAll}
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
      CustomerListSummary.contentHeightFixed = true;
      CustomerListSummary.acl = {
        action:"read",
        subject: 'SaleAgreement'
      }

export default CustomerListSummary;
