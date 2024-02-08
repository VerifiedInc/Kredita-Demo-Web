import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { requireUserName } from '~/session.server';

import { VerifiedImage } from '~/components/VerifiedImage';
import { useBrand } from '~/hooks/useBrand';
import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const formData = await request.clone().formData();
  const action = formData.get('action');

  switch (action) {
    case 'logout': {
      return logoutUseCase({ request });
    }
    default: {
      const searchParamsString = searchParams.toString();
      return redirect(`/${searchParamsString ? `?${searchParamsString}` : ''}`);
    }
  }
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireUserEmail will redirect to the login page if the user is not logged in
  const name = await requireUserName(request);

  // return the user to the route, so it can be displayed
  return json({ name });
};

export default function Verified() {
  const brand = useBrand();
  const { name } = useLoaderData<typeof loader>();

  const renderGoHomeButton = () => {
    const buttonProps = {
      sx: {
        mt: 3,
        py: 2,
        px: 3.5,
        fontSize: '1.4rem',
      },
      children: 'Go to Home',
    };

    if (brand.homepageUrl) {
      return (
        <Button href={brand.homepageUrl} {...buttonProps}>
          Go to Home
        </Button>
      );
    }

    return (
      <Form method='post'>
        <Button {...buttonProps}>Go to Home</Button>
      </Form>
    );
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Typography variant='h1' align='center' mt={0}>
        Welcome to
        <br />
        {brand.name}, {name}!
      </Typography>
      <Typography
        variant='h3'
        align='center'
        sx={{ fontSize: 22, fontWeight: 400, mt: 2 }}
      >
        You're verified and signed up.
      </Typography>
      {renderGoHomeButton()}
      <Form method='post'>
        <input name='action' value='logout' readOnly hidden />
        <Button
          variant='outlined'
          size='small'
          sx={{
            alignSelf: 'center',
            py: 1,
            px: 2,
            fontSize: '1rem',
            mt: 2,
          }}
        >
          Sign Out
        </Button>
      </Form>
      <Box mt={6}>
        <VerifiedImage theme={brand.theme} sx={{ maxWidth: 267 }} />
      </Box>
    </Box>
  );
}
