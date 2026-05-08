// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/core/components/icon'

//** Translation
import {useTranslation} from "react-i18next";
import TitleMenu from "src/core/components/title-menu";
import {EmployeeDocumentsParams} from "../../../../store/dashboard";

interface Props {
  value: string
  searchData: EmployeeDocumentsParams
  clearSearch: () => void
  onChange: (e: any) => void
  onMenuChange: (option: string) => void
}

const EDTableToolbar = (props: Props) => {
  const {t} = useTranslation();
  const [selectedType, setSelectedType] = useState<string>(props.searchData.DocumentStatus === "Expiring" ? "Expiring Documents" : props.searchData.DocumentStatus === "Expired"  ? "Expired Documents" : "All Documents" );

  const [value, setValue] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    if(isActive) {
      setValue(props.searchData?.DocumentName??"");
      if(props.searchData.DocumentStatus === "Expiring") {
        setSelectedType("Expiring Documents");
      } else if(props.searchData.DocumentStatus === "Expired") {
        setSelectedType("Expired Documents");
      } else {
        setSelectedType("All Documents");
      }
    }

    return () => {
      isActive = false;
    }
  }, [props.searchData])

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <TitleMenu onClick={(option: string) => {
        if(option !== selectedType) {
          setSelectedType(option);
          props.onMenuChange(option);
        }
      }} options={[t("All Documents"), t("Expiring Documents"), t("Expired Documents")] as string[]} text={t(selectedType) as string} />
      <CustomTextField
        value={value}
        placeholder={t('Press Enter to Search…') as string}
        onChange={(e) => setValue(e.target.value??"")}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            props.onChange({target: {value: value}})
          }
        }}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <Icon fontSize='1.25rem' icon='tabler:search' />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
              <Icon fontSize='1.25rem' icon='tabler:x' />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          '& .MuiInputBase-root > svg': {
            mr: 2
          }
        }}
      />
    </Box>
  )
}

export default EDTableToolbar
