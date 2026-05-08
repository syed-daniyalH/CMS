// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

//** Translation
import {useTranslation} from "react-i18next";
import {PropertyDataParams} from "src/store/inventory-operations/property";
import Typography from '@mui/material/Typography'

interface Props {
  searchData: PropertyDataParams
  clearSearch: () => void
  onChange: (e: any) => void
  onMenuChange: (option: string) => void
}

const TransferListTableToolbar = (props: Props) => {
  const {t} = useTranslation();
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    let isActive = true;

    if (isActive) {
      setValue(props.searchData?.searchModel?.Name?? "");
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
        justifyContent: 'end',
        p: theme => theme.spacing(2, 3, 2, 3)
      }}
    >

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

export default TransferListTableToolbar
