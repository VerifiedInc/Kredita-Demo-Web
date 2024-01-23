import { Form, Link, useActionData } from '@remix-run/react';
import { Box, TextField, Button, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';

import { action } from '~/routes';
import { ActionData } from '../types';

export function RegularForm() {
  const actionData: ActionData | undefined = useActionData<typeof action>();
  const theme = useTheme();

  return (
    <>
      <Typography variant='h1' mt={0} align='center'>
        You're moments
        <br />
        away from magic...
      </Typography>
      <Typography variant='h3' mt={2.5} fontWeight={400}>
        Let's start with your contact info:
      </Typography>
      <Form method='post' style={{ width: '100%' }}>
        <Box
          component='section'
          display='flex'
          flexDirection='column'
          alignItems='center'
          mt={1}
        >
          <input name='action' value='regular' hidden readOnly />
          <TextField label='Email' name='email' />
          <TextField
            label='Phone'
            name='phone'
            inputProps={{ inputMode: 'numeric' }}
            autoComplete='tel'
            sx={{ marginTop: 2 }}
          />
          <Button>Next →</Button>
          {actionData?.error && (
            <Typography sx={{ marginTop: 2 }} color={red}>
              {actionData?.error}
            </Typography>
          )}
        </Box>
      </Form>
      <Typography variant='body2' mt={1.8} mb={4.5} color='neutral.dark'>
        Already have an account?{' '}
        <Link to='/login' style={{ color: theme.palette.neutral.dark }}>
          Sign in
        </Link>
      </Typography>
    </>
  );
}
