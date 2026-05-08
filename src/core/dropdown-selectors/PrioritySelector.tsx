// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {priorityKey} from "../utils/translation-file";
import {Box} from "@mui/material";


interface DropdownObj {
  name: string
  value: string
  color: string
}

const statuses: DropdownObj[] = [
  {
    name: "Low",
    value: "Low",
    color: "secondary",
  },
  {
    name: "Medium",
    value: "Medium",
    color: "info",
  },
  {
    name: "High",
    value: 'High',
    color: "warning",
  },
  {
    name: "Critical",
    value: 'Critical',
    color: "error"
  }
]

interface Props {
  selected_value: string | null
  handleChange: (priority: string | null) => void
  props?: TextFieldProps
}

const PrioritySelector = ({selected_value, handleChange, props} : Props) => {

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


  const onChange = (_event: any, value: DropdownObj) => {
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
      renderInput={params => <CustomTextField {...params} fullWidth label={t(priorityKey)} placeholder={t(priorityKey) as string} {...(props??{})} />}
      renderOption={(props, option, {index}) => (
        <li {...props} key={(option.name??"") + index}>
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: 8, height: 8, mr: 2, borderRadius: '100px', backgroundColor: `${option.color}.main`}} />
            {option.name}
          </Box>
        </li>
      )}
    />
  )
}

export default PrioritySelector;
