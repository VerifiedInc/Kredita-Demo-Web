import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { red } from '~/styles/colors';
import { createUserSession } from '~/session.server';
import { getErrorMessage, getErrorStatus } from '~/errors';
import { hasMatchingCredentials, sharedCredentials } from '~/coreAPI.server';
import { config } from '~/config';
import { logger } from '~/logger.server';

import { theme } from '~/styles/theme';
import LogInAndRegister from '~/images/log-in-and-register.png';
import { Button } from '@mui/material';

interface ActionData {
  error?: string;
}

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const phone = formData.get('phone');

  if (!phone && !email) {
    return json(
      { error: 'Either phone or email must be populated' },
      { status: 400 }
    );
  }

  if (typeof email !== 'string' || typeof phone !== 'string') {
    return json({ error: 'Invalid form data' }, { status: 400 });
  }

  try {
    // Check whether the user has existing credentials
    const credentialRequestUrl = await hasMatchingCredentials(email, phone);

    if (credentialRequestUrl) {
      const url = new URL(
        String(credentialRequestUrl).toLowerCase().includes('wallet')
          ? credentialRequestUrl
          : config.unumWalletUrl + credentialRequestUrl
      );
      logger.info(`URL: ${url}`);
      // user's email address
      if (email) url.searchParams.set('email', email);
      // user's phone number
      if (phone) url.searchParams.set('phone', phone?.startsWith('+1') ? phone : '+1' + phone);
      // url to redirect the user to once the Unum ID credential request flow is complete
      url.searchParams.set('redirectUrl', config.demoUrl + '/register');

      // redirect the user to the url returned from the POST request to hasMatchingCredentials
      return redirect(String(url));
    }
    // Alert for the purposes of the demo to inform users as to why the demo is not progressing
    return json({ error: 'No matching credentials found.' });
  } catch (e) {
    return json({ error: getErrorMessage(e) }, { status: getErrorStatus(e) });
  }
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const sharedCredentialsUuid = searchParams.get('sharedCredentialsUuid');

  // If a sharedCredentialsUuid parameter exists, retrieve the associated credentials and
  // create the user's session - re-directing them to /verified
  if (sharedCredentialsUuid) {
    const result = await sharedCredentials(sharedCredentialsUuid);
    if (result) {
      const { email } = result;
      return createUserSession(request, String(email), '/verified');
    }
  }

  return null;
};

export default function Register() {
  const actionData: ActionData | undefined = useActionData<typeof action>();

  console.log('actionData', actionData);
  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' mt={0} align='center'>
        You're moments away from magic...
      </Typography>
      <Typography variant='h3' mt={4.5} fontWeight={400}>
        Let's start with your contact info:
      </Typography>
      <Form method='post' style={{ width: '100%' }}>
        <Box
          component='section'
          display='flex'
          flexDirection='column'
          alignItems='center'
          mt={2}
        >
          <TextField label='Email' name='email' />
          <TextField label='Phone' name='phone' sx={{ marginTop: 2 }} />
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
      <img
        alt='man at desk looking at a robot holding a clock'
        src={LogInAndRegister}
        style={{ maxWidth: 264 }}
      />
    </Box>
  );
}
