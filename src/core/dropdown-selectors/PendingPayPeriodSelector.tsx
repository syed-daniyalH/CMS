// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CategoryDropdownObj, getPendingPayPeriods} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {payPeriodKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  handleChange: (value: CategoryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const PendingPayPeriodSelector = ({selected_value, handleChange, clearable = true, disabled = false, props}: Props) => {

  const [object, setObject] = useState<CategoryDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CategoryDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();



  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (selected_value && object?.recno !== selected_value) {
        axios.get(`/Defaults/GetAllPendingPayRollPayPeriods`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
          if (data.data.length > 0) {
            onChange(null, data.data[0])
          }
        })
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value])

  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (store.pending_pay_periods?.length || store.pending_pay_period_success) {
        setObjectList(store.pending_pay_periods)
      } else {
        dispatch(
          getPendingPayPeriods({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.pending_pay_periods, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: CategoryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CategoryDropdownObj> | undefined) => {
    if (value?.recno !== -1) {
      setObject(value);
      handleChange(value ?? null);
    }
  }

  return (
    <>
      <CustomAutocomplete
        options={objectList ?? []}
        sx={{mb: 3}}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={disabled ?? false}
        getOptionLabel={(option: CategoryDropdownObj) => option?.description || ''}
        renderInput={params => <CustomTextField {...params} fullWidth label={t(payPeriodKey)} placeholder={t(payPeriodKey) as string} {...(props ?? {})} />}
        renderOption={(props, option, {index}) => (
          <li {...props} key={(option.description??"") + index}>{option.description}</li>
        )}
      />

    </>
  )
}

export default React.memo(PendingPayPeriodSelector);
