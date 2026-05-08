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
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'

// ** Custom imports
import ActionBar from "src/views/reports/transfer-property/transfer-property-summary/ActionBar";
import FilterDrawer from "src/views/reports/transfer-property/transfer-property-summary/filter";
import TransferPropertySummaryReport from "src/views/reports/transfer-property/transfer-property-summary/TransferPropertySummaryReport";

// ** Utils
import { formatDate, formatDateFields, getDateRangeByFilter } from 'src/core/utils/format'
import Spinner from 'src/core/components/spinner';
import exportToExcel from "src/core/utils/exportxlsx";

// ** Types
import {GET_TRANSFER_PROPERTY, } from "src/graphql/transfer-property/TransferProperty";

import {LazyQueryHookOptions, QueryHookOptions, useLazyQuery, useQuery} from "@apollo/client";

// ** Pdf Export
import generatePDF, {Margin, Resolution, usePDF} from "react-to-pdf";

// ** Utils

import {decodeParameters, encodeParameters} from "src/core/utils/encrypted-params";
import {useTranslation} from "react-i18next";

const ExpectedIncomeReport = () => {
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
    const [state, setState] = useState<any>({});

    //** token
    const [queries, setQueries] = useState<any>({

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

  const [columns, setColumns] = useState<any>([
    // 🕓 Sale Information
    { columnName: 'monthYear', columnTitle: t("Date Of Sale"), isVisible: true, sortNo: 1, isAlignRight: false, clickable: false, formatedName: null,width: 120, },
    { columnName: 'noOfProp', columnTitle: t("No. of Properties"), isVisible: true, sortNo: 2, isAlignRight: true, clickable: false, formatedName: null,width: 150, },
    { columnName: 'totalAreaMarla', columnTitle: t("Area Marla"), isVisible: true, sortNo: 2, isAlignRight: true, clickable: false, formatedName: null,width: 150, },
    { columnName: 'totalAreaSqft', columnTitle: t("Area"), isVisible: true, sortNo: 3, isAlignRight: true, clickable: false, formatedName: null,width: 120, },
    { columnName: 'avgRatePerMarla', columnTitle: t("Average Rate"), isVisible: true, sortNo: 3, isAlignRight: true, clickable: false, formatedName: null,width: 160, },
    { columnName: 'totalDist', columnTitle: t("Total Discount"), isVisible: true, sortNo: 4, isAlignRight: true, clickable: false, formatedName: null,width: 180, },
    { columnName: 'totalSoldValue', columnTitle: t("Sale Value"), isVisible: true, sortNo: 5, isAlignRight: true, clickable: false, formatedName: null,width: 180, },
    { columnName: 'totalAgentComAmount', columnTitle: t("Agent Commission"), isVisible: true, sortNo: 6, isAlignRight: true, clickable: false, formatedName: null,width: 180, },
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
                const  propertyId = parseInt(decodedObj.propertyId as string)
                const  propertyName = decodedObj.propertyName as string


                setQueries({...queries,propertyId:propertyId});
                setState({...state, ...decodedObj,propertyId: propertyId});
              if(propertyName){
                setFilters({propertyName:propertyName})
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
            pathname: "/reports/sales-reports/month-wise-sale-summary/",

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
                    before: dataWithPagination?.propertyTransferDetail?.pageInfo?.startCursor,
                    after: null,
                    last: paginationModel.pageSize,
                    first:null,
                });
            } else {
                // Forward pagination (next page)
                setPaginationModel({
                    ...model,
                    after: dataWithPagination?.propertyTransferDetail?.pageInfo?.endCursor,
                    before: null,
                    first: paginationModel.pageSize,
                });
            }
        }
    };

    const updateQueries = () => {
      if (shouldFetch) {
        refetch({
          model: {
            propertyId:state.propertyId,

          },

        });
      } else {
        setShouldFetch(true);
      }

        router.replace(`?query_filter=${encodeParameters({

          propertyId:state.propertyId,

        })}`)
    };

    const toggleFilter = () => {
        setOpenFilter(!openFilter);
    }

    const { loading:loadingData, error: errorWithPagination, data: dataWithPagination,refetch } =
        useQuery( GET_TRANSFER_PROPERTY, {
            variables: {
              propertyId:queries?.propertyId,

            },
          fetchPolicy: 'no-cache',

           skip:!queries?.propertyId

        } as QueryHookOptions);



    const [fetchDataWithoutPagination, { data:datawithOutPagination ,  loading,error,  }]:any
        = useLazyQuery(
      GET_TRANSFER_PROPERTY,
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
            const rows =  data?.GET_TRANSFER_PROPERTY?.nodes ?? [];

            let  totalSoldValue = rows?.reduce((acc:any,curr:any)=>{return acc+(curr?.totalSoldValue)??0},0)
           let totalAgentComAmount = rows?.reduce((acc:any,curr:any)=>acc+(curr?.totalAgentComAmount)??0,0)
          let totalDist = rows?.reduce ((acc:number,curr:any)=>acc + (curr?.totalDist)??0,0)
          let noOfProp = rows?.reduce((acc:number,curr:any)=>acc+(curr?.noOfProp)??0,0)
            const sumRow = {noOfProp:noOfProp,totalDist:totalDist,totalSoldValue:totalSoldValue, agreeId: -999, monthYear: "Total", clickable: false , sortNo:1, isTotalRowBold: true,totalAgentComAmount:totalAgentComAmount};

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
                exportToExcel("",rows, filteredColumns, t("Monthly Sale Summary"), (`${user?.tenantDetails[((user?.tenantDetails ?? []).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName ?? "No Name"}`), `${formatDate(new Date(queries?.fromDate ?? '2023-12-01'))} - ${formatDate(new Date(queries?.toDate ?? '2023-12-01'))}`);
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
                          data={dataWithPagination?.propertyTransferDetail?.nodes ?? []} queries={queries} loadingPdfPrint={loadingPdfPrint}  loadingExcel={loadingExcel} state={state} handlePrint={handlePrint} handleBackClick={handleBackClick} loadingPdf={loadingPdf} setState={setState}
                                   toggleFilter={toggleFilter} fetchData={fetchData} updateQueries={updateQueries}/>
                    </Grid>
                    {loadingData ? (
                        <Grid item lg={12} md={12} sm={12} xs={12}
                              sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Spinner/>
                        </Grid>
                    ) : (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TransferPropertySummaryReport queries={queries}
                                               selected_columns={columns.sort((a: any, b: any) => a.sortNo - b.sortNo)}
                                               state={state} data={dataWithPagination?.propertyTransferDetail?.nodes ?? []}
                                               totalRows={dataWithPagination?.propertyTransferDetail?.totalCount ?? 0}
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
      ExpectedIncomeReport.contentHeightFixed = true;
      ExpectedIncomeReport.acl = {
        action:"read",
        subject: 'SaleAgreement'
      }

export default ExpectedIncomeReport;
