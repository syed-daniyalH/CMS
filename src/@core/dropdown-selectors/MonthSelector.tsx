// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {monthKey} from "../utils/translation-file";


interface DropdownObj {
  name: string
  value: number
}

const statuses: DropdownObj[] = [
  {
    name: "January",
    value: 1
  },
  {
    name: "February",
    value: 2
  },
  {
    name: "March",
    value: 3
  },
  {
    name: "April",
    value: 4
  },
  {
    name: "May",
    value: 5
  },
  {
    name: "June",
    value: 6
  },
  {
    name: "July",
    value: 7
  },
  {
    name: "August",
    value: 8
  },
  {
    name: "September",
    value: 9
  },
  {
    name: "October",
    value: 10
  },
  {
    name: "November",
    value: 11
  },
  {
    name: "December",
    value: 12
  },
]

interface Props {
  selected_value: number | null
  handleChange: (month: number | null) => void
  props?: TextFieldProps
  disableClearable?: boolean
}

const MonthSelector = ({selected_value, handleChange,disableClearable=true, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(statuses.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(statuses.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, statuses])


  const onChange = (_event: any, value: DropdownObj | null) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={statuses}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable={disableClearable}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t(monthKey)} placeholder={t(monthKey) as string} {...(props??{})} />}
    />
  )
}

export default MonthSelector;
