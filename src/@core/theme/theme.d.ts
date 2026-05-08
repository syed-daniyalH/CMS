//@ts-no-check
// src/theme.d.ts
import { PaletteMode, ThemeOptions } from '@mui/material'

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    customColors: {
      main: string;
      light: string;
      dark: string;
      lightPaperBg?: string;
      darkPaperBg?: string;
      bodyBg?: string;
      trackBg?: string;
      avatarBg?: string;
      linkColor?: string;
      tableHeaderBg?: string;
      textColor?: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      main?: string;
      light?: string;
      dark?: string;
      lightPaperBg?: string;
      darkPaperBg?: string;
      bodyBg?: string;
      trackBg?: string;
      avatarBg?: string;
      linkColor?: string;
      tableHeaderBg?: string;
      textColor?: string;
    };
  }
}
