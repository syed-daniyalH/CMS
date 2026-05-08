// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ItemDropdownObj, getSaleInventory} from "src/store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Variant} from "@mui/material/styles/createTypography";

interface Props {
  selected_value: number | null
  handleChange: (value: ItemDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  useListObject?: boolean | null
  variant?: Variant | null
  props?: TextFieldProps
}

const SaleItemSelector = ({
                            selected_value,
                            handleChange,
                            clearable = true,
                            disabled = false,
                            noBorder = false,
                            preview = false,
                            useListObject = false,
                            variant,
                            props
                          }: Props) => {

  const [object, setObject] = useState<ItemDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<ItemDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (selected_value && `${object?.recno}` !== `${selected_value}`) {
        if (objectList.length || (useListObject ?? false)) {
          setObject(objectList.find((element: ItemDropdownObj) => `${element.recno}` === `${selected_value}`) ?? null)
        } else {
          axios.get(`/Defaults/Inventory`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              setObject(data.data[0])
            }
          })
        }
      } else if (!selected_value) {
        setObject(null);
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (store.sale_items?.length || store.sale_items_success) {
        setObjectList(store.sale_items)
      } else {
        dispatch(
          getSaleInventory({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.sale_items, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: ItemDropdownObj | null, _reason?: AutocompleteChangeReason | null, _details?: AutocompleteChangeDetails<ItemDropdownObj> | null | undefined) => {
    setObject(value);
    handleChange(value ?? null);
  }

  return preview ? (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Typography variant={variant??'subtitle2'}>
        {object?.name ?? ""}
      </Typography>
      {
        <Typography variant={'caption'}>
          {object?.sku ? "Sku:" : ""} {object?.sku ?? ""}
        </Typography>
      }
    </Box>
  ) : (
    <CustomAutocomplete
      options={objectList ?? []}
      sx={{mb: (props?.sx as any)?.mb ?? 3}}
      filterOptions={(options, state) => options.filter((it) => (((it.name??"").toLowerCase().includes((state.inputValue??"").toLowerCase()))))}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled ?? false}
      getOptionLabel={(option: ItemDropdownObj) => option?.name || ''}
      renderOption={(props, option) => (
        <li {...props} key={option.recno}>
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography>
              {option.name}
            </Typography>
            {
              <Typography variant={'caption'}>
                {option.sku ?? ""}
              </Typography>
            }
          </Box>
        </li>
      )}
      renderInput={params => <CustomTextField {...params} fullWidth placeholder={t("Select Item") as string}
                                              label={t('Item')} {...(props ?? {})} noBorder={noBorder}/>}
    />
  )
}

export default React.memo(SaleItemSelector);
