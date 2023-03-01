import { ActionFunction, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { red } from '~/styles/colors';
import { createUserSession } from '~/session.server';
import { getErrorMessage, getErrorStatus } from '~/errors';

interface ActionData {
  error?: string;
}

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');
  const phone = formData.get('phone');

  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  if (!password) {
    return json({ error: 'Password is required' }, { status: 400 });
  }

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    (phone && typeof phone !== 'string')
  ) {
    return json({ error: 'Invalid form data' }, { status: 400 });
  }

  try {
    return createUserSession(request, email);
  } catch (e) {
    return json({ error: getErrorMessage(e) }, { status: getErrorStatus(e) });
  }
};

export default function Register() {
  const actionData: ActionData | undefined = useActionData<typeof action>();

  console.log('actionData', actionData);
  return (
    <Box component='main' display='flex' flexDirection='column' marginTop={4}>
      <Form method='post'>
        <Box component='section' display='flex' flexDirection='column'>
          <TextField label='Email' name='email' />
          <TextField
            label='Password'
            name='password'
            type='password'
            sx={{ marginTop: 2 }}
          />
          <TextField label='Phone' name='phone' sx={{ marginTop: 2 }} />
          <Button variant='contained' type='submit' sx={{ marginTop: 4 }}>
            Register
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
