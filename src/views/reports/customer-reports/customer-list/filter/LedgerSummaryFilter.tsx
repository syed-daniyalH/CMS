// ** MUI Imports
import Grid from "@mui/material/Grid";


// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'


// ** Third party imports
import {useTranslation} from "react-i18next";

// ** Hooks
import {useAuth} from "src/hooks/useAuth";

//** Types


// ** Custom Components Imports
import DateSelector from "src/@core/dropdowns/date";
import {getDateRangeByFilter} from "src/@core/utils/format";
import {Typography} from "@mui/material";
// import DetailAccountSelector from "src/@core/dropdowns/accounts";
import Box from "@mui/material/Box";
import CustomStartPicker from "src/@core/components/custom-picker/StartDatePicker";
import CustomEndPicker from "src/@core/components/custom-picker/EndDatePicker";
import React from "react";
import CustomerSelector from '../../../../../@core/dropdown-selectors/CustomerSelector'

interface Props {
    state: any
    setState: (value: any) => void
    open: boolean
    queries: any
}

const LedgerSummaryFilter = ({queries,state, setState,open}:Props) => {

    const {t} = useTranslation();

    const {user} = useAuth();
  console.log(queries?.fromDate,"eendendendnd queries?.fromDate")
    const onChangeEnd = (end: any) => {
      console.log(end,"eendendendnd")
      if (end){
        setState({...state,  toDate: end})
      }

    }
    const onChangeStart = (start: any) => {
      if (start){

        setState({...state, fromDate: start})
      }

    }

    const onChangePeriod = (value:any) => {
        let {fromDate, toDate} = getDateRangeByFilter(value?.value, user);
        setState({...state, fromDate, toDate, period: value?.value})
    }
  const handleCustomer = (updated: any) => {

    setState({...state,customerId:updated?.customerId})
  }
    return (
        <DatePickerWrapper>
            <Grid container spacing={4}>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                    <Box sx={{display:"flex",flexDirection: 'row',gap: '8px', width:"100%" }}>
                        <CustomStartPicker

                            startDate={state.fromDate}
                            placeholder="From Date"
                            onChange={onChangeStart}
                        />
                        <CustomEndPicker

                            placeholder="To Date"
                            onChange={onChangeEnd}
                            endDate={state.toDate}
                        />
                    </Box>
                </Grid>

                <Grid item lg={6} md={6} xs={12} sm={12}>
                  <CustomerSelector selected_value={state?.customerId??null} handleChange={(value) => {
                    handleCustomer({customerId: value?.value});
                  }} props={{sx: {mb: 0}, label: null }} />
                </Grid>


            </Grid>
        </DatePickerWrapper>
    )
}

export default LedgerSummaryFilter
