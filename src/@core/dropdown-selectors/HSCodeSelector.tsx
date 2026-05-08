// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {HSCodeDropdownObj, getHSCodes} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import Typography from "@mui/material/Typography";

interface Props {
  selected_value: string | null
  handleChange: (value: HSCodeDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  forceStore?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  props?: TextFieldProps
}

const HSCodeSelector = ({
                            selected_value,
                            handleChange,
                            clearable = true,
                            noBorder = false,
                            preview = false,
                            forceStore = false,
                            disabled = false,
                            props} : Props) => {

  const [object, setObject] = useState<HSCodeDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<HSCodeDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.hsCode !== selected_value) {
        if (objectList.length || forceStore) {
          setObject(objectList.find((element: HSCodeDropdownObj) => element.hsCode === selected_value))
        } else {
          axios.get(`/Defaults/GetFbrHsCodes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.hsCodes?.length || store.hsCodes_success) {
        setObjectList(store.hsCodes??[])
      } else {
        dispatch(
          getHSCodes({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.hsCodes, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: HSCodeDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<HSCodeDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? (
    <Typography variant={('body1') as any}>{object?.hsCode ? `${object?.hsCode ?? ""}` : ""}</Typography>
  ) : (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb ?? 3 }}
      id='autocomplete-custom-hs-code'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: HSCodeDropdownObj) => option?.hsCode || ''}
      renderInput={params => <CustomTextField {...params} fullWidth noBorder={noBorder} placeholder={t("Select HS Code") as string} label={t('HS Code')} {...(props??{})} />}
    />
  )
}

export default HSCodeSelector;
