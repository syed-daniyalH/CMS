// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {getDateRange} from "../utils/format";
import {useAuth} from "../../hooks/useAuth";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {periodKey} from "../utils/translation-file";


interface DropdownObj {
  name: string
  value: number
}

const statuses: DropdownObj[] = [
  {
    name: "Today",
    value: 0
  },
  {
    name: "Yesterday",
    value: 1
  },
  {
    name: "This Week",
    value: 2
  },
  {
    name: "Last 7 Days",
    value: 3
  },
  {
    name: "This Month",
    value: 4
  },
  {
    name: "Last Month",
    value: 5
  },
  {
    name: "Last 30 Days",
    value: 6
  },
  {
    name: "Current Year",
    value: 7
  },
  {
    name: "Year to Date",
    value: 8
  },
  {
    name: "Previous Year to Date",
    value: 9
  },
]

interface Props {
  selected_value: number | null
  handleChange: (fromDate: string | Date | null, toDate: string | Date | null, period: number | null) => void
  props?: TextFieldProps
}

const PeriodSelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { user } = useAuth();
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


  const onChange = (_event: any, value: DropdownObj) => {
    let { fromDate, toDate } = getDateRange(value?.value??-1, user);
    handleChange(fromDate, toDate, value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={statuses}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t(periodKey)} placeholder={t(periodKey) as string} {...(props??{})} />}
    />
  )
}

export default PeriodSelector;
