// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CategoryDropdownObj, getPolicies} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";

interface Props {
  selected_value: number | null
  handleChange: (value: CategoryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  props?: TextFieldProps
}

const PolicySelector = ({selected_value, handleChange, clearable = true, disabled = false, props} : Props) => {

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
        if (objectList.length) {
          setObject(objectList.find((element: CategoryDropdownObj) => element.recno === selected_value))
        } else {
          axios.get(`/Defaults/AllPolicies`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.policies?.length) {
        setObjectList(store.policies)
      } else {
        dispatch(
          getPolicies({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.policies, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: CategoryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CategoryDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: CategoryDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Role')} {...(props??{})} />}
    />
  )
}

export default PolicySelector;
