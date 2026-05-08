// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import { GenericDropdownObj, getPropertiesByFloor } from '../../store/dropdowns'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {propertyKey} from "../utils/translation-file";
import TypoLabel from '../../custom-components/inputs/TypoLabel'

interface Props {
  selected_value: number | null
  floorId: number | null
  typeId: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  canAdd?: boolean | null
  props?: TextFieldProps
}


const PropertyByTypeSelector = ({selected_value, floorId, typeId, handleChange, clearable = true, disabled = false, props} : Props) => {

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

      if(selected_value && typeId && floorId && object?.value !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: GenericDropdownObj) => element.value === selected_value)??null)
        } else {
          axios.get(`/Dropdowns/GetPropertyListByFloorType/${floorId}/${typeId}`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              setObject(data.data[0])
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

      if((store.property_floor?.length || store.sub_category_success) && `${store.property_floor_params.FloorId}` === `${floorId}` && `${store.property_floor_params.TypeId}` === `${typeId}`) {
        setObjectList(store.property_floor)
      } else {
        if(floorId && typeId) {
          dispatch(
            getPropertiesByFloor({
              FloorId: floorId,
              TypeId: typeId,
            })
          )
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.property_floor, floorId, typeId, dispatch])


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
      disabled={(disabled??false) || !(floorId && typeId)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option: GenericDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={propertyKey} />} placeholder={t(propertyKey) as string} {...(props??{})} />}
      renderOption={(props, option, {inputValue, index}) =>  (
        <li {...props} key={(option.text??"") + index}>{option.text}</li>
      )}
    />

    </>
  )
}

export default PropertyByTypeSelector;
