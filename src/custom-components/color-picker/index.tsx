// ** React Imports
import React, {useState, SyntheticEvent, Fragment, ReactNode, useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import "react-color-palette/css";

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

// ** Type Imports
import {useTranslation} from "react-i18next";
import {useSettings} from "src/@core/hooks/useSettings";
import {ColorPicker, useColor} from "react-color-palette";
import {chooseColorKey} from "../../@core/utils/translation-file";
import CustomTextField from "../../@core/components/mui/text-field";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";



// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: '20%',
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '70%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: '30rem'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

interface Props {
  selectedColor?: string | null,
  label?: string | null,
  onSelectColor: (color: string) => void
}

const CustomColorPicker = ({selectedColor, onSelectColor, label}: Props) => {
  // ** Props
  const [color, setColor] = useColor("#3e3e3f00");
  const { settings } = useSettings();

  const {t} = useTranslation();

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    let isActive = true;

    if(isActive && selectedColor && selectedColor !== color.hex) {
      setColor({hex: selectedColor!, rgb: { r: 62, g: 62, b: 63, a: 1 }, hsv: { h: 0, s: 0, v: 24, a: 1}});
    }

    return () => {
      isActive = false;
    }
  }, [selectedColor]);

  useEffect(() => {
    let isActive = true;

    if(isActive && color && selectedColor !== color.hex && color.hex !== '#3e3e3f00') {
      onSelectColor(color.hex);
    }

    return () => {
      isActive = false;
    }
  }, [color]);

  return (
    <Fragment>
      <CustomTextField
        label={t(label??chooseColorKey)}
        fullWidth
        type={'text'}
        sx={{mb: 2}}
        variant='outlined'
        placeholder={t(chooseColorKey) as string}
        value={color.hex ?? ""}
        onChange={(event) => {
          onSelectColor(event.target.value);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-haspopup='true'  aria-controls='customized-menu'
                edge='end'
                onMouseDown={e => e.preventDefault()}
                onClick={handleDropdownOpen}
                sx={{borderRadius: '4px', p: 0.1}}
              >
                <Box sx={{border: theme => `1px solid ${theme.palette.divider}`,backgroundColor: color.hex, width: '35px', height: '35px', borderRadius: '4px'}} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            m: 0,
            cursor: 'default',
            userSelect: 'auto',
            p: theme => theme.spacing(2, 2),
            backgroundColor: theme => `${theme.palette.primary.main} !important`
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              '& svg': { color: 'text.secondary' },
            }}
          >
            <Typography variant='h6' color={'white'}>{t("Choose Color")}</Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: '0 !important' }} />
        <ScrollWrapper hidden={hidden}>
          <ColorPicker color={color} onChange={setColor} />
        </ScrollWrapper>
      </Menu>
    </Fragment>
  )
}

export default CustomColorPicker
