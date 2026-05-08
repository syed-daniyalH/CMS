// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import React, {SyntheticEvent, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {CategoryDropdownObj, getSubCategories} from "../../store/dropdowns";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "src/store";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {AutocompleteChangeDetails, AutocompleteChangeReason, Box} from "@mui/material";
import {addNewSubCategoryKey, subCategoryKey} from "../utils/translation-file";
import Icon from "../components/icon";

interface Props {
  selected_value: number | null
  category_id: number | string | null
  handleChange: (value: CategoryDropdownObj | null) => void
  clearable?: boolean | null
  disabled?: boolean | null
  canAdd?: boolean | null
  props?: TextFieldProps
}


const addNewSubCategory: CategoryDropdownObj = {
  recno: -1,
  text: "Add New Sub Category",
  code: '-1'
}

const SubCategorySelector = ({selected_value, category_id, canAdd = false, handleChange, clearable = true, disabled = false, props} : Props) => {

  const [object, setObject] = useState<CategoryDropdownObj | null | undefined>(null)
  const [objectList, setObjectList] = useState<CategoryDropdownObj[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.dropdowns)
  const [openAdd, setOpenAdd] = useState<boolean>(false);


  // ** translation
  const {t} = useTranslation();


  const toggleOpenAdd = () => {
    setOpenAdd(!openAdd);
  }


  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if(selected_value && object?.recno !== selected_value) {
        if (objectList.length) {
          onChange(null, objectList.find((element: CategoryDropdownObj) => element.recno === selected_value)??null)
        } else {
          axios.get(`/Defaults/InventorySubCategories`, {params: {Recno: selected_value}}).then(response => response.data).then((data: AxiosResponse<any>) => {
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
  }, [selected_value])

  useEffect(() => {
    let isActive = true;

    if(isActive) {

      if((store.sub_categories?.length || store.sub_category_success) && `${store.sub_categories_params.CategoryId}` === `${category_id}`) {
        setObjectList(store.sub_categories)
      } else {
        dispatch(
          getSubCategories({
            CategoryId: category_id
          })
        )
      }
    }

    return () => {
      isActive = false;
    }
  }, [store.sub_categories, category_id, dispatch])


  const onChange = (_event: SyntheticEvent<Element, Event> | null, value: CategoryDropdownObj | null, _reason?: AutocompleteChangeReason, _details?: AutocompleteChangeDetails<CategoryDropdownObj> | undefined) => {
    if (value?.recno !== -1) {
      setObject(value);
      handleChange(value ?? null);
    } else {
      toggleOpenAdd();
    }
  }

  return (
    <>
    <CustomAutocomplete
      options={canAdd ? [addNewSubCategory, ...objectList ?? []] : objectList ?? []}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={object}
      disableClearable={!clearable}
      disabled={disabled??false}
      isOptionEqualToValue={(option, value) => option.recno === value.recno}
      getOptionLabel={(option: CategoryDropdownObj) => option?.text || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t(subCategoryKey)} {...(props??{})} />}
      renderOption={(props, option, {inputValue, index}) => option.recno === -1 ? (
        <li {...props} key={option.text + index} style={{borderRadius: '8px', border: '1px solid gray'}}>
          <Box sx={{
            width: '100%',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            '& svg': {mr: 2}
          }}>
            <Icon icon='tabler:plus' fontSize='1.125rem'/>
            {t(addNewSubCategoryKey)}
          </Box>
        </li>
      ) : (
        <li {...props} key={option.text + index}>{option.text}</li>
      )}
    />

    </>
  )
}

export default SubCategorySelector;
