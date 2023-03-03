import { Box, Button } from '@mui/material';
import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { logout, requireUserEmail } from '~/session.server';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireUser will redirect to the login page if the user is not logged in
  const email = await requireUserEmail(request);

  // return the user to the route, so it can be displayed
  return json({ email });
};

export default function Index() {
  return (
    <Box display='flex' flexDirection='column' alignItems='center'>
      <Form method='post'>
        <Button>Logout</Button>
      </Form>
    </Box>
  );
}
