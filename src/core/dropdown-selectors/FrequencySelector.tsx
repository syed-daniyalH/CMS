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
    name: "Day(s)",
    value: "Day"
  },
  {
    name: "Week(s)",
    value: "Week"
  },
  {
    name: "Month(s)",
    value: "Month"
  },
  {
    name: "Year(s)",
    value: "Year"
  }
]

interface Props {
  selected_value: string | null
  handleChange: (period: string | null) => void
  props?: TextFieldProps
}

const FrequencySelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(frequencies.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(frequencies.find((element: any) => `${element.value}` === `${selected_value}`)??null)
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
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Frequency')} placeholder={t("Frequency") as string} {...(props??{})} />}
    />
  )
}

export default FrequencySelector;
