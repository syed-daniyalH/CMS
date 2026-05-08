// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {unitKey} from "../utils/translation-file";
import axios from "axios";

interface Props {
  selected_value: number | null
  itemId: number | null
  handleChange: (value: SubUnitListProps | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  preview?: boolean | null
  noBorder?: boolean | null
  props?: TextFieldProps
}

export interface SubUnitListProps {
  recno: number
  description: string
  isDefault: boolean
  ratio: number
}


const SubUnitSelector = ({selected_value, handleChange, itemId, clearable = true, preview = false, disabled = false, noBorder = false, props} : Props) => {

  const [object, setObject] = useState<SubUnitListProps | null | undefined>(null)
  const [objectList, setObjectList] = useState<SubUnitListProps[]>([])


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.recno !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: SubUnitListProps) => `${element.recno}` === `${selected_value}`))
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(itemId) {
        axios.get(`/Defaults/GetInventorySubUnits/${itemId}`).then((data) => {
          setObjectList(data?.data?.data??[]);
        })
      }
    }

    return () => {
      isActive = false;
    }
  }, [itemId])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: SubUnitListProps | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<SubUnitListProps> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? (
    <p>{object?.description??""}</p>
    ) : (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any).mb??3 }}
      id='autocomplete-custom-unit'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: SubUnitListProps) => option?.description || ''}
      renderInput={params => <CustomTextField {...params} noBorder={noBorder} fullWidth label={t(unitKey)} {...(props??{})} />}
    />
  )
}

export default SubUnitSelector;
