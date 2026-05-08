// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {GenericDropdownObj, getVatReturnPeriod} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const VATReturnPeriodSelector = ({selected_value, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<GenericDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<GenericDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if((selected_value??-1) > -1) {
        if(`${object?.value}` !== `${selected_value}`) {
          if (objectList.length) {
            setObject(objectList.find((element: GenericDropdownObj) => `${element.value}` === `${selected_value}`))
          } else {
            axios.get(`/Defaults/GetVatReturnPeriodTypes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
              if (data.data.length > 0) {
                onChange(null, data.data[0])
              }
            })
          }
        }
      } else {
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

      if(store.vat_periods?.length) {
        setObjectList(store.vat_periods)
      } else {
        dispatch(
          getVatReturnPeriod({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.vat_periods, dispatch])


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
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Period')} {...(props??{})} />}
    />
  )
}

export default VATReturnPeriodSelector;
