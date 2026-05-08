// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CountryDropdownObj, getCountries} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value?: string | null
  selected_value_recno?: number | null
  handleChange: (value: CountryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const CountrySelector = ({selected_value, selected_value_recno, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<CountryDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CountryDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value) {
        if (object?.name !== selected_value) {
          if (objectList.length) {
            onChange(null, objectList.find((element: CountryDropdownObj) => element.name === selected_value) ?? null)
          } else {
            axios.get(`/OpenDefaults/CountriesesList`, {params: {Name: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
              if (data.data.length > 0) {
                onChange(null, data.data[0])
              }
            })
          }
        }
      } else if(selected_value_recno) {
        if (object?.recno !== selected_value_recno) {
          if (objectList.length) {
            onChange(null, objectList.find((element: CountryDropdownObj) => element.recno === selected_value_recno) ?? null)
          } else {
            axios.get(`/OpenDefaults/CountriesesList`, {params: {Recno: selected_value_recno}}).then(response => response.data).then((data: AxiosResponse<any>) => {
              if (data.data.length > 0) {
                onChange(null, data.data[0])
              }
            })
          }
        }
      } else if(!selected_value && !selected_value_recno) {
        setObject(null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, selected_value_recno])

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(store.countries?.length) {
        setObjectList(store.countries)
      } else {
        dispatch(
          getCountries({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.countries, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: CountryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CountryDropdownObj> | undefined) => {
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
      getOptionLabel={(option: CountryDropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Country')} placeholder={t("Country") as string} {...(props??{})} />}
    />
  )
}

export default React.memo(CountrySelector);
