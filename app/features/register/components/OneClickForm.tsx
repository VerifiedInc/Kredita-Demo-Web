import { Form, Link, useActionData } from '@remix-run/react';
import { Box, TextField, Typography } from '@mui/material';
import { red } from '@mui/material/colors';

import { theme } from '~/styles/theme';
import { action } from '~/routes';
import { ActionData } from '../types';

export function OneClickForm() {
  const actionData: ActionData | undefined = useActionData<typeof action>();

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
      <Form method='post' style={{ width: '100%' }}>
        <Box
          component='section'
          display='flex'
          flexDirection='column'
          alignItems='center'
          mt={1}
        >
          <input name='action' value='one-click' hidden readOnly />
          <TextField
            autoFocus
            label='Phone'
            name='phone'
            inputProps={{ inputMode: 'numeric' }}
            autoComplete='tel'
            sx={{ marginTop: 2 }}
          />
          {actionData?.error && (
            <Typography sx={{ marginTop: 2 }} color={red}>
              {actionData?.error}
            </Typography>
          )}
        </Box>
      </Form>
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
    </>
  );
}
