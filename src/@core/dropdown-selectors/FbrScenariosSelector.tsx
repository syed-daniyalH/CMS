// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {FbrScenarioDropdownObj, getFbrScenarios} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import TypoLabel from "../../custom-components/inputs/TypoLabel";

interface Props {
  selected_value: string | null
  handleChange: (value: FbrScenarioDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  important?: boolean | null
  props?: TextFieldProps
}

const FbrScenariosSelector = ({selected_value, handleChange, clearable = true, disabled = false, important = false, props} : Props) => {

  const [object, setObject] = useState<FbrScenarioDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<FbrScenarioDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.scenerioId !== selected_value) {
        if (objectList.length) {
          setObject(objectList.find((element: FbrScenarioDropdownObj) => element.scenerioId === selected_value))
        } else {
          axios.get(`/Defaults/GetFbrScenerios`, {params: {ScenerioId: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.fbr_scenarios?.length || store.fbr_scenarios_success) {
        setObjectList(store.fbr_scenarios)
      } else {
        dispatch(
          getFbrScenarios({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.fbr_scenarios, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: FbrScenarioDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<FbrScenarioDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom-place-of-supply'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: FbrScenarioDropdownObj) => option?.scenerioId || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={<TypoLabel name={t('Scenario')} important={important??false} />} placeholder={t("Scenario") as string} {...(props??{})} />}
    />
  )
}

export default React.memo(FbrScenariosSelector);
