// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ItemAdjDropdownObj, getInventoryAdj} from "src/store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import Typography from "@mui/material/Typography";

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

const ItemAdjustmentSelector = ({selected_value, handleChange, clearable = true, disabled = false, noBorder = false, preview = false,  useListObject = false, props} : Props) => {

  const [object, setObject] = useState<ItemAdjDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<ItemAdjDropdownObj[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>("");
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && `${object?.itemId}` !== `${selected_value}`) {
        if ((useListObject??false)) {
          setObject(objectList.find((element: ItemAdjDropdownObj) => `${element.itemId}` === `${selected_value}`)??null)
        } else {
          axios.get(`/Defaults/GetInventeoryAvgPurchaseRateWithQty`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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
  }, [selected_value])

  useEffect(() => {
    let isActive = true;
    let timeout: any;

    if(isActive) {

      if(value !== store.items_adj_params?.Name) {
        timeout = setTimeout(() => {
          if (value !== store.items_adj_params?.Name) {
            setLoading(true);
            dispatch(getInventoryAdj({ Name: value }));
          }
        }, 500); // delay API call
      } else {
        dispatch(
          getInventoryAdj({})
        )
      }
    }

    return () => {
      if(timeout) {
        clearTimeout(timeout)
      }
      isActive = false;
    }
  }, [dispatch, value])

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(store.items_adj?.length || store.items_adj_success) {
        setLoading(false)
        setObjectList(store.items_adj)
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.items_adj])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: ItemAdjDropdownObj | null, _reason?: AutocompleteChangeReason | null, _details?: AutocompleteChangeDetails<ItemAdjDropdownObj> | null | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? <p>{object?.itemName??""}</p> :(
    <CustomAutocomplete
      options={objectList ?? []}
      sx={{ mb: (props?.sx as any)?.mb ?? 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled ?? false}
      loading={loading} // show loading spinner
      getOptionLabel={(option: ItemAdjDropdownObj) => option?.itemName || ''}
      renderInput={params => (
        <CustomTextField
          {...params}
          fullWidth
          placeholder={t("Select Item") as string}
          label={t("Item")}
          {...(props ?? {})}
          noBorder={noBorder}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.itemId}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography>{option.itemName}</Typography>
          </Box>
        </li>
      )}
      filterOptions={(x) => x} // disable local filtering
      onInputChange={(_, val) => setValue(val)}
    />
  )
}

export default React.memo(ItemAdjustmentSelector);
