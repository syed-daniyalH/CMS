// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";


interface DropdownObj {
  name: string
  value: number
}

const statuses: DropdownObj[] = [
  { name: "dd-MM-yyyy", value: 1 },
  { name: "MM-dd-yyyy", value: 2 },
  { name: "yyyy-MM-dd", value: 3 },
  { name: "dd/MM/yyyy", value: 4 },
  { name: "dd/MM/yy", value: 5 },
  { name: "MM/dd/yyyy", value: 6 },
  { name: "MM/dd/yy", value: 7 },
  { name: "yyyy/MM/dd", value: 8 },
  { name: "yy/MM/dd", value: 9 },
  { name: "dd.MM.yy", value: 10 },
  { name: "MM.dd.yy", value: 11 },
  { name: "yy.MM.dd", value: 12 },
  { name: "yyyyMMdd", value: 13 },
  { name: "dd MMM yyyy", value: 14 },
  { name: "MMM, dd yyyy", value: 15 }
]

interface Props {
  selected_value: string | null
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const DateFormatSelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.name !== selected_value) {
        setObject(statuses.find((element: any) => `${element.name}` === `${selected_value}`)??null)
      } else {
        setObject(statuses.find((element: any) => `${element.name}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, statuses])


  const onChange = (event: any, value: DropdownObj) => {
    handleChange(value?.name??null);
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
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Date Format')} placeholder={t("Date Format") as string} {...(props??{})} />}
    />
  )
}

export default DateFormatSelector;
