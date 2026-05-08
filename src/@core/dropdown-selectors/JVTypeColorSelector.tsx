// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {getDateRange} from "../utils/format";
import {useAuth} from "../../hooks/useAuth";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import Box from "@mui/material/Box";


interface DropdownObj {
  name: string
  value: string
}

const statuses: DropdownObj[] = [
  {
    name: "Green",
    value: 'success'
  },
  {
    name: "Red",
    value: 'danger'
  },
  {
    name: "Orange",
    value: 'warning'
  },
  {
    name: "Blue",
    value: 'info'
  }
]

interface Props {
  selected_value: string | null
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const JVTypeColorSelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.value !== selected_value) {
        setObject(statuses.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      } else {
        setObject(statuses.find((element: any) => `${element.value}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, statuses])


  const onChange = (event: any, value: DropdownObj) => {
    handleChange(value?.value??null);
  }

  return (
    <CustomAutocomplete
      options={statuses}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderOption={(props, option) => {
        const { ...optionProps } = props;
        return (
          <Box
            key={option.value}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <Box sx={{width: 12, height: 12, borderRadius: 20, backgroundColor: `${option.value === 'danger' ? 'error' : option.value}.main`, mr: 2}} />
            {option.name}
          </Box>
        );
      }}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Color')} placeholder={t("Color") as string} {...(props??{})} />}
    />
  )
}

export default JVTypeColorSelector;
