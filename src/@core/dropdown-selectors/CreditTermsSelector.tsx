// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {GenericDropdownObj, getCreditTerms} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Icon from "../components/icon";
import {addNewCreditTermsKey, creditTermsKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  preview?: boolean | null
  canAdd?: boolean | null
  props?: TextFieldProps
}




const addNewTerms: GenericDropdownObj = {
  value: -1,
  text: "Add New Term",
  code: '-1'
}

const CreditTermsSelector = ({selected_value, handleChange, clearable = true, canAdd = false, disabled = false, preview = false, props} : Props) => {

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

      if(selected_value && object?.value !== selected_value) {
        if (objectList.length) {
          onChange(null, objectList.find((element: GenericDropdownObj) => element.value === selected_value)??null)
        } else {
          axios.get(`/Defaults/InvoiceCreditTerms`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.credit_terms?.length) {
        setObjectList(store.credit_terms)
      } else {
        dispatch(
          getCreditTerms({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.credit_terms, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: GenericDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<GenericDropdownObj> | undefined) => {
    if (value?.value !== -1) {
      setObject(value);
      handleChange(value ?? null);
    } else {
      toggleOpenAdd();
    }
  }

  return preview ?  <Typography variant={'body1'} sx={{fontWeight: 400}}>{object?.text??"--"}</Typography> : (
    <>
      <CustomAutocomplete
        options={canAdd ? [addNewTerms, ...objectList ?? []] : objectList ?? []}
        sx={{ mb: (props?.sx as any)?.mb??3 }}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={disabled??false}
        getOptionLabel={(option: GenericDropdownObj) => `${option.text}`}
        renderInput={params => <CustomTextField {...params} fullWidth label={t(creditTermsKey)} {...(props??{})} />}
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
              {t(addNewCreditTermsKey)}
            </Box>
          </li>
        ) : (
          <li {...props} key={(option.text??"") + index}>{option.text}</li>
        )}
      />

    </>
  )
}

export default React.memo(CreditTermsSelector);
