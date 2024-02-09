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
  getSharedCredentialsOneClick,
  hasMatchingCredentials,
  oneClick,
  OneClickOptions,
  sharedCredentials,
} from '~/coreAPI.server';
import { config } from '~/config';
import { logger } from '~/logger.server';

import { useIsOneClick } from '~/hooks/useIsOneClick';
import { useIsOneClickNonHosted } from '~/hooks/useIsOneClickNonHosted';
import { ActionData } from '~/features/register/types';
import { RegularForm } from '~/features/register/components/RegularForm';
import { OneClickForm } from '~/features/register/components/OneClickForm';
import { LogInAndRegister } from '~/components/LoginAndRegister';
import { useBrand } from '~/hooks/useBrand';
import { getBrandSet } from '~/utils/getBrandSet';
import { OneClickFormNonHosted } from '~/features/register/components/OneClickFormNonHosted';
import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const formData = await request.formData();

  const action = formData.get('action');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const birthDate = (formData.get('birthDate') as string) || undefined;
  const apiKey = formData.get('apiKey');
  const redirectUrl = (formData.get('redirectUrl') as string) || undefined;

  const verificationOptions =
    searchParams.get('verificationOptions') || 'only_link';
  const isHosted = searchParams.get('isHosted') !== 'false' ?? true;

  if (!action) {
    return json({ error: 'Action must be populated' }, { status: 400 });
  }

  switch (action) {
    case 'reset': {
      return null;
    }
    case 'one-click': {
      if (!phone) {
        return json({ error: 'Phone must be populated' }, { status: 400 });
      }

      if (typeof phone !== 'string') {
        return json({ error: 'Invalid form data' }, { status: 400 });
      }

      try {
        logger.info(`calling oneClick with ${apiKey}`);

        const options: Partial<OneClickOptions> = {
          phone,
          birthDate,
          redirectUrl,
          verificationOptions:
            verificationOptions as OneClickOptions['verificationOptions'],
          isHosted,
        };

        const result = await oneClick(apiKey as string, options);

        logger.info(`oneClick result: ${JSON.stringify(result)}`);

        // If 1-click is hosted, and verification options is either code or both link and code,
        // redirect the user to the URL returned from the oneClick API.
        if (
          isHosted &&
          ['only_code', 'both_link_and_code'].includes(verificationOptions)
        ) {
          return redirect(result.url);
        }

        // Otherwise, display on UI the success message.
        return { ...result, success: true };
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
  const brandSet = await getBrandSet(searchParams);

  const sharedCredentialsUuid = searchParams.get('sharedCredentialsUuid');
  const oneClickUuid = searchParams.get('1ClickUuid');

  if (oneClickUuid) {
    const result = await getSharedCredentialsOneClick(
      brandSet.apiKey,
      oneClickUuid
    );
    if (result) {
      const fullName = result?.credentials?.fullName;
      // Full name credential can be either a string or a record containing optionally the first name, last name, middle name.
      const firstName =
        typeof fullName === 'string' ? fullName : fullName?.firstName;

      // Because the user has canceled 1-click flow, the credentials was not shared, so we need to logout the user.
      // Customer Note: in a real implementation this ought to fall back to the standard sign up form.
      if (!firstName) return logoutUseCase({ request });

      return createUserSession(
        request,
        String(firstName),
        `/verified?${searchParams.toString()}`
      );
    }
  }

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
      return createUserSession(
        request,
        String(fullName),
        `/verified?${searchParams.toString()}`
      );
    }
  }

  return null;
};

export default function Register() {
  const actionData: ActionData | undefined = useActionData();
  const isOneClick = useIsOneClick();
  const isOneClickNonHosted = useIsOneClickNonHosted();
  const brand = useBrand();

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
      {isOneClick && !isOneClickNonHosted && <OneClickForm />}
      {isOneClickNonHosted && <OneClickFormNonHosted />}
      <LogInAndRegister theme={brand.theme} sx={{ maxWidth: 264 }} />
    </Box>
  );
}
