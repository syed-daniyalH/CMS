// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CategoryDropdownObj, getSalesman} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import Typography from "@mui/material/Typography";

interface Props {
  selected_value: number | null
  handleChange: (value: CategoryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  forceStore?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  props?: TextFieldProps
}

const SalesmanSelector = ({
                            selected_value,
                            handleChange,
                            clearable = true,
                            noBorder = false,
                            preview = false,
                            forceStore = false,
                            disabled = false,
                            props} : Props) => {

  const [object, setObject] = useState<CategoryDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CategoryDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.recno !== selected_value) {
        if (objectList.length || forceStore) {
          setObject(objectList.find((element: CategoryDropdownObj) => element.recno === selected_value))
        } else {
          axios.get(`/Defaults/Employees`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.salesmans?.length || store.salesmans_success) {
        setObjectList(store.salesmans??[])
      } else {
        dispatch(
          getSalesman({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.salesmans, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: CategoryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CategoryDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? (
    <Typography variant={('body1') as any}>{object?.text ? `${object?.text ?? ""}` : ""}</Typography>
  ) : (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb ?? 3 }}
      id='autocomplete-custom-salesman'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: CategoryDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth noBorder={noBorder} placeholder={t("Select Salesman") as string} label={t('Salesman')} {...(props??{})} />}
    />
  )
}

export default SalesmanSelector;
