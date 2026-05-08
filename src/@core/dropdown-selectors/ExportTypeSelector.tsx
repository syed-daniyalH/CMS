// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import TypoLabel from "../../custom-components/inputs/TypoLabel";
import {useTranslation} from "react-i18next";


interface DropdownObj {
  name: string
  value: string
}

const exportTypes: DropdownObj[] = [
  {
    name: "XlSX",
    value: "excel"
  },
  {
    name: "CSV",
    value: 'csv'
  }
]

interface Props {
  selected_value: string | null
  handleChange: (value: string | null) => void
}

const ExportTypeSelector = ({selected_value, handleChange} : Props) => {

  const [object, setObject] = useState<DropdownObj | null | undefined>(null)
  const { t } = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(exportTypes.find((element: any) => element.value === selected_value))
      } else {
        setObject(exportTypes.find((element: any) => element.value === selected_value))
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: DropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<DropdownObj> | undefined) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={exportTypes}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth placeholder={t("Export Type") as string} label={<TypoLabel name={'Export Type'} />} />}
    />
  )
}

export default ExportTypeSelector;
