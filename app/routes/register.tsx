import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { red } from '~/styles/colors';
import { createUserSession } from '~/session.server';
import { getErrorMessage, getErrorStatus } from '~/errors';
import { hasMatchingCredentials, sharedCredentials } from '~/coreAPI.server';
import { config } from '~/config';
import { logger } from '~/logger.server';

/**
 * Represents a credential object which contains plaintext user data.
 */
interface Credential {
  id: string; // credential id
  type: string; // credential type
  issuer: string; // credential issuer brandId
  issuanceDate: number; // when credential was created as a milliseconds since epoch unix timestamp
  expirationDate?: number; // when credentials expires as a milliseconds since epoch unix timestamp
  data: Map<string, any>; // credential data map that matches the credential type's JSON Schema definition
}

interface SharedCredentials {
  uuid: string; // the uuid from the query parameter of the redirect back to your client; identifies the collection of credentials shared by the user
  credentials: Credential[]; // a list of one or more Credential objects
  email?: string; // the user's email from the input to /hasMatchingCredentials; only present if email was provided
  phone?: string; // the user's phone from the input to /hasMatchingCredentials; only present if phone was provided
}

interface ActionData {
  error?: string;
}

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const phone = formData.get('phone');

  if (!email) {
    return json({ error: 'Email is required' }, { status: 400 });
  }

  if (!phone) {
    return json({ error: 'Phone is required' }, { status: 400 });
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
      url.searchParams.set('email', email);
      // user's phone number
      url.searchParams.set('phone', phone);
      // url to redirect the user to once the Unum ID credential request flow is complete
      url.searchParams.set('redirectUrl', config.demoUrl + '/register');

      // redirect the user to the url returned from the POST request to hasMatchingCredentials
      return redirect(String(url));
    }
    return null;
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
    const result: SharedCredentials = await sharedCredentials(
      sharedCredentialsUuid
    );
    const { email } = result;
    return createUserSession(request, String(email), '/verified');
  }

  return null;
};

export default function Register() {
  const actionData: ActionData | undefined = useActionData<typeof action>();

  console.log('actionData', actionData);
  return (
    <Box component='main' display='flex' flexDirection='column' marginTop={4}>
      <Form method='post'>
        <Box
          component='section'
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <TextField label='Email' name='email' />
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
