// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import TypoLabel from "../../components/inputs/TypoLabel";


interface DropdownObj {
  name: string
  value: boolean | null
}

const statuses: DropdownObj[] = [
  {
    name: "All Items",
    value: null
  },
  {
    name: "Active",
    value: false
  },
  {
    name: "In-Active",
    value: true
  },
]

interface Props {
  selected_value: boolean | null
  handleChange: (value: boolean | null) => void
}

const ItemStatusSelector = ({selected_value, handleChange} : Props) => {

  const [object, setObject] = useState<DropdownObj | null | undefined>(null)


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(statuses.find((element: any) => element.value === selected_value))
      } else {
        setObject(statuses.find((element: any) => element.value === selected_value))
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value])


  const onChange = (event: SyntheticEvent<Element, Event> | null, value: DropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<DropdownObj> | undefined) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={statuses}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={'Status'} />} />}
    />
  )
}

export default ItemStatusSelector;
