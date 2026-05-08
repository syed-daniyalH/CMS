// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {yearKey} from "../utils/translation-file";


interface DropdownObj {
  name: string
  value: number
}

interface Props {
  selected_value: number | null
  handleChange: (month: number | null) => void
  props?: TextFieldProps
  disableClearable?: boolean
}

const YearSelector = ({selected_value, handleChange ,disableClearable=true, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const [years, setYears] = useState<DropdownObj[]>([])
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(years.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(years.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, years])

  useEffect(() => {
      let isActive = true;

        if(isActive) {
          const startYear = new Date().getFullYear() - 25;
          const endYear = new Date().getFullYear() + 25;
          for (let year = endYear; year >= startYear; year--) {
            years.push({name: `${year}`, value: year});
          }

          setYears([...years])
        }


      return () => {
        isActive = false;
      }
    }, [])


  const onChange = (_event: any, value: DropdownObj | null ) => {

    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={years}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable={disableClearable}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t(yearKey)} placeholder={t(yearKey) as string} {...(props??{})} />}
    />
  )
}

export default YearSelector;
