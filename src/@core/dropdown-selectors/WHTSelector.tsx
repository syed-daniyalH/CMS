// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {WHTDropdownObj, getWHTTaxes} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {whtKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  handleChange: (value: WHTDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const WHTSelector = ({selected_value, handleChange, clearable = true, disabled = false, props}: Props) => {

  const [object, setObject] = useState<WHTDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<WHTDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)

  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (selected_value && object?.coaId !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: WHTDropdownObj) => element.coaId === selected_value))
        } else {
          axios.get(`/Defaults/GetWithHeldTaxesList`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0])
            }
          })
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value])

  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (store.wht_taxes?.length || store.wht_taxes_success) {
        setObjectList(store.wht_taxes)
      } else {
        dispatch(
          getWHTTaxes({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.wht_taxes, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: WHTDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<WHTDropdownObj> | undefined) => {
    if (value?.coaId !== -1) {
      setObject(value);
      handleChange(value ?? null);
    }
  }

  return (
    <CustomAutocomplete
      options={objectList ?? []}
      sx={{mb: 3}}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled ?? false}
      getOptionLabel={(option: WHTDropdownObj) => `${option?.taxName??0}-${option.taxPercent??0}%`}
      renderInput={params => <CustomTextField {...params} fullWidth label={t(whtKey)} {...(props ?? {})} />}
      renderOption={(props, option, {index}) => (
        <li {...props} key={(option.taxName??"") + index}>{`${option.taxName??""}-${option.taxPercent??0}%`}</li>
      )}
    />
  )
}

export default React.memo(WHTSelector);
