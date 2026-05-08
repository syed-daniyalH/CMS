// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {fieldTypeKey} from "../utils/translation-file";


interface DropdownObj {
  name: string
  value: string
}

const statuses: DropdownObj[] = [
  {
    name: "Text",
    value: "String"
  },
  {
    name: "Numeric",
    value: "Number"
  }
]

interface Props {
  selected_value: string | null
  handleChange: (month: string | null) => void
  props?: TextFieldProps
  disableClearable?: boolean
}

const FieldTypeSelector = ({selected_value, handleChange,disableClearable=true, props} : Props) => {

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
      renderInput={params => <CustomTextField {...params} fullWidth label={t(fieldTypeKey)} placeholder={t(fieldTypeKey) as string} {...(props??{})} />}
    />
  )
}

export default FieldTypeSelector;
