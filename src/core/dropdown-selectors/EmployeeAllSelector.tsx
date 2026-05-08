// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CategoryDropdownObj, getAllEmployees} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {employeeKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  preview?: boolean | null
  previewCode?: boolean | null
  handleChange: (value: CategoryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  forceStore?: boolean | null
  noBorder?: boolean | null
  props?: TextFieldProps
}

const EmployeeAllSelector = ({selected_value, preview = false, previewCode = false, noBorder = false, forceStore = false, handleChange, clearable = true, disabled = false, props}: Props) => {

  const [object, setObject] = useState<CategoryDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CategoryDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();

  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (selected_value && object?.recno !== selected_value) {
        if (objectList.length || forceStore) {
          setObject(objectList.find((element: CategoryDropdownObj) => `${element.recno}` === `${selected_value}`))
        } else {
          axios.get(`/Defaults/PayRollEmployees`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0])
            }
          })
        }
      } else {
        if(!selected_value) {
          setObject(null);
        }
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if ((store.all_employees?.length || store.all_employees_success)) {
        setObjectList(store.all_employees)
      } else {
        dispatch(
          getAllEmployees({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.all_employees, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: CategoryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CategoryDropdownObj> | undefined) => {
    if (value?.recno !== -1) {
      setObject(value);
      handleChange(value ?? null);
    }
  }

  return (
    <>
      {
        preview ?
          `${object?.text??""}`
          :
          previewCode ?
          `${object?.code??""}`
          :
        <CustomAutocomplete
          options={objectList ?? []}
          sx={{mb: (props?.sx as any)?.mb??3}}
          id='autocomplete-custom'
          onChange={onChange}
          value={object}
          disableClearable={!clearable}
          disabled={disabled ?? false}
          getOptionLabel={(option: CategoryDropdownObj) => option?.text || ''}
          renderInput={params => <CustomTextField {...params} fullWidth label={t(employeeKey)} placeholder={t(employeeKey) as string} noBorder={noBorder} {...(props ?? {})} />}
          renderOption={(props, option, {index}) => (
            <li {...props} key={(option.text ?? "") + index}>{option.text}</li>
          )}
        />
      }
    </>
  )
}

export default React.memo(EmployeeAllSelector);
