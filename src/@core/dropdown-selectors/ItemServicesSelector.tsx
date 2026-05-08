// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ItemAdjDropdownObj, getInventoryServices} from "src/store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value: number | null
  handleChange: (value: ItemAdjDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  useListObject?: boolean | null
  props?: TextFieldProps
}

const ItemServicesSelector = ({selected_value, handleChange, clearable = true, disabled = false, noBorder = false, preview = false,  useListObject = false, props} : Props) => {

  const [object, setObject] = useState<ItemAdjDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<ItemAdjDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && `${object?.itemId}` !== `${selected_value}`) {
        if (objectList.length || (useListObject??false)) {
          setObject(objectList.find((element: ItemAdjDropdownObj) => `${element.itemId}` === `${selected_value}`)??null)
        } else {
          axios.get(`/Defaults/GetNonInventeoryServiceItems`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0], null, null)
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

      if(store.items_services?.length || store.items_services_success) {
        setObjectList(store.items_services)
      } else {
        dispatch(
          getInventoryServices({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.items_services, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: ItemAdjDropdownObj | null, _reason: AutocompleteChangeReason | null, _details: AutocompleteChangeDetails<ItemAdjDropdownObj> | null | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? <p>{object?.itemName??""}</p> :(
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: ItemAdjDropdownObj) => option?.itemName || ''}
      renderInput={params => <CustomTextField {...params} fullWidth placeholder={t("Select Item") as string} label={t('Item')} {...(props??{})} noBorder={noBorder} />}
    />
  )
}

export default React.memo(ItemServicesSelector);
