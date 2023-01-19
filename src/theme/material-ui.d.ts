import '@mui/material/styles/createPalette';
import {
  PaletteColorOptions,
  SimplePaletteColorOptions,
} from '@mui/material/styles/createPalette';
import 'thebadge-ui-library/dist/assets/material-ui.d.ts';

// TODO Do the right augmentation

export interface TheBadgeColors {
  blue: true;
  purple: true;
  green: true;
  pink: true;
  white: true;
  deepPurple: true;
  darkGreen: true;
  darkBlue: true;
}

declare module '@mui/material' {
  export interface ButtonPropsColorOverrides extends TheBadgeColors {}
  export interface AlertPropsColorOverrides extends TheBadgeColors {}
  export interface AppBarPropsColorOverrides extends TheBadgeColors {}
  export interface PaginationItemPropsColorOverrides extends TheBadgeColors {}
  export interface BadgePropsColorOverrides extends TheBadgeColors {}
  export interface ButtonGroupPropsColorOverrides extends TheBadgeColors {}
  export interface CardPropsColorOverrides extends TheBadgeColors {}
  export interface CheckboxPropsColorOverrides extends TheBadgeColors {}
  export interface ChipPropsColorOverrides extends TheBadgeColors {}
  export interface CircularProgressPropsColorOverrides extends TheBadgeColors {}
  export interface FabPropsColorOverrides extends TheBadgeColors {}
  export interface FormLabelPropsColorOverrides extends TheBadgeColors {}
  export interface IconPropsColorOverrides extends TheBadgeColors {}
  export interface IconButtonPropsColorOverrides extends TheBadgeColors {}
  export interface InputBasePropsColorOverrides extends TheBadgeColors {}
  export interface LinearProgressPropsColorOverrides extends TheBadgeColors {}
  export interface PaginationPropsColorOverrides extends TheBadgeColors {}
  export interface RadioPropsColorOverrides extends TheBadgeColors {}
  export interface SliderPropsColorOverrides extends TheBadgeColors {}
  export interface SvgIconPropsColorOverrides extends TheBadgeColors {}
  export interface SwitchPropsColorOverrides extends TheBadgeColors {}
  export interface TextFieldPropsColorOverrides extends TheBadgeColors {}
  export interface ToggleButtonPropsColorOverrides extends TheBadgeColors {}
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title1: true;
    title2: true;
    title3: true;
    title4: true;
    title5: true;
    body3: true;
    body4: true;
  }
}

declare module '@mui/material/styles/createTypography' {
  // allow configuration using `createTheme`
  export interface TypographyOptions {
    title1: TypographyStyleOptions;
    title2: TypographyStyleOptions;
    title3: TypographyStyleOptions;
    title4: TypographyStyleOptions;
    title5: TypographyStyleOptions;
    body3: TypographyStyleOptions;
    body4: TypographyStyleOptions;
  }
}

declare module '@mui/material/styles' {
  export interface Palette {
    blue: SimplePaletteColorOptions;
    purple: SimplePaletteColorOptions;
    green: SimplePaletteColorOptions;
    darkGreen: SimplePaletteColorOptions;
    pink: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;
    deepPurple: SimplePaletteColorOptions;
    darkBlue: SimplePaletteColorOptions;
  }

  // allow configuration using `createTheme`
  export interface PaletteOptions {
    blue: PaletteColorOptions;
    purple: PaletteColorOptions;
    green: PaletteColorOptions;
    darkGreen: PaletteColorOptions;
    pink: PaletteColorOptions;
    white: PaletteColorOptions;
    deepPurple: PaletteColorOptions;
    darkBlue: PaletteColorOptions;
  }

  export interface Theme {
    customSizes: {
      icon: number;
      avatar: number;
    };
  }

  // Allow to use it in useMediaQuery
  export interface BreakpointOverrides {
    //  mobile: true
    //  tablet: true
    //  laptop: true
    //  desktop: true
  }
}
