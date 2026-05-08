// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {getDateRange} from "../utils/format";
import {useAuth} from "../../hooks/useAuth";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";


interface DropdownObj {
  name: string
  value: string
}

const frequencies: DropdownObj[] = [
  {
    name: "Week",
    value: "1-Week"
  },
  {
    name: "2 Weeks",
    value: "2-Week"
  },
  {
    name: "Month",
    value: "1-Month"
  },
  {
    name: "2 Months",
    value: "2-Month"
  },
  {
    name: "3 Months",
    value: "3-Month"
  },
  {
    name: "6 Months",
    value: "6-Month"
  },
  {
    name: "Year",
    value: "1-Year"
  },
  {
    name: "2-Year",
    value: "2-Year"
  },
  {
    name: "3-Year",
    value: "3-Year"
  },
  {
    name: "Custom",
    value: "custom"
  }
]

interface Props {
  selected_value: string | null
  handleChange: (repeat: string | null) => void
  props?: TextFieldProps
}

const RecurrenceRepeatSelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(frequencies.find((element: any) => `${element.value}` === `${selected_value}`)??{
          name: "Custom",
          value: "custom"
        })
      } else {
        setObject(frequencies.find((element: any) => `${element.value}` === `${selected_value}`)??{
          name: "Custom",
          value: "custom"
        })
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, frequencies])


  const onChange = (event: any, value: DropdownObj | null) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={frequencies}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      isOptionEqualToValue={(option => option.name === selected_value)}
      disableClearable
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Repeat On')} placeholder={t("Repeat On") as string} {...(props??{})} />}
    />
  )
}

export default RecurrenceRepeatSelector;
