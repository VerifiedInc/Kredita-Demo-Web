import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFetcher, useSearchParams } from '@remix-run/react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import parsePhoneNumber from 'libphonenumber-js';

import { phoneSchema } from '~/validations/phone.schema';
import { birthdaySchema } from '~/validations/birthday.schema';
import { useBrand } from '~/hooks/useBrand';
import { useField } from '~/hooks/useField';
import PhoneInput from '~/components/PhoneInput';

import { OneClickHeader } from '~/features/register/components/OneClickHeader';
import { OneClickLegalText } from '~/features/register/components/OneClickLegalText';
import { InputMask } from '~/components/InputMask';
import { oneClickNonHostedSchema } from '~/validations/oneClickNonHosted.schema';

export function OneClickFormNonHosted() {
  const brand = useBrand();

  const phone = useField('phone', phoneSchema);
  const birthday = useField('birthday', birthdaySchema);

  const [count, setCount] = useState<number>(0);

  const [searchParams] = useSearchParams();
  const isRedirect = searchParams.get('redirect') === 'true';

  const fetcher = useFetcher();
  const isFetching = fetcher.state !== 'idle';
  const fetcherSubmit = fetcher.submit;
  const fetcherData = fetcher.data;
  const phoneFetcherData = fetcherData?.phone ?? null;
  const phoneRef = useRef<string | null>(fetcherData?.phone ?? null);
  const error = fetcherData?.error;
  const isSuccess = fetcherData?.success ?? false;

  const formRef = useRef<HTMLFormElement | null>(null);

  const redirectUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleFieldChange =
    (field: ReturnType<typeof useField>) =>
    (event: string | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = typeof event === 'string' ? event : event.target.value;
      field.change(value);

      const isFormValid = oneClickNonHostedSchema.safeParse({
        phone: phone.value,
        birthday: birthday.value,
        // Override the field that is being changed.
        [field.name]: value,
      }).success;

      // Short-circuit if is not valid or is already fetching
      if (!isFormValid || isFetching) return;

      // HACK-alert
      // phone input uses another input to hold original value,
      // as the form submits on change event of the masked input,
      // we have to wait the next tick to have the unmasked input value set on the form.
      setTimeout(() => {
        console.log('form is valid, fetching now...');
        fetcherSubmit(formRef.current, { method: 'post' });
      }, 10);
    };

  // Reset form when is not fetching
  useEffect(() => {
    if (isFetching) return;
    // Reset phone and birthday to initial state when is not fetching
    phone.reset();
    birthday.reset();
    setCount((prev) => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  if (isSuccess) {
    console.log('response is successfull', fetcherData);
    // Assign fone to ref so we can use it in the dialog without flikering when fetcherData is null.
    phoneRef.current = phoneFetcherData;
  }

  useEffect(() => {
    if (!isRedirect) {
      sessionStorage.removeItem('redirect');
      return;
    }
    sessionStorage.setItem('redirect', 'true');
  }, [isRedirect]);

  return (
    <>
      <Typography variant='h1' mt={0} align='center'>
        {brand.name}
      </Typography>
      <OneClickHeader />
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
          <input name='apiKey' value={brand.apiKey} hidden readOnly />
          <input name='redirectUrl' value={redirectUrl} hidden readOnly />
          <PhoneInput
            name='phone'
            autoFocus
            value={phone.value}
            onChange={handleFieldChange(phone)}
            error={phone.touched && !!phone.error}
            helperText={(phone.touched && phone.error) || undefined}
            disabled={isFetching}
          />
          <TextField
            name='birthday'
            value={birthday.value}
            onChange={handleFieldChange(birthday)}
            error={birthday.touched && !!birthday.error}
            helperText={(birthday.touched && birthday.error) || 'mm/dd/yyyy'}
            disabled={isFetching}
            sx={{ mt: 2 }}
            inputProps={{
              placeholder: 'Birthday',
              unmask: false,
              lazy: true,
              mask: '00/00/0000',
              inputMode: 'numeric',
            }}
            InputProps={{
              inputComponent: InputMask as any,
            }}
          />
          {error && (
            <Typography variant='body2' sx={{ marginTop: 2 }} color={red[500]}>
              {error}
            </Typography>
          )}
        </Box>
      </fetcher.Form>
      <OneClickLegalText />
      <Dialog open={!isRedirect && isSuccess}>
        <DialogContent>
          <Typography fontWeight={700} textAlign='center'>
            Please click the verification link we just texted to <br />
            {parsePhoneNumber(phoneRef.current ?? '')?.formatNational?.() ??
              phoneRef.current}
          </Typography>
          <Stack justifyContent='center' mt={3}>
            <Button
              onClick={() => {
                const formData = new FormData();
                formData.set('action', 'reset');
                fetcher.submit(formData, { method: 'post' });
              }}
              variant='outlined'
              size='small'
              startIcon={<ArrowBack sx={{ width: 24, height: 24 }} />}
              sx={{
                alignSelf: 'center',
                py: 1,
                px: 2,
                fontSize: '1rem',
              }}
            >
              Re-Enter Phone
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
