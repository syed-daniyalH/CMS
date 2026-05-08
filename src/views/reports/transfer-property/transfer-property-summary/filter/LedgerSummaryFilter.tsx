// ** MUI Imports
import Grid from "@mui/material/Grid";


// ** Styled Components
import DatePickerWrapper from 'src/core/styles/libs/react-datepicker'


// ** Third party imports
import {useTranslation} from "react-i18next";

// ** Hooks
import {useAuth} from "src/hooks/useAuth";

//** Types


// ** Custom Components Imports
import DateSelector from "src/core/dropdowns/date";
import {getDateRangeByFilter} from "src/core/utils/format";

import Box from "@mui/material/Box";
import CustomStartPicker from "src/core/components/custom-picker/StartDatePicker";
import CustomEndPicker from "src/core/components/custom-picker/EndDatePicker";
import React from "react";
import FloorSelector from '../../../../../core/dropdown-selectors/FloorSelector'
import PropertyTypeSelector from '../../../../../core/dropdown-selectors/PropertyTypeSelector'
import PropertyStatusSelector from '../../../../../core/dropdown-selectors/PropertyStatusSelector'
import PropertyListSelector from '../../../../../core/dropdown-selectors/PropertyListSelector'

interface Props {
    state: any
    setState: (value: any) => void
    open: boolean
    queries: any
}

const LedgerSummaryFilter = ({queries,state, setState,open}:Props) => {

    const {t} = useTranslation();

    const {user} = useAuth();


    const handlePropertyList =(value:any)=>{


      setState({ ...state,propertyId:value?.value })
    }


    return (
        <DatePickerWrapper>
            <Grid container spacing={4}>

              <Grid item lg={6} md={6} xs={12} sm={12}>
                <PropertyListSelector selected_value={state.propertyTypeId??null} handleChange={handlePropertyList}  />
              </Grid>



            </Grid>
        </DatePickerWrapper>
    )
}

export default LedgerSummaryFilter
