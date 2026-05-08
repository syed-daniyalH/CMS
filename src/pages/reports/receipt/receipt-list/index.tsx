// ** React imports
import React, {useEffect, useState} from 'react';

// ** MUI imports
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

// ** Third party imports


// ** Hooks
import {useAuth} from "src/hooks/useAuth";
import {useRouter} from "next/router";

// ** Styled Components
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'

// ** Custom imports
import ActionBar from "src/views/reports/receipt/receipt-list/ActionBar";
import FilterDrawer from "src/views/reports/receipt/receipt-list/filter";
import ReceiptListReport from "src/views/reports/receipt/receipt-list/ReceiptListReport";

// ** Utils
import {  getDateRangeByFilter } from 'src/core/utils/format'
import Spinner from 'src/core/components/spinner';
import exportToExcel from "src/core/utils/exportxlsx";

// ** Types
import {GET_RECEIPT_LIST} from "src/graphql/receipts/ReceiptList";

import {LazyQueryHookOptions, QueryHookOptions, useLazyQuery, useQuery} from "@apollo/client";

// ** Pdf Export
import generatePDF, {Margin, Resolution, usePDF} from "react-to-pdf";

// ** Utils

import {decodeParameters, encodeParameters} from "src/core/utils/encrypted-params";
import {useTranslation} from "react-i18next";


