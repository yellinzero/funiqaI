/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// mui-theme.d.ts
import { Theme as MuiTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    vars: Record<string, any>;
  }
  interface ThemeOptions {
    vars?: Record<string, any>;
  }
}