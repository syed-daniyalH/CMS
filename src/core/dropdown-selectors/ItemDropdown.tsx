// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ItemDropdownObj, getInventory} from "src/store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {itemKey, selectItemKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  handleChange: (value: ItemDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  useListObject?: boolean | null
  props?: TextFieldProps
}

const ItemSelector = ({selected_value, handleChange, clearable = true, disabled = false, noBorder = false, preview = false, useListObject = false, props} : Props) => {

  const [object, setObject] = useState<ItemDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<ItemDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && `${object?.recno}` !== `${selected_value}`) {
        if (objectList.length || (useListObject??false)) {
          setObject(objectList.find((element: ItemDropdownObj) => `${element.recno}` === `${selected_value}`))
        } else {
          axios.get(`/Defaults/Inventory`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              setObject(data.data[0])
            }
          })
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(store.items?.length || store.items_success) {
        setObjectList(store.items)
      } else {
        dispatch(
          getInventory({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.items, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: ItemDropdownObj | null, _reason: AutocompleteChangeReason | null, _details: AutocompleteChangeDetails<ItemDropdownObj> | null | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? <p>{object?.name??""}</p> : (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: ItemDropdownObj) => option?.name || ''}
      renderOption={(props, option) => (
        <li {...props} key={option.recno}>
          {option.name}
        </li>
      )}
      renderInput={params => <CustomTextField {...params} fullWidth placeholder={t(selectItemKey) as string} label={t(itemKey)} {...(props??{})} noBorder={noBorder} />}
    />
  )
}

export default React.memo(ItemSelector);
