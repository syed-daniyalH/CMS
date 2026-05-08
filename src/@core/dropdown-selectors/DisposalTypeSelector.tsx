// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {GenericDropdownObj, getDefaultDisposalTypes} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import TypoLabel from "../../custom-components/inputs/TypoLabel";

interface Props {
  selected_value: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  important?: boolean | null
  props?: TextFieldProps
}

const DisposalTypesSelector = ({selected_value, handleChange, clearable = true, disabled = false, important = false, props} : Props) => {

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
        if (objectList.length) {
          setObject(objectList.find((element: GenericDropdownObj) => element.value === selected_value))
        } else {
          axios.get(`/Defaults/GetFixedAssetDisposalTypes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

    if(isActive) {

      if(store.disposal_types?.length || store.disposal_types_success) {
        setObjectList(store.disposal_types)
      } else {
        dispatch(
          getDefaultDisposalTypes({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.disposal_types, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: GenericDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<GenericDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: GenericDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={t('Disposal Type')} important={important??false} />} placeholder={t("Disposal Type") as string} {...(props??{})} />}
    />
  )
}

export default React.memo(DisposalTypesSelector);
