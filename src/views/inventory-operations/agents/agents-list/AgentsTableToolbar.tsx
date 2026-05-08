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
import {AgentDataParams} from "src/store/inventory-operations/agents";
import TitleMenu from "src/core/components/title-menu";

interface Props {
  searchData: AgentDataParams
  clearSearch: () => void
  onChange: (e: any) => void
  onMenuChange: (option: string) => void
}

const AgentsTableToolbar = (props: Props) => {
  const {t} = useTranslation();

  const [selectedType, setSelectedType] = useState<string>(props.searchData?.searchModel?.Status === "active" ? "Active Agents" : props.searchData?.searchModel?.Status === "in-active" ? "In-Active Agents" : "All Agents");
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      setValue(props.searchData?.searchModel?.Name?? "");
      if (props.searchData?.searchModel?.Status === "active") {
        setSelectedType("Active Agents");
      } else if (props.searchData?.searchModel?.Status === "in-active") {
        setSelectedType("In-Active Agents");
      } else {
        setSelectedType("All Agents");
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
        setSelectedType(option);
        props.onMenuChange(option);
      }} options={[t("All Agents"), t("Active Agents"), t("In-Active Agents")] as string[]}
                 text={t(selectedType) as string}/>

      <Box>
        <CustomTextField
          value={value}
          placeholder='Press Enter to Search…'
          onChange={(e) => setValue(e.target.value ?? "")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.onChange({target: {value: value}})
            }
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{mr: 2, display: 'flex'}}>
                <Icon fontSize='1.25rem' icon='tabler:search'/>
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <Icon fontSize='1.25rem' icon='tabler:x'/>
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
    </Box>
  )
}

export default AgentsTableToolbar
