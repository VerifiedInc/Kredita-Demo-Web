import { createTheme } from '@mui/material/styles';
import * as colors from './colors';

declare module '@mui/material/styles' {
  // custom palette
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  // custom typography
  interface TypographyVariants {
    label: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    label?: React.CSSProperties;
  }
}

// custom typography
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    label: true;
  }
}

const typography = {
  fontFamily: 'Lato',
  h1: {
    fontFamily: 'PlayfairDisplay',
    fontSize: '2.125rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
  h2: {
    fontFamily: 'PlayfairDisplay',
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.33,
  },
  h3: {
    fontFamily: 'PlayfairDisplay',
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
  h4: {
    fontFamily: 'Lato',
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  h5: {
    fontFamily: 'Lato',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.15px',
  },
  subtitle1: {
    fontFamily: 'Lato',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  subtitle2: {
    fontFamily: 'Lato',
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: 0.1,
    lineHeight: 1.5,
  },
  body1: {
    fontFamily: 'Lato',
    fontSize: '1.25rem',
    fontWeight: 300,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  body2: {
    fontFamily: 'Lato',
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  button: {
    fontFamily: 'Lato',
    // fontSize set by MUI button component sizes, setting it here will screw that up
    fontWeight: 900,
    letterSpacing: 0,
    lineHeight: 1.2,
    textTransform: 'uppercase' as const,
  },
  caption: {
    font: 'Lato',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.25,
  },
  overline: {
    font: 'Lato',
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.25,
  },
  label: {
    fontFamily: 'Lato',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

// Create a theme instance.

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.green,
      light: colors.lightGreen,
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    error: {
      main: colors.red,
      light: colors.lightRed,
      dark: colors.darkRed,
      contrastText: colors.white,
    },
    warning: {
      main: colors.yellow,
      light: colors.yellow, // lightYellow is too light, makes alerts practically invisible
      dark: colors.darkYellow,
      contrastText: colors.white,
    },
    success: {
      main: colors.green,
      light: colors.green, // lightGreen is too light for alerts
      dark: colors.darkGreen,
      contrastText: colors.white,
    },
    info: {
      main: colors.blue,
      light: colors.lightBlue,
      dark: colors.darkBlue,
      contrastText: colors.white,
    },
    neutral: {
      main: colors.grey,
      light: colors.lightGrey,
      dark: colors.darkGrey,
    },
  },
  components: {
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          ...typography.body2,
          fontSize: '1.1rem',
          fontWeight: 700,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          marginLeft: '0.15rem',
          background: `${colors.white} !important`,
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: '',
            zIndex: -1,
            background: 'var(--background, inherit)',
          },
        },
        shrink: {
          ...typography.label,
          fontSize: '1rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          '& > legend': {
            ...typography.label,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          zIndex: 1305,
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active,&.Mui-completed': {
            color: colors.blue,
          },
        },
        text: {
          fontWeight: 700,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          ...typography.h4,
        },
        root: {},
      },
    },
    MuiAlert: {
      // TODO: figure out how to get alerts to use main colors instead of light
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          ...typography.h4,
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          ...typography.body2,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          ...typography.subtitle2,
        },
      },
    },
  },
  typography,
});
