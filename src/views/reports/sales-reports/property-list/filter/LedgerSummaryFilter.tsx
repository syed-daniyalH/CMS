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
import FloorSelector from '../../../../../@core/dropdown-selectors/FloorSelector'
import Stack from '@mui/material/Stack'
import PreferenceSelector from '../../../../../@core/dropdown-selectors/PreferenceSelector'
import PropertyTypeSelector from '../../../../../@core/dropdown-selectors/PropertyTypeSelector'
import PropertyStatusSelector from '../../../../../@core/dropdown-selectors/PropertyStatusSelector'

interface Props {
    state: any
    setState: (value: any) => void
    open: boolean
    queries: any
}

const LedgerSummaryFilter = ({queries,state, setState,open}:Props) => {

    const {t} = useTranslation();

    const {user} = useAuth();

    const onChangeEnd = (end: any) => {
        setState({...state,  toDate: end})
    }
    const onChangeStart = (start: any) => {
        setState({...state, fromDate: start})
    }

    const onChangePeriod = (value:any) => {
        let {fromDate, toDate} = getDateRangeByFilter(value?.value, user);
        setState({...state, fromDate, toDate, period: value?.value})
    }
  const handleFloor = (updated: any) => {


    setState({...state,floorId:updated?.value,Floor:updated?.text})
  }
  const handlePrefrence = (updated: any) => {

    setState({...state,prefrenceId:updated?.value,Prefrences:updated?.text})
  }
  const handlePropertyType = (updated: any) => {

    setState({...state,propertyTypeId:updated?.value,Type:updated?.text})
  }
  const handlePropertyStatus = (updated: any) => {

    setState({...state,statusId:updated?.value,status:updated?.text})
  }
    return (
        <DatePickerWrapper>
            <Grid container spacing={4}>


                <Grid item lg={6} md={6} xs={12} sm={12}>
                  <FloorSelector selected_value={state.floorId??null} handleChange={handleFloor} props={{sx: {mb: 0},  }} />
            </Grid>

              <Grid item lg={6} md={6} xs={12} sm={12}>
                  <PreferenceSelector selected_value={state.prefrenceId??null} handleChange={handlePrefrence} props={{sx: {mb: 0},  }} />
            </Grid>

              <Grid item lg={6} md={6} xs={12} sm={12}>
                  <PropertyTypeSelector selected_value={state.propertyTypeId??null} handleChange={handlePropertyType} props={{sx: {mb: 0},  }} />
            </Grid>
              <Grid item lg={6} md={6} xs={12} sm={12}>
                  <PropertyStatusSelector selected_value={state.statusId??null} handleChange={handlePropertyStatus} props={{sx: {mb: 0},  }} />
            </Grid>


            </Grid>
        </DatePickerWrapper>
    )
}

export default LedgerSummaryFilter
