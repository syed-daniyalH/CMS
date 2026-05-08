// ** React Imports
import {Fragment, SyntheticEvent, useEffect, useState} from 'react'

// ** MUI Import
import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import axios from 'axios'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import {useTranslation} from "react-i18next";

interface DateType {
    value: string
    text: string
}

const DateSelector = ({...props}) => {

    // ** States
    const {t} = useTranslation();
    const [open, setOpen] = useState<boolean>(false)
    const [options, setOptions] = useState<DateType[]>([])
    const [selectedPeriod, setSelectedPeriod] = useState<DateType | null>(null)

    const loading = open && options.length === 0

    const handleChange = (event: SyntheticEvent, value: DateType | null ) => {
        if(props.onChange) {
            props.onChange(value);
        }
    }

    useEffect(() => {
        let isActive = true;

        if(isActive && props.selected && options.length && selectedPeriod?.value !== props.selected) {
            for(let i = 0; i < options.length; i++) {
                if(options[i].value === props.selected) {
                    setSelectedPeriod(options[i]);
                    break;
                }
            }
        }
        else if(isActive && (props.selected === null || props.selected === undefined)){
            setSelectedPeriod({
                value: "month",
                text: "This Month"
            });
        }

        return () => {
            isActive = false;
        }
    }, [props.selected, options])
    
    useEffect(() => {
        let isActive = true;

        if(isActive) {
            setOptions([

                {
                    value: "today",
                    text: "Today"
                },
                {
                    value: "week",
                    text: "This Week"
                },
                {
                    value: "month",
                    text: "This Month"
                },
                {
                    value: "thisQuarter",
                    text: "This Quarter"
                },
                {
                    value: "thisYear",
                    text: "This Year"
                },
                {
                    value: "YearToDate",
                    text: "Year To Date"
                },
                {
                    value: "yesterday",
                    text: "Yesterday"
                },
                {
                    value: "previousWeek",
                    text: "Previous Week"
                },

                {
                    value: "LastMonth",
                    text: "Previous Month"
                },


                {
                    value: "previousQuarter",
                    text: "Previous Quarter"
                },   {
                    value: "previousYear",
                    text: "Previous Year"
                },
                {
                    value: "custom",
                    text: "Custom"
                }
            ])
        }
        return () => {
            isActive = false;
        }
    }, [])

    return (
        <CustomAutocomplete
            open={open}
            options={options}
            loading={loading}
            value={selectedPeriod}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            id='autocomplete-asynchronous-request-global'
            getOptionLabel={(option : DateType) => t(option.text) || ''}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            onChange={handleChange}
            renderInput={params => (
                <CustomTextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? <CircularProgress size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        )
                    }}
                    {...props}
                />
            )}
        />
    )
}

export default DateSelector;
