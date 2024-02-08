import { ArrowBack } from '@mui/icons-material';
import { DialogContent, Typography, Stack, Button } from '@mui/material';
import { parsePhoneNumber } from 'libphonenumber-js';

type OneClickSMSDialogContentProps = {
  phone: string;
  onRetryClick(): void;
};

export function OneClickSMSDialogContent({
  phone,
  onRetryClick,
}: OneClickSMSDialogContentProps) {
  return (
    <DialogContent>
      <Typography fontWeight={700} textAlign='center'>
        Please click the verification link we just texted to <br />
        {parsePhoneNumber(phone ?? '')?.formatNational?.() ?? phone}
      </Typography>
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
