// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {DocumentTypeEmp, getDocTypes} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {employeeTypesKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  handleChange: (value: DocumentTypeEmp | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
  readOnly?: boolean | null
}

const DocumentTypesSelector = ({selected_value, handleChange, clearable = true, readOnly = false, disabled = false, props}: Props) => {

  const [object, setObject] = useState<DocumentTypeEmp | null | undefined>(null)
  const [objectList, setObjectList] = useState<DocumentTypeEmp[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (selected_value && object?.value !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: DocumentTypeEmp) => element.value === selected_value))
        } else {
          axios.get(`/Dropdowns/GetCustomerDocumentsTypes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if (store.doc_types?.length || store.doc_types_success) {
        setObjectList(store.doc_types)
      } else {
        dispatch(
          getDocTypes({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.doc_types, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: DocumentTypeEmp | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<DocumentTypeEmp> | undefined) => {
    if (value?.value !== -1) {
      setObject(value);
      handleChange(value ?? null);
    }
  }

  return readOnly ? <>{(object?.text??"")}</> :(
    <>
      <CustomAutocomplete
        options={objectList ?? []}
        sx={{mb: 3}}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={disabled ?? false}
        getOptionLabel={(option: DocumentTypeEmp) => option?.text || ''}
        renderInput={params => <CustomTextField {...params} fullWidth label={t(employeeTypesKey)} {...(props ?? {})} />}
        renderOption={(props, option, {index}) => (
          <li {...props} key={(option.text??"") + index}>{option.text}</li>
        )}
      />
    </>
  )
}

export default React.memo(DocumentTypesSelector);
