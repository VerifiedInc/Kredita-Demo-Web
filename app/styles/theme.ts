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

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    largeMobile: true;
  }
}

const typography = {
  fontFamily: 'Nunito',
  h1: {
    fontSize: '2.125rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.33,
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.35,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  h5: {
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
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: 0.1,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1.25rem',
    fontWeight: 300,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  body2: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.1875,
  },
  button: {
    // fontSize set by MUI button component sizes, setting it here will screw that up
    fontWeight: 900,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.25,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: 1.25,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
};

// Create a theme instance.

export const theme = (_theme: { main: string; light: string; dark: string }) =>
  createTheme({
    palette: {
      primary: {
        main: _theme.main,
        light: _theme.light,
        dark: _theme.dark,
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
            marginLeft: '0.5rem',
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
      MuiInputBase: {
        defaultProps: {
          sx: {
            borderRadius: 28,
            pl: 0,
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
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
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
            '& .MuiPaper-root': {
              borderRadius: 30,
            },
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 32,
            paddingBottom: 32,
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
      MuiButton: {
        styleOverrides: {
          text: {
            color: colors.white,
          },
          root: {
            textTransform: 'none',
            borderRadius: 30,
          },
          outlined: {
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          },
        },
        defaultProps: {
          size: 'large',
          variant: 'contained',
          type: 'submit',
          sx: {
            mt: 4,
            py: 2,
            px: 3.5,
            fontSize: '1.4rem',
          },
        },
      },
    },
    typography,
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, largeMobile: 415 },
    },
  });
