// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {TemplateBankDetailsObj, templateBanks} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value: number | null
  handleChange: (value: TemplateBankDetailsObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const TemplateBankSelector = ({selected_value, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<TemplateBankDetailsObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<TemplateBankDetailsObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.recno !== selected_value) {
        if (objectList.length) {
          onChange(null, objectList.find((element: TemplateBankDetailsObj) => `${element.recno}` === `${selected_value}`)??null, null, null)
        } else {
          axios.get(`/Defaults/DetailCashBankCOAList`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null,data.data[0]??null, null, null)
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

      if(store.template_banks?.length || store.template_banks_success) {
        setObjectList(store.template_banks)
      } else {
        dispatch(
          templateBanks({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.template_banks, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: TemplateBankDetailsObj | null, _reason: AutocompleteChangeReason | null, _details?: AutocompleteChangeDetails<TemplateBankDetailsObj> | undefined | null) => {
    setObject(value);
    handleChange(value??null);
  }

  return (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom-account'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: TemplateBankDetailsObj) => (`${option?.bankName || ''} - ${option.bankBranchName}`)}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Bank')} {...(props??{})} />}
      renderOption={(props, option, { inputValue, index }) => (
        <li {...props} key={option.bankName + index}>{option.bankName} - {option.bankBranchName}</li>
      )}
    />
  )
}

export default React.memo(TemplateBankSelector);
