// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {genderKey} from "../utils/translation-file";
import TypoLabel from '../../components/inputs/TypoLabel'


interface DropdownObj {
  name: string
  value: string
}

const genders: DropdownObj[] = [
  {
    name: "Male",
    value: "Male",
  },
  {
    name: "Female",
    value: "Female"
  },
  {
    name: "Other",
    value: "Other"
  }
]

interface Props {
  selected_value: string | null
  important?: boolean | null
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const GenderSelector = ({selected_value, important, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(genders.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(genders.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, genders])


  const onChange = (_event: any, value: DropdownObj) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={genders}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={t(genderKey)} important={important??false} />} placeholder={t(genderKey) as string} {...(props??{})} />}
    />
  )
}

export default GenderSelector;
