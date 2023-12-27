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
import VerifiedImage from '~/images/verified.png';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  return redirect('/');
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
      <img
        alt='woman looking at phone with large verified badge in background'
        src={VerifiedImage}
        style={{ maxWidth: 267 }}
      />
      <Typography variant='h1' align='center' mt={5}>
        {' '}
        You're Verified, {name}!
      </Typography>
      <Form method='post'>
        <Button>Go to Home</Button>
      </Form>
    </Box>
  );
}
