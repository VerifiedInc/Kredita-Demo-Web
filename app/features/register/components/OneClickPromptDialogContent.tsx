import { ArrowBack } from '@mui/icons-material';
import { DialogContent, Typography, Box, Stack, Button } from '@mui/material';
import { parsePhoneNumber } from 'libphonenumber-js';

import { OTPInput } from '~/components/OTPInput';

type OneClickPromptDialogContentProps = {
  phone: string;
  oneClickUrl: string;
  onRetryClick(): void;
};

export function OneClickPromptDialogContent({
  phone,
  oneClickUrl,
  onRetryClick,
}: OneClickPromptDialogContentProps) {
  return (
    <DialogContent>
      <Typography fontWeight={700} textAlign='center'>
        Enter the code we just texted to <br />
        {parsePhoneNumber(phone ?? '')?.formatNational?.() ?? phone}
      </Typography>
      <Box sx={{ mt: 2, maxWidth: 350, mx: 'auto' }}>
        <OTPInput
          name='otp'
          onChange={(event) => {
            const url = new URL(oneClickUrl);
            url.searchParams.set('code', event.target.value);
            console.log(url.toString());
            window.location.href = url.toString();
          }}
          disabled={false}
        />
      </Box>
      <Stack justifyContent='center' mt={3}>
        <Button
          onClick={onRetryClick}
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
  );
}
