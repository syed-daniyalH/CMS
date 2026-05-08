// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {getDateRange} from "../utils/format";
import {useAuth} from "../../hooks/useAuth";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import TypoLabel from "../../custom-components/inputs/TypoLabel";


interface DropdownObj {
  name: string
  value: number
}

const statuses: DropdownObj[] = [
  {
    name: "Double Amount",
    value: 1
  },
  {
    name: "Single with Negative Amount",
    value: 2
  },
  {
    name: "Single Amount",
    value: 3
  }
]

interface Props {
  selected_value: number | null
  handleChange: (value: number | null) => void
  props?: TextFieldProps
}

const StatementAmountTypeSelector = ({selected_value, handleChange, props} : Props) => {

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


  const onChange = (event: any, value: DropdownObj) => {
    handleChange(value?.value??null);
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
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={'Statement Amount Type'} important/>} placeholder={t("Amount Type") as string} {...(props??{})} />}
    />
  )
}

export default StatementAmountTypeSelector;
