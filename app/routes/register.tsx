import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import Box from '@mui/material/Box';

import { createUserSession } from '~/session.server';
import { getErrorMessage, getErrorStatus } from '~/errors';
import {
  hasMatchingCredentials,
  oneClick,
  sharedCredentials,
} from '~/coreAPI.server';
import { config } from '~/config';
import { logger } from '~/logger.server';

import LogInAndRegister from '~/images/log-in-and-register.png';

import { useIsOneClick } from '~/hooks/useIsOneClick';
import { ActionData } from '~/features/register/types';
import { RegularForm } from '~/features/register/components/RegularForm';
import { OneClickForm } from '~/features/register/components/OneClickForm';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const action = formData.get('action');
  const email = formData.get('email');
  const phone = formData.get('phone');

  if (!action) {
    return json({ error: 'Action must be populated' }, { status: 400 });
  }

  switch (action) {
    case 'one-click': {
      if (!phone) {
        return json({ error: 'Phone must be populated' }, { status: 400 });
      }

      if (typeof phone !== 'string') {
        return json({ error: 'Invalid form data' }, { status: 400 });
      }

      try {
        return await oneClick(phone);
      } catch (e) {
        return json(
          { error: getErrorMessage(e) },
          { status: getErrorStatus(e) }
        );
      }
    }
    case 'regular': {
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

        // if url is returned then there are matching credentials
        if (credentialRequestUrl) {
          const url = new URL(String(credentialRequestUrl));

          // url to redirect the user to once the Unum ID credential request flow is complete
          url.searchParams.set('redirectUrl', config.demoUrl + '/register');

          logger.info(
            `final wallet URL including own callbackUrl aka redirectUrl defined: ${url}`
          );

          // redirect the user to the url returned from the POST request to hasMatchingCredentials
          return redirect(String(url));
        }
        // Alert for the purposes of the demo to inform users as to why the demo is not progressing
        return json({ error: 'No matching credentials found.' });
      } catch (e) {
        return json(
          { error: getErrorMessage(e) },
          { status: getErrorStatus(e) }
        );
      }
    }
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
      const { credentials } = result;
      const fullNameCredential = credentials.find(
        (credential) => credential.type === 'FullNameCredential'
      ) as any;
      if (!fullNameCredential) {
        throw new Error('FullNameCredential is missing');
      }
      const fullName = fullNameCredential.data
        .map((credential: any) => Object.values(credential.data)[0])
        .slice(0, 1)
        .join(' ');
      return createUserSession(request, String(fullName), '/verified');
    }
  }

  return null;
};

export default function Register() {
  const actionData: ActionData | undefined = useActionData();
  const isOneClick = useIsOneClick();

  console.log('actionData', actionData);

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      {/* When is regular flow, render the default form */}
      {!isOneClick && <RegularForm />}
      {isOneClick && <OneClickForm />}
      <img
        alt='man at desk looking at a robot holding a clock'
        src={LogInAndRegister}
        style={{ maxWidth: 264 }}
      />
    </Box>
  );
}
