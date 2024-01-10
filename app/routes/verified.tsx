import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { logout, requireUserName } from '~/session.server';
import VerifiedImage from '~/images/verified.png';
import { Refresh } from '@mui/icons-material';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('action');

  switch (action) {
    case 'logout': {
      return logout(request);
    }
    default: {
      return redirect('/');
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
  const { name } = useLoaderData<typeof loader>();

  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Typography variant='h1' align='center' mt={-2}>
        Welcome to
        <br />
        Kredita, {name}!
      </Typography>
      <Typography
        variant='h3'
        align='center'
        sx={{ fontSize: 22, fontWeight: 400, mt: 2 }}
      >
        You're verified and signed up.
      </Typography>
      <Form method='post'>
        <Button
          sx={{
            mt: 3,
            py: 2,
            px: 3.5,
            fontSize: '1.4rem',
          }}
        >
          Go to Home
        </Button>
      </Form>
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
        <img
          alt='woman looking at phone with large verified badge in background'
          src={VerifiedImage}
          style={{ maxWidth: 267 }}
        />
      </Box>
    </Box>
  );
}
