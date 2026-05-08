// @ts-nocheck

import { Palette } from '@mui/material'
import { Skin } from 'src/@core/layouts/types'
import { brandConfigs } from '../../../configs/branding'

const DefaultPalette = (mode: Palette['mode'], skin: Skin): Palette => {

  const whiteColor = '#FFF'

  const lightColor = '47, 43, 61'
  const darkColor = '208, 212, 241'

  const darkPaperBgColor = '#2F3349'
  const mainColor = mode === 'light' ? lightColor : darkColor

  // ================= BACKGROUND =================
  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') return whiteColor
    if (skin === 'bordered' && mode === 'dark') return darkPaperBgColor
    if (mode === 'light') return '#F8F7FA'
    return '#25293C'
  }

  return {
    mode,

    // ================= CUSTOM COLORS =================
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C',
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      linkColor: mode === 'light' ? '#F05C44' : '#FF7A66',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
      textColor: mode === 'light' ? '#000' : '#e1e2e7'
    },

    // ================= COMMON =================
    common: {
      black: '#000',
      white: whiteColor
    },

    // ================= PRIMARY =================
    primary: {
      light: '#FF7A66',
      main: '#F05C44',
      dark: '#D94A33',
      contrastText: '#FFF'
    },

    // ================= SECONDARY =================
    secondary: {
      light: '#6B7078',
      main: '#51555D',
      dark: '#3E4248',
      contrastText: '#FFF'
    },

    // ================= STATUS COLORS =================
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: '#FFF'
    },

    warning: {
      light: '#FFB976',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: '#FFF'
    },

    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: '#FFF'
    },

    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: '#FFF'
    },

    // ================= GREY SCALE =================
    grey: {
      50: '#FAFAFA',
      100: '#F4F5F7',
      200: '#E6E8EB',
      300: '#D1D4D8',
      400: '#A7ABB1',
      500: '#7D828A',
      600: '#5C6168',
      700: '#3F4349',
      800: '#2A2D31',
      900: '#16181B',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161'
    },

    // ================= TEXT =================
    text: {
      primary: `rgba(${mainColor}, 0.78)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.42)`
    },

    divider: `rgba(${mainColor}, 0.16)`,

    // ================= BACKGROUND =================
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor()
    },

    // ================= ACTION =================
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.06)`,
      selectedOpacity: 0.06,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`
    }
  } as Palette
}

export default DefaultPalette