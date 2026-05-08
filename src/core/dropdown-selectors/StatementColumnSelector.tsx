// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import TypoLabel from "../../components/inputs/TypoLabel";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";


interface DropdownObj {
  name: string
  value: string
}

interface Props {
  importedColumns: string[]
  selected_value: string | null
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const StatementColumnSelector = ({selected_value, handleChange, importedColumns, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const [importColumns, setImportColumns] = useState<DropdownObj[]>([])
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(importColumns.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(importColumns.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, importColumns])

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      let tempCols: DropdownObj[] = [];
      for(let i = 0; i < importedColumns.length; i++) {
        tempCols.push({
          name: importedColumns[i],
          value: importedColumns[i],
        });
      }
      setImportColumns(tempCols);
    }

    return () => {
      isActive = false;
    }
  }, [importedColumns])


  const onChange = (event: SyntheticEvent<Element, Event> | null, value: DropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<DropdownObj> | undefined) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={importColumns}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={'Map Column'} important/>} placeholder={t("Map Column") as string} {...(props??{})} />}
    />
  )
}

export default StatementColumnSelector;
