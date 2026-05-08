// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CurrencyDropdownObj, getDefaultCurrencies} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value: number | null
  handleChange: (value: CurrencyDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const DefaultCurrencySelector = ({selected_value, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<CurrencyDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CurrencyDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.recno !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: CurrencyDropdownObj) => element.recno === selected_value))
        } else {
          axios.get(`/OpenDefaults/CurrenciesList`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.default_currencies?.length) {
        setObjectList(store.default_currencies)
      } else {
        dispatch(
          getDefaultCurrencies({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.default_currencies, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: CurrencyDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CurrencyDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: CurrencyDropdownObj) => `${option.name} (${option.code})`}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Currency')} placeholder={t('Currency') as string}  {...(props??{})} />}
    />
  )
}

export default DefaultCurrencySelector;
