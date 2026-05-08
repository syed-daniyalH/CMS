// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import { GenericDropdownObj, getCustomerType } from '../../store/dropdowns'
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
  preview?: boolean | null
  props?: TextFieldProps
}

const CustomerTypeSelector = ({selected_value, handleChange, clearable = true, disabled = false, important = false, preview = false, props} : Props) => {

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
          axios.get(`/Dropdowns/GetCustomerAgentTypes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0])
            }
          })
        }
      } else if (!selected_value) {
        setObject(null);
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value])

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if((store.customer_types?.length || store.customer_types_success)) {
        setObjectList(store.customer_types)
      } else {
        dispatch(
          getCustomerType({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.customer_types, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: GenericDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<GenericDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? (
      <>{object?.text??""}</>
    ) : (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: 3 }}
      id='autocomplete-custom-place-of-supply'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: GenericDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={t('Customer Type')} important={important??false} />} placeholder={t("Customer Type") as string} {...(props??{})} />}
    />
  )
}

export default React.memo(CustomerTypeSelector);
