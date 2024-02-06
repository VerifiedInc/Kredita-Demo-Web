import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Stack,
  StackProps,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
} from '@mui/material';
import { v4 as uuid } from 'uuid';

type OTPInputProps = {
  name?: string;
  onChange?(event: { target: { value: string } }): void;
  disabled?: boolean;
};

export type OTPInputInstance = Readonly<{
  focus(): void;
  blur(): void;
  clear(): void;
}> & { get value(): string; set value(newValue: string) };

/**
 * OTP input component that displays individual field for each value.
 * @param props
 * @param ref
 * @constructor
 */
function OTPInputComponent(
  props: OTPInputProps,
  ref: ForwardedRef<OTPInputInstance> | null
) {
  const theme = useTheme();
  // Generate unique ids for each input.
  const ids = useRef(Array.from({ length: 6 }, () => uuid()));
  const [values, setValues] = useState<(string | undefined)[]>(
    Array.from({ length: 6 }, () => undefined)
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [isFocused, setIsFocused] = useState(false);

  // Control inputs from outside via ref.
  useImperativeHandle(
    ref,
    () => ({
      get value() {
        return values.join('');
      },
      set value(newValue: string) {
        setValues(newValue.split(''));
        // Trigger onChange when the value is set from outside.
        props.onChange?.({ target: { value: newValue } });
      },
      focus() {
        inputsRef.current[0]?.click();
        inputsRef.current[0]?.focus();
      },
      blur() {
        inputsRef.current.forEach((input) => input?.blur());
      },
      clear() {
        setValues(Array.from({ length: 6 }, () => undefined));
      },
    }),
    [props, values]
  );

  const inputContainerProps: StackProps = {
    boxSizing: 'content-box',
    direction: 'row',
    alignItems: 'center',
    spacing: 1.25,
    sx: {
      '& input': {
        textAlign: 'center',
        fontWeight: 500,
        height: 30,
        [theme.breakpoints.down('xs')]: {
          height: 16,
          fontSize: 16,
          pt: 1,
          pb: 1,
          px: 0,
        },
        [theme.breakpoints.up('xs')]: {
          fontSize: 16,
          px: 0,
          py: 0.5,
        },
        fontSize: 32,
        py: 1.75,
      },
    },
  };
  const inputProps: TextFieldProps = useMemo(
    () => ({
      inputProps: {
        inputMode: 'numeric',
        maxLength: 1,
      },
      sx: {
        ...(isFocused && {
          '&:hover fieldset': {
            borderColor: `${theme.palette.primary.main}!important`,
          },
          '& fieldset': {
            borderWidth: 2,
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    }),
    [isFocused, theme.palette.primary.main]
  );

  const handleChange = useCallback(
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const indexToChange = index;
      const value = event.target.value;

      // Allow numbers only.
      if (!value.length || !/^[0-9]$/.test(value)) return;

      inputsRef.current[index + 1]?.focus();

      setValues((prev) => {
        const newValue = [...prev];
        newValue[indexToChange] = value;
        const newValueString = newValue.join('');

        if (inputRef.current) {
          inputRef.current.value = newValue.join('');
        }

        // Calls onChange when all OTP fields are filled.
        if (newValueString.length === 6) {
          props.onChange?.({ target: { value: newValueString } });
        }

        return newValue;
      });
    },
    [props]
  );

  const handleKeyUp = useCallback(
    (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Backspace') {
        const indexToChange = index;
        const currentInput = inputsRef.current[index];

        if (currentInput) {
          setValues((prev) => {
            const newValue = [...prev];
            newValue[indexToChange] = undefined;

            if (inputRef.current) {
              inputRef.current.value = newValue.join('');
            }

            return newValue;
          });
        }

        inputsRef.current[index - 1]?.focus();
        inputsRef.current[index - 1]?.select();
      }
    },
    []
  );

  const renderInputGroup = useCallback(
    (startIndex: number) => {
      return new Array(3).fill(undefined).map((_, index) => (
        <TextField
          key={ids.current[index + startIndex]}
          inputRef={(input) =>
            ((inputsRef.current[index + startIndex] as any) = input)
          }
          {...inputProps}
          autoComplete='one-time-code'
          autoFocus={index + startIndex === 0}
          value={values[index + startIndex] || ''}
          disabled={props.disabled}
          onChange={handleChange(index + startIndex)}
          onKeyUp={handleKeyUp(index + startIndex)}
          onPaste={(e) => {
            // Detect the otp pattern and automatically fill the value.
            const possiblyOTP = String(
              e.clipboardData.getData('text/plain')
            ).replace(/[^0-9]/gm, '');
            if (/^[0-9]{6}$/.test(possiblyOTP)) {
              setValues(possiblyOTP.split(''));
              props.onChange?.({ target: { value: possiblyOTP } });
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      ));
    },
    [handleChange, handleKeyUp, inputProps, props, values]
  );

  return (
    <Box width='100%'>
      {/* Use input facade to update the value and listen to changes */}
      <TextField
        inputRef={inputRef}
        name={props.name}
        type='text'
        value={values.join('') || ''}
        sx={{ pointerEvents: 'none', display: 'none' }}
        inputProps={{ hidden: true }}
      />
      <Stack {...inputContainerProps}>
        {renderInputGroup(0)}
        <Typography sx={{ fontWeight: '700', fontSize: 32 }}>-</Typography>
        {renderInputGroup(3)}
      </Stack>
    </Box>
  );
}

export const OTPInput = forwardRef(OTPInputComponent);
