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
  { value: 1, name: "Sat-Fri" },
  { value: 2, name: "Sun-Sat" },
  { value: 3, name: "Mon-Sun" },
  { value: 4, name: "Tue-Mon" },
  { value: 5, name: "Wed-Tue" },
  { value: 6, name: "Thu-Wed" },
  { value: 7, name: "Fri-Thu" }
]

interface Props {
  selected_value: number | null
  handleChange: (value: number | null) => void
  props?: TextFieldProps
}

const WeekTypeSelector = ({selected_value, handleChange, props} : Props) => {

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
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Week Type')} placeholder={t("Week Type") as string} {...(props??{})} />}
    />
  )
}

export default WeekTypeSelector;
