import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { red } from '~/styles/colors';
import { createUserSession } from '~/session.server';
import { getErrorMessage, getErrorStatus } from '~/errors';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  // some basic form validation.
  // if there are any errors, we'll return a 400 with an `error` field in the JSON response
  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  if (!password) {
    return json({ error: 'Password is required' }, { status: 400 });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return json({ error: 'Invalid form data' }, { status: 400 });
  }

  try {
    // set the session cookie and redirect to an example authenticated page
    return createUserSession(request, email);
  } catch (e) {
    return json({ error: getErrorMessage(e) }, { status: getErrorStatus(e) });
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <Box component='main' display='flex' flexDirection='column' marginTop={4}>
      <Form method='post'>
        <Box component='section' display='flex' flexDirection='column' alignItems='center'>
          <TextField label='Email' name='email' />
          <TextField
            label='Password'
            name='password'
            type='password'
            sx={{ marginTop: 2 }}
          />
          <Button variant='contained' type='submit' sx={{ marginTop: 4 }}>
            Log In
          </Button>
          {actionData?.error && (
            <Typography sx={{ marginTop: 2 }} color={red}>
              {actionData?.error}
            </Typography>
          )}
        </Box>
      </Form>
    </Box>
  );
}