const PropertyListSummary = () => {
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
    { columnName: 'rno', columnTitle: t("Receipt#"), isVisible: true, sortNo: 1, isAlignRight: false, clickable: false, formatedName: null,width: 120, },
    { columnName: 'date', columnTitle: t("Date"), isVisible: true, sortNo: 2, isAlignRight: false, clickable: false, formatedName: null,width: 140 },
    { columnName: 'propertyNo', columnTitle: t("Property No"), isVisible: true, sortNo: 3, isAlignRight: false, clickable: false, formatedName: null,width: 110 },
    { columnName: 'floorName', columnTitle: t("Block/Floor"), isVisible: true, sortNo: 4, isAlignRight: false, clickable: false, formatedName: null,width: 140 },
    { columnName: 'propertyType', columnTitle: t("Type"), isVisible: true, sortNo: 5, isAlignRight: false, clickable: false, formatedName: null,width: 120 },
    { columnName: 'customerName', columnTitle: t("Customer"), isVisible: true, sortNo: 6, isAlignRight: false, clickable: false, formatedName: null,width: 140 },
    { columnName: 'customerIdentityNo', columnTitle: t("Identity No"), isVisible: true, sortNo: 6, isAlignRight: false, clickable: false, formatedName: null,width: 140 },

    { columnName: 'instellmentType', columnTitle: t("Install. Type"), isVisible: true, sortNo: 6, isAlignRight: false, clickable: false, formatedName: null,width: 120 },

    { columnName: 'paymentMode', columnTitle: t("Source"), isVisible: true, sortNo: 7, isAlignRight: false, clickable: false, formatedName: null,width: 140 },
    { columnName: 'isRealized', columnTitle: t("Reference"), isVisible: true, sortNo: 7, isAlignRight: false, clickable: false, formatedName: null,width: 140 },
    { columnName: 'typeAmount', columnTitle: t("Amount"), isVisible: true, sortNo: 12, isAlignRight: true, clickable: false, formatedName: null,width: 140 },

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
                const  floorId = parseInt(decodedObj.floorId as string)
                const  customerId = parseInt(decodedObj.floorId as string)
                const  Floor = decodedObj.Floor as string

                const  customerName = decodedObj.customerName as string

                setQueries({floorId ,customerId});
                setState({...state, ...decodedObj,floorId, customerId,Floor:Floor ,customerName:customerName,});
                if(Floor    ||customerName){
                    setFilters({Floor:Floor,customerName:customerName})
                }
                else{
                    setFilters({})
                }
            }

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
  const handleReset = () => {
    router.replace(
      {
        pathname: "/reports/sales-reports/property-list/",
        query: {},
      },
      undefined,
      { shallow: true } // optional: prevents full reload
    );
    setState({})
    setQueries({  })
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
                    before: dataWithPagination?.recepitDetailList?.pageInfo?.startCursor,
                    after: null,
                    last: paginationModel.pageSize,
                    first:null,
                });
            } else {
                // Forward pagination (next page)
                setPaginationModel({
                    ...model,
                    after: dataWithPagination?.recepitDetailList?.pageInfo?.endCursor,
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
            floorId:state.floorId,
            customerId:state.customerId,


          },
          first: paginationModel.first || null,
          last: paginationModel.last || null,
          after: paginationModel.after || null,
          before: paginationModel.before || null,
        });
      } else {
        setShouldFetch(true); // first mount → allow future calls
      }
        router.replace(`?query_filter=${encodeParameters({

          floorId:state.floorId,
          customerId:state.customerId,
          Floor:state.Floor,
          Type:state.Type,
          customerName:state.customerName,


        })}`)
    };

    const toggleFilter = () => {
        setOpenFilter(!openFilter);
    }

    const { loading:loadingData, error: errorWithPagination, data: dataWithPagination,refetch  } =
        useQuery( GET_RECEIPT_LIST, {
            variables: {
              model:queries,
                first: paginationModel.first || null,
                last: paginationModel.last || null,
                after: paginationModel.after || null,
                before: paginationModel.before || null,
            },
          fetchPolicy: 'no-cache',


        } as QueryHookOptions);

    // total Data**
    const  sumData=dataWithPagination?.recepitDetailListSum ?? []

    const [fetchDataWithoutPagination, { data:datawithOutPagination ,  loading,error,  }]:any
        = useLazyQuery(
        GET_RECEIPT_LIST,
        {
          variables: {
            model:queries,
          },
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
            const rows =  data?.recepitDetailList?.nodes ?? [];

             const sumAmount = rows?.reduce ((acc:any,curr:any)=>acc+ (curr?.typeAmount??0),0)

            const sumRow = { typeAmount:sumAmount,  rno: "Total", clickable: false , sortNo:1, isTotalRowBold: true};
            const updatedData = rows.length ? [...rows, sumRow] : rows;

            const totalCount = rows.length ?? 0;
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
                exportToExcel("",updatedData, filteredColumns, t("Inventory Report"), (`${user?.tenantDetails[((user?.tenantDetails ?? []).findIndex(e => e.tenantId === user?.loginTenantId))]?.organizationName ?? "No Name"}`), ``);
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
                          data={dataWithPagination?.recepitDetailList?.nodes ?? []} queries={queries} loadingPdfPrint={loadingPdfPrint}  loadingExcel={loadingExcel} state={state} handlePrint={handlePrint} handleBackClick={handleBackClick} loadingPdf={loadingPdf} setState={setState}
                                   toggleFilter={toggleFilter} fetchData={fetchData} updateQueries={updateQueries}/>
                    </Grid>
                    {loadingData ? (
                        <Grid item lg={12} md={12} sm={12} xs={12}
                              sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Spinner/>
                        </Grid>
                    ) : (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <ReceiptListReport sumData={sumData} queries={queries}
                                               selected_columns={columns.sort((a: any, b: any) => a.sortNo - b.sortNo)}
                                               state={state} data={dataWithPagination?.recepitDetailList?.nodes ?? []}
                                               totalRows={dataWithPagination?.recepitDetailList?.totalCount ?? 0}
                                               paginationModel={paginationModel}
                                               setPaginationModel={onPaginationModelChange}
                                               filters={filters}
                                               clearAll={clearAll}
                                                updateQueries={updateQueries}
                                                setState={setState}
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
      PropertyListSummary.contentHeightFixed = true;
      PropertyListSummary.acl = {
        action:"read",
        subject: 'SaleAgreement'
      }

export default PropertyListSummary;
