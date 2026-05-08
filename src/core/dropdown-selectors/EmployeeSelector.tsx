// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {EmployeeDropdownObj, getEmployees} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import {employeeKey} from "../utils/translation-file";

interface Props {
  selected_value: number | null
  payPeriodId: number | null
  preview?: boolean | null
  previewCode?: boolean | null
  handleChange: (value: EmployeeDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const EmployeeSelector = ({selected_value, payPeriodId, preview = false, previewCode = false, handleChange, clearable = true, disabled = false, props}: Props) => {

  const [object, setObject] = useState<EmployeeDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<EmployeeDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();

  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (selected_value && object?.id !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: EmployeeDropdownObj) => element.id === selected_value))
        } else {
          axios.get(`/Defaults/GetPayRollEmployees/${payPeriodId}`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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
  }, [selected_value])

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if(payPeriodId) {
        if ((store.employees?.length || store.employees_success) && payPeriodId === store.employees_params?.payPeriodId) {
          setObjectList(store.employees)
        } else {
          dispatch(
            getEmployees({
              payPeriodId
            })
          )
        }
      } else {
        setObjectList([])
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.employees, payPeriodId, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: EmployeeDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<EmployeeDropdownObj> | undefined) => {
    if (value?.id !== -1) {
      setObject(value);
      handleChange(value ?? null);
    }
  }

  return (
    <>
      {
        preview ?
          `${object?.name??""} ${object?.lName??""}`
          :
          previewCode ?
          `${object?.code??""}`
          :
        <CustomAutocomplete
          options={objectList ?? []}
          sx={{mb: 3}}
          id='autocomplete-custom'
          onChange={onChange}
          value={object}
          disableClearable={!clearable}
          disabled={disabled ?? false}
          getOptionLabel={(option: EmployeeDropdownObj) => `${option.name??""} ${option.lName??""}`}
          renderInput={params => <CustomTextField {...params} fullWidth label={t(employeeKey)} {...(props ?? {})} />}
          renderOption={(props, option, {index}) => (
            <li {...props} key={(option.name ?? "") + index}>{`${option.name??""} ${option.lName??""}`}</li>
          )}
        />
      }
    </>
  )
}

export default React.memo(EmployeeSelector);
