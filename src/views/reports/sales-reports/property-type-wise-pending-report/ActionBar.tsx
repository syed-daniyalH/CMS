// ** React Imports
import React from "react";

// ** MUI Imports
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

//** Third Party Imports
import {useTranslation} from "react-i18next";

// ** Types Imports


// ** Hooks
import {useAuth} from "src/hooks/useAuth";

// ** Utils Imports
import {getDateRangeByFilter} from "src/@core/utils/format";

// ** Custom imports
import DateSelector from "src/@core/dropdowns/date";
import Icon from "src/@core/components/icon";
import CustomStartPicker from "src/@core/components/custom-picker/StartDatePicker";
import CustomEndPicker from "src/@core/components/custom-picker/EndDatePicker";
// import DetailAccountSelector from "src/@core/dropdowns/accounts";
import {exportPDFReport} from "src/@core/components/export/autotable-pdf";
import {PropertypeWisePending} from "src/@core/utils/form-types";

interface Props {
    loadingPdf: boolean
    state: any
    toggleFilter : () => void
    handleBackClick : () => void
    handlePrint : (value:boolean) => void
    setState: (value: any) => void
    updateQueries: (value: any) => void
    fetchData: any
    loadingPdfPrint:boolean
    loadingExcel:boolean
    queries:any
    data:any
}

const ActionBar = ({data,state, handlePrint,queries, setState,handleBackClick, toggleFilter, updateQueries, fetchData, loadingPdf, loadingPdfPrint, loadingExcel,title,selected_columns}:any) => {

    // ** Hook
    const {t} = useTranslation();
    const {user} = useAuth();

    const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

    const onChangeEnd = (end: any) => {
        setState((prevState:any) => ({
            ...prevState,
            toDate: end
        }));
    }

    const onChangeStart = (start: any) => {

        setState((prevState:any) => ({
            ...prevState,
            fromDate: start
        }));
    }

    const onChangePeriod = (value:any) => {
        let {fromDate, toDate} = getDateRangeByFilter(value?.value||"month", user);
        setState({...state, fromDate, toDate, period: value?.value})
    }


  const handlePrintClick = async (value: boolean) => {
    const data = await fetchData(value ? 'pdf' : 'print', value);
    exportPDFReport({data, columns: selected_columns,title:"Property Type Wise Installment",dateRange:{fromDate:queries?.fromDate,toDate:queries?.toDate}, organizationName:title, download: value,   reportName:PropertypeWisePending});
  };


    return (

        <Card  >
            <CardHeader
              style={{paddingBottom:0}}
                sx={{p: theme => theme.spacing(2,2)}}
                title={
                    smallScreen ? null :
                    <Stack sx={{flexWrap: 'wrap'}}   direction={'row'} spacing={2}>
                        <Box sx={{width: '200px', mb: 2 }}>
                            <DateSelector selected={state.period} placeholder={t("Select Date")} size='small' onChange={onChangePeriod} />
                        </Box>
                        {
                            state?.period === "custom" &&
                            <Box sx={{display:"flex",flexDirection: 'row',gap: '8px', width:"30%" }}>

                                <CustomStartPicker   startDate={queries.fromDate}  placeholder="From Date" onChange={onChangeStart}
                                />
                                <CustomEndPicker  placeholder="To Date"  onChange={onChangeEnd}
                                                  endDate={queries.toDate}/>
                            </Box>
                        }


                        <Box >
                            <Button   variant='tonal' color='success' size='medium' onClick={updateQueries}>
                                {t("Run Report")}
                            </Button>
                        </Box>
                    </Stack>
                }

              action={
                <Stack sx={{flexWrap: 'wrap'}} direction={'row'} spacing={1}>
                  <Tooltip title={t("Download PDF")}>

                    {
                      loadingPdf ?
                        <IconButton size={'small'} aria-label='download pdf'>
                          <CircularProgress color='primary' size={'1.4rem'}/>
                        </IconButton>
                        : <IconButton size={'small'} aria-label='download pdf' sx={{
                          ':hover': {
                            color: 'red'
                          }
                        }} disabled={!data.length} onClick={() => handlePrintClick(true)}>
                          <Icon icon='tabler:file-type-pdf'/>
                        </IconButton>
                    }
                  </Tooltip>

                  <Tooltip title={t("Download Excel")}>
                    {loadingExcel ?
                      <IconButton size={'small'} aria-label='download pdf'>
                        <CircularProgress color='primary' size={'1.4rem'}/>
                      </IconButton>
                      : <IconButton size={'small'} aria-label='download Excel' onClick={(e) => fetchData("excel", false)} sx={{
                        ':hover': {
                          color: 'green'
                        }
                      }} disabled={!data.length}>
                        <Icon icon='tabler:file-spreadsheet'/>
                      </IconButton>
                    }
                  </Tooltip>

                  <Tooltip title={t("Print")}>
                    {
                      loadingPdfPrint ?
                        <IconButton size={'small'} aria-label='download pdf'>
                          <CircularProgress color='primary' size={'1.4rem'}/>
                        </IconButton>
                        : <IconButton size={'small'} aria-label='print' onClick={() => handlePrintClick(false)} sx={{
                          ':hover': {
                            color: '#312e2e'
                          }
                        }} disabled={!data.length}>
                          <Icon icon='tabler:printer'/>
                        </IconButton>
                    }
                  </Tooltip>

                  {smallScreen ?
                    <IconButton aria-label='customization' onClick={(e) => toggleFilter()} sx={{
                      ':hover': {
                        color: 'green'
                      }
                    }}>
                      <Icon icon='tabler:adjustments'/>
                    </IconButton> :
                    <Button variant='outlined' color='warning' size='small'
                            startIcon={<Icon icon={'tabler:adjustments'} fontSize='1.2rem'/>} onClick={(e) => toggleFilter()}>
                      {t("Customize")}
                    </Button>
                  }

                  <Tooltip title={t("Exit (esc)")}>
                    <IconButton aria-label='Exit' onClick={handleBackClick} sx={{
                      p: '0.375rem',
                      borderRadius: 1,
                      color: 'text.primary',
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
                      }
                    }}>
                      <Icon icon='tabler:x'/>
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />
        </Card>
    )
}


export default ActionBar;
