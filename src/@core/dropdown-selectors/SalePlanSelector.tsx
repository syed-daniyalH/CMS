// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import { GenericDropdownObj, getSalePlans } from '../../store/dropdowns'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import { salePlanKey } from '../utils/translation-file'
import TypoLabel from '../../custom-components/inputs/TypoLabel'

interface Props {
  selected_value: number | null
  areaMarla: number | null
  areaSqFt: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  canAdd?: boolean | null
  props?: TextFieldProps
}


const SalePlanSelector = ({selected_value, areaMarla, areaSqFt, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<GenericDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<GenericDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)
  const [openAdd, setOpenAdd] = useState<boolean>(false);


  // ** translation
  const {t} = useTranslation();

  const toggleOpenAdd = () => {
    setOpenAdd(!openAdd);
  }


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && areaSqFt && areaMarla && object?.value !== selected_value) {
        if (objectList.length) {
          onChange(null, objectList.find((element: GenericDropdownObj) => element.value === selected_value)??null)
        } else {
          axios.get(`/Dropdowns/GetSalePlansByArea/true/${areaMarla}/${areaSqFt}`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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
  }, [selected_value])

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if((store.sale_plans?.length || store.sub_category_success) && `${store.sale_plans_params.AreaMarla}` === `${areaMarla}` && `${store.sale_plans_params.AreaSqft}` === `${areaSqFt}`) {
        setObjectList(store.sale_plans)
      } else {
        if(areaMarla && areaSqFt) {
          dispatch(
            getSalePlans({
              AreaMarla: areaMarla,
              AreaSqft: areaSqFt,
            })
          )
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.sale_plans, areaMarla, areaSqFt, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: GenericDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<GenericDropdownObj> | undefined) => {
    if (value?.value !== -1) {
      setObject(value);
      handleChange(value ?? null);
    } else {
      toggleOpenAdd();
    }
  }

  return (
    <>
    <CustomAutocomplete
      options={objectList ?? []}
      sx={{ mb: (props?.sx as any)?.mb ?? 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={(disabled??false) || !(areaMarla && areaSqFt)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option: GenericDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={salePlanKey} />} placeholder={t(salePlanKey) as string} {...(props??{})} />}
      renderOption={(props, option, {inputValue, index}) =>  (
        <li {...props} key={(option.text??"") + index}>{option.text}</li>
      )}
    />

    </>
  )
}

export default SalePlanSelector;
