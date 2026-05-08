// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {GenericDropdownObj, getTaxTypes} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import Typography from "@mui/material/Typography";
import {taxTypeKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  forceStore?: boolean | null
  variant?: string | null
  props?: TextFieldProps
}

const TaxTypeSelector = ({selected_value, handleChange, clearable = true, disabled = false, forceStore = false, noBorder = false, preview = false, variant, props} : Props) => {

  const [object, setObject] = useState<GenericDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<GenericDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.value !== selected_value) {
        if (objectList.length || forceStore) {
          onChange(null, objectList.find((element: GenericDropdownObj) => element.value === selected_value)??null)
        } else {
          axios.get(`/Defaults/TaxTypes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0])
            }
          })
        }
      } else if(!selected_value) {
        setObject(null);
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(store.tax_types?.length || store.tax_types_success) {
        setObjectList(store.tax_types)
      } else {
        dispatch(
          getTaxTypes({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.tax_types, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: GenericDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<GenericDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? (
    <Typography variant={(variant??'body1') as any}>{object?.text ? `${object?.text??""} - [${object?.taxPercent??""}%]` : ""}</Typography>
    ) :(
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: GenericDropdownObj) => `${option?.text} - [${option?.taxPercent}%]` || ''}
      renderInput={params => <CustomTextField {...params} label={t(taxTypeKey)} placeholder={t(taxTypeKey) as string} fullWidth {...(props??{})}  noBorder={noBorder??false}/>}
    />
  )
}

export default React.memo(TaxTypeSelector);
