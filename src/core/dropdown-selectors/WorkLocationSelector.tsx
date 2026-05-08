// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {GenericDropdownObj, getDefaultWorkLocations} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import {addNewWorkLocationKey, workLocationKey} from "../utils/translation-file";
import Icon from "../components/icon";

interface Props {
  selected_value: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
  canAdd?: boolean | null
}


const addNewWorkLocation: GenericDropdownObj = {
  value: -1,
  text: "Add New Work Location",
  code: '-1'
}

const WorkLocationSelector = ({selected_value, handleChange, clearable = true, canAdd = false, disabled = false, props}: Props) => {

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

    if (isActive) {

      if (selected_value && object?.value !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: GenericDropdownObj) => element.value === selected_value))
        } else {
          axios.get(`/Defaults/PayrollWorkLocations`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

    if (isActive) {

      if (store.work_locations?.length || store.work_locations_success) {
        setObjectList(store.work_locations)
      } else {
        dispatch(
          getDefaultWorkLocations({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.work_locations, dispatch])


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
        options={canAdd ? [addNewWorkLocation, ...objectList ?? []] : objectList ?? []}
        sx={{mb: 3}}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={disabled ?? false}
        getOptionLabel={(option: GenericDropdownObj) => option?.text || ''}
        renderInput={params => <CustomTextField {...params} fullWidth label={t(workLocationKey)}  placeholder={t(workLocationKey) as string} {...(props ?? {})} />}
        renderOption={(props, option, {index}) => option.value === -1 ? (
          <li {...props} key={(option.text??"") + index} style={{borderRadius: '8px', border: '1px solid gray'}}>
            <Box sx={{
              width: '100%',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              '& svg': {mr: 2}
            }}>
              <Icon icon='tabler:plus' fontSize='1.125rem'/>
              {t(addNewWorkLocationKey)}
            </Box>
          </li>
        ) : (
          <li {...props} key={(option.text??"") + index}>{option.text}</li>
        )}
      />
    </>
  )
}

export default React.memo(WorkLocationSelector);
