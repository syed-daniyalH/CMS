// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";
import {useAuth} from "../../hooks/useAuth";
import {LanguageType} from "../../context/types";
import {Box} from "@mui/material";

interface Props {
  selected_value: string | null
  handleChange: (value: string | null) => void
  props?: TextFieldProps
}

const LanguageSelector = ({selected_value, handleChange, props} : Props) => {

  const [object, setObject] = useState<LanguageType | null>(null)
  const [objectList, setObjectList] = useState<LanguageType[]>([])
  const { t } = useTranslation();

  const { user } = useAuth();

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      if(selected_value && object?.languageCode !== selected_value) {
        setObject(objectList.find((element: any) => `${element.languageCode}` === `${selected_value}`)??null)
      } else {
        setObject(objectList.find((element: any) => `${element.languageCode}` === `${selected_value}`)??null)
      }
    }

    return () => {
      isActive = false;
    }
  }, [selected_value, objectList])


  useEffect(() => {
    let isActive = true;

    if(isActive && user?.languages) {
      setObjectList(user?.languages??[]);
    }

    return () => {
      isActive = false;
    }
  }, [])


  const onChange = (event: any, value: LanguageType) => {
    handleChange(value?.languageCode??null);
  }

  return (
    <CustomAutocomplete
      options={objectList}
      sx={{ mb: 3 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionLabel={(option: LanguageType) => option?.name || ''}
      renderOption={(props, option: LanguageType) => {
        const { ...optionProps } = props;
        return (
          <Box
            key={option.countryCode}
            component="li"
            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
            {...optionProps}
          >
            <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.countryCode.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.countryCode.toLowerCase()}.png`}
              alt=""
            />
            {option.name}
          </Box>
        );
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          fullWidth label={t('Language')} placeholder={t("Language") as string} {...(props??{})}
        />
      )}
    />
  )
}

export default LanguageSelector;
