// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {useEffect, useState} from "react";
import {TextFieldProps} from "@mui/material/TextField";


interface DropdownObj {
  name: string
  value: string
}

interface Props {
  selected_value: string | null
  options: DropdownObj[]
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const CheckboxSelector = ({selected_value, options, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(options.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(options.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, options])


  const onChange = (_event: any, value: DropdownObj) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={options}
      sx={{ mb: 3 }}
      id='autocomplete-custom-checkbox'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth {...(props??{})} />}
    />
  )
}

export default CheckboxSelector;
