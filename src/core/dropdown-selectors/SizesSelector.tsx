// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CategoryDropdownObj, getSizes} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import {addNewSizeKey, sizeKey} from "../utils/translation-file";
import Icon from "../components/icon";

interface Props {
  selected_value: number | null
  handleChange: (value: CategoryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  canAdd?: boolean | null
  props?: TextFieldProps
}



const addNewSize: CategoryDropdownObj = {
  recno: -1,
  text: "Add New Size",
  code: '-1'
}


const SizesSelector = ({selected_value, handleChange, clearable = true, canAdd = false, disabled = false, props} : Props) => {

  const [object, setObject] = useState<CategoryDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CategoryDropdownObj[]>([])
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

      if(selected_value && object?.recno !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: CategoryDropdownObj) => element.recno === selected_value))
        } else {
          axios.get(`/Defaults/InventorySizes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.sizes?.length) {
        setObjectList(store.sizes)
      } else {
        dispatch(
          getSizes({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.sizes, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: CategoryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CategoryDropdownObj> | undefined) => {
    if (value?.recno !== -1) {
      setObject(value);
      handleChange(value ?? null);
    } else {
      toggleOpenAdd();
    }
  }

  return (
    <>
      <CustomAutocomplete
        options={canAdd ? [addNewSize, ...objectList ?? []] : objectList ?? []}
        sx={{ mb: 3 }}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={disabled??false}
        getOptionLabel={(option: CategoryDropdownObj) => option?.text || ''}
        renderInput={params => <CustomTextField {...params} fullWidth label={t(sizeKey)} {...(props??{})} />}
        renderOption={(props, option, {index}) => option.recno === -1 ? (
          <li {...props} key={option.text + index} style={{borderRadius: '8px', border: '1px solid gray'}}>
            <Box sx={{
              width: '100%',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              '& svg': {mr: 2}
            }}>
              <Icon icon='tabler:plus' fontSize='1.125rem'/>
              {t(addNewSizeKey)}
            </Box>
          </li>
        ) : (
          <li {...props} key={option.text + index}>{option.text}</li>
        )}
      />

    </>
  )
}

export default SizesSelector;
