import { useEffect, useRef, useState } from 'react';
import { Link, useFetcher } from '@remix-run/react';
import { Box, Dialog, DialogContent, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import parsePhoneNumber from 'libphonenumber-js';

import { theme } from '~/styles/theme';
import { phoneSchema } from '~/validations/phone.schema';

import PhoneInput from '~/components/PhoneInput';

export function OneClickForm() {
  const [value, setValue] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const validation = phoneSchema.safeParse(value);
  const isValid = validation.success;
  const errorMessage = !validation.success
    ? validation?.error?.format()?._errors?.[0]
    : null;

  const fetcher = useFetcher();
  const isFetching = fetcher.state !== 'idle';
  const fetcherSubmit = fetcher.submit;
  const fetcherData = fetcher.data;
  const phone = fetcherData?.phone ?? null;
  const error = fetcherData?.error;

  const formRef = useRef<HTMLFormElement | null>(null);

  // Submit form when is valid
  useEffect(() => {
    if (!isValid) return;
    fetcherSubmit(formRef.current);
  }, [isValid, fetcherSubmit]);

  // Reset form when is not fetching
  useEffect(() => {
    if (isFetching) return;
    // Reset phone to initial state when is not fetching
    setValue('');
    setTouched(false);
    setCount((prev) => prev + 1);
  }, [isFetching]);

  return (
    <>
      <Typography variant='h1' mt={0} align='center'>
        You're moments
        <br />
        away from magic...
      </Typography>
      <Typography variant='h3' mt={2.5} fontWeight={400}>
        Let’s get you verified!
      </Typography>
      <fetcher.Form
        ref={formRef}
        method='post'
        style={{ width: '100%' }}
        key={count}
      >
        <Box
          component='section'
          display='flex'
          flexDirection='column'
          alignItems='center'
          mt={1}
        >
          <input name='action' value='one-click' hidden readOnly />
          <PhoneInput
            name='phone'
            autoFocus
            value={value}
            onChange={(value) => {
              setValue(value);
              setTouched(true);
            }}
            error={touched && !!errorMessage}
            helperText={(touched && errorMessage) || undefined}
            disabled={isFetching}
          />
          {error && (
            <Typography variant='body2' sx={{ marginTop: 2 }} color={red[500]}>
              {error}
            </Typography>
          )}
        </Box>
      </fetcher.Form>
      <Typography
        variant='caption'
        mt={1.8}
        mb={4.5}
        color='neutral.main'
        sx={{ textAlign: 'center' }}
      >
        By using Kredita, you agree to our{' '}
        <Link
          to='https://www.verified.inc/legal#terms-of-use'
          target='_blank'
          style={{ color: theme.palette.primary.main }}
        >
          Term of Use
        </Link>{' '}
        <br /> and acknowledge our{' '}
        <Link
          to='https://www.verified.inc/legal#privacy-policy'
          target='_blank'
          style={{ color: theme.palette.primary.main }}
        >
          Privacy Policy
        </Link>
        .
      </Typography>
      <Dialog open={!!fetcherData && !error}>
        <DialogContent>
          <Typography fontWeight={700} textAlign='center'>
            Please click the verification link we just texted to <br />
            {parsePhoneNumber(phone ?? '')?.formatNational?.() ?? phone}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
