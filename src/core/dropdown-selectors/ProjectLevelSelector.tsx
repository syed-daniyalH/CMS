// ** Custom imports
import CustomTextField from "../components/mui/text-field";
import CustomAutocomplete from "../components/mui/autocomplete";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {TextFieldProps} from "@mui/material/TextField";


interface DropdownObj {
  name: string
  value: number
}

const statuses: DropdownObj[] = [
  { name: "One Level", value: 1 },
  { name: "Two Level", value: 2 },
  { name: "Three Level", value: 3 },
  { name: "Four Level", value: 4 }
]

interface Props {
  selected_value: number | null
  currentLevel: number
  handleChange: (value: number | null) => void
  props?: TextFieldProps
}

const ProjectLevelSelector = ({selected_value, currentLevel, handleChange, props} : Props) => {

  const [object, setObject] = useState<DropdownObj | null>(null)
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
      sx={{ mb: 0 }}
      id='autocomplete-custom'
      onChange={onChange}
      value={(object??null) as any}
      disableClearable
      getOptionDisabled={(option) => option.value < currentLevel}
      getOptionLabel={(option: DropdownObj) => option?.name || ''}
      renderInput={params => <CustomTextField {...params} fullWidth label={t('Project Level')} placeholder={t("Select Level") as string} {...(props??{})} />}
    />
  )
}

export default ProjectLevelSelector;
