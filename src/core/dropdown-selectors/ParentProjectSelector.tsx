// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {ProjectDropdownObj, getParentProjects} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Icon from 'src/core/components/icon';
import {addNewCustomerKey} from "../utils/translation-file";

interface Props {
  selected_value?: number | null
  handleChange: (value: ProjectDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  noBorder?: boolean | null
  preview?: boolean | null
  forceStore?: boolean | null
  variant?: string | null
  props?: TextFieldProps
}

const ParentProjectSelector = ({
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

  const [object, setObject] = useState<ProjectDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<ProjectDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)

  // ** translation
  const {t} = useTranslation();


  useEffect(() => {
    let isActive = true;

    if (isActive) {
      if ((selected_value && `${object?.recno ?? null}` !== `${selected_value}`)) {
        if (objectList.length || forceStore) {
          onChange(null, objectList.find((element: ProjectDropdownObj) => (`${element.recno ?? null}` === `${selected_value}`)) ?? null)
        } else {
          axios.get(`/Defaults/GetParentProjects`, {
            params: {
              Recno: selected_value
            }
          }).then(response => response.data).then((data: AxiosResponse<any>) => {
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
  }, [selected_value, objectList])

  useEffect(() => {
    let isActive = true;

    if (isActive) {

      if (store.parent_projects?.length || store.parent_projects_success) {
        setObjectList(store.parent_projects??[]);

      } else {
        dispatch(
          getParentProjects({})
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.parent_projects, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: ProjectDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<ProjectDropdownObj> | undefined) => {
    if (value?.recno !== -1) {
      setObject(value);
      handleChange(value ?? null);
    }
  }

  return preview ? (
    <Typography variant={(variant ?? 'body1') as any} sx={{textTransform: 'capitalize'}}>{object?.name ? `${object?.name ?? ""}` : ""}</Typography>
  ) : (
    <>
      <CustomAutocomplete
        options={objectList??[]}
        sx={{mb: (props?.sx as any)?.mb ?? 3}}
        id='autocomplete-custom'
        onChange={onChange}
        value={object}
        disableClearable={!clearable}
        disabled={disabled ?? false}
        getOptionLabel={(option: ProjectDropdownObj) => option?.name || ''}
        renderInput={params => <CustomTextField {...params} noBorder={noBorder} fullWidth
                                                placeholder={t("Select Project") as string}
                                                label={t('Customer')} {...(props ?? {})} />}
        renderOption={(props, option, {index}) => option.recno === -1 ? (
          <li {...props} key={option.name + index} style={{borderRadius: '8px', border: '1px solid gray'}}>
            <Box sx={{
              width: '100%',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              '& svg': {mr: 2}
            }}>
              <Icon icon='tabler:plus' fontSize='1.125rem'/>
              {t(addNewCustomerKey)}
            </Box>
          </li>
        ) : (
          <li {...props} key={option.name + index}>{option.name} {`(Level ${option.projectLevel})`}</li>
        )}
      />
    </>
  )
}

export default ParentProjectSelector;
