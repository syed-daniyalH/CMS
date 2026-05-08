// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {TaxTreatmentDropdownObj, getTaxTreatments} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason} from "@mui/material";
import Typography from "@mui/material/Typography";

interface Props {
  selected_value: number | null
  handleChange: (value: TaxTreatmentDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  preview?: boolean | null
  props?: TextFieldProps
}

const TaxTreatmentSelector = ({selected_value, handleChange, clearable = true, disabled = false, preview = false, props} : Props) => {

  const [object, setObject] = useState<TaxTreatmentDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<TaxTreatmentDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)


  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.value !== selected_value) {
        if (objectList.length) {
          onChange(null, objectList.find((element: TaxTreatmentDropdownObj) => element.value === selected_value)??null)
        } else {
          axios.get(`/Defaults/GetTaxTreatmentTypes`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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

      if(store.tax_treatments?.length) {
        setObjectList(store.tax_treatments)
      } else {
        dispatch(
          getTaxTreatments({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.tax_treatments, dispatch])


  const onChange = (_event: SyntheticEvent<Element | null, Event> | null, value: TaxTreatmentDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<TaxTreatmentDropdownObj> | undefined) => {
    setObject(value);
    handleChange(value??null);
  }

  return preview ? <Typography variant={'body1'} sx={{fontWeight: 400}}>{object?.text??"--"}</Typography> : (
    <CustomAutocomplete
      options={objectList??[]}
      sx={{ mb: (props?.sx as any)?.mb??3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      getOptionLabel={(option: TaxTreatmentDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Tax Treatment')} {...(props??{})} />}
    />
  )
}

export default TaxTreatmentSelector;
