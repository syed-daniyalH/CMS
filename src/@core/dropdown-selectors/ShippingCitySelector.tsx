// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CityDropdownObj, getShippingCities} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value: string | null
  country_id: number | null
  handleChange: (value: CityDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const ShippingCitySelector = ({selected_value, country_id, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<CityDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CityDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(object?.name !== selected_value && country_id) {
        if (objectList.length) {
          setObject(objectList.find((element: CityDropdownObj) => element.name === selected_value)??null)
        } else {
          axios.get(`OpenDefaults/CitesList/${country_id}`, {params: {Name: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0])
            } else {
              onChange(null, null)
            }
          })
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, country_id])

  useEffect(() => {
    let isActive = true;

    if(isActive && country_id) {

      if(store.shipping_cities?.length && `${store.shipping_cities_params.CountryId}` === `${country_id}`) {
        setObjectList(store.shipping_cities)
      } else {
        dispatch(
          getShippingCities({
            CountryId: country_id
          })
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.shipping_cities, country_id, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: CityDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CityDropdownObj> | undefined) => {
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
      getOptionLabel={(option: CityDropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('City')} {...(props??{})} />}
    />
  )
}

export default ShippingCitySelector;
