// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import { GenericDropdownObj, getAgents } from '../../store/dropdowns'
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Icon from 'src/core/components/icon';
import TypoLabel from '../../components/inputs/TypoLabel'

interface Props {
  selected_value: number | null
  handleChange: (value: GenericDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  showAgentsOnly?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  forceStore?: boolean | null
  canAdd?: boolean | null
  variant?: string | null
  props?: TextFieldProps
}

const AgentSelector = ({
                            selected_value,
                            handleChange,
                            clearable = true,
                            disabled = false,
                            noBorder = false,
                            preview = false,
                            forceStore = false,
                            variant,
                            props
                          }: Props) => {

  const [object, setObject] = useState<GenericDropdownObj | null>(null)
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [objectList, setObjectList] = useState<GenericDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)

  // ** translation
  const {t} = useTranslation();


  const toggleOpenAdd = () => {
    setOpenAdd(!openAdd);
  }


  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if (selected_value && `${object?.value}` !== `${selected_value}`) {
        if (objectList.length || forceStore) {
          onChange(null, objectList.find((element: GenericDropdownObj) => (`${element.value}` === `${selected_value}`))??null)
        } else {
          axios.get(`/Dropdowns/GetActiveAgents`, {
            params: {
              AgentId: selected_value
            }
          }).then(response => response.data).then((data: AxiosResponse<any>) => {
            if (data.data.length > 0) {
              onChange(null, data.data[0])
            }
          })
        }
      } else if(!selected_value) {
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

      if (store.agents?.length || store.agents_success) {
            setObjectList(store.agents??[]);
      } else {
        dispatch(
          getAgents({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.agents, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: GenericDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<GenericDropdownObj> | undefined) => {
    if (value?.value !== -1) {
      setObject(value??null);
      handleChange(value ?? null);
    } else {
      toggleOpenAdd();
    }
  }

  return preview ? (
    <Typography variant={(variant ?? 'body1') as any}>{object?.text ? `${object?.text ?? ""}` : ""}</Typography>
  ) : (
    <>
      <CustomAutocomplete
        options={objectList??[]}
        sx={{mb: (props?.sx as any)?.mb ?? 3}}
        id='autocomplete-custom-customer'
        onChange={onChange}
        value={object??null}
        disableClearable={!clearable}
        isOptionEqualToValue={(option, value) => option?.value === value?.value}
        disabled={disabled ?? false}
        getOptionLabel={(option: GenericDropdownObj) => (option?.text??"")}
        renderInput={params => <CustomTextField {...params} noBorder={noBorder} fullWidth
                                                placeholder={t("Select Agent") as string}
                                                label={<TypoLabel name={'Agent'} />} {...(props ?? {})} />}
        renderOption={(props, option, {index}) => (
          <li {...props} key={(option.text??"") + index}>{option.text}</li>
        )}
      />
    </>
  )
}

export default AgentSelector;
