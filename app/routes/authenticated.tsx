import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { lightGrey } from '~/styles/colors';
import { logout, requireUserEmail } from '~/session.server';

/***********************************************************************************************************************
 * AN EXAMPLE OF A ROUTE THAT REQUIRES A USER TO BE LOGGED IN. IF THE USER IS NOT LOGGED IN, THEY WILL BE REDIRECTED TO THE LOGIN PAGE. *
 ***********************************************************************************************************************/

interface LoggedInUserProps {
  email: string;
}

/**
 * component to display the logged in user
 */
export function LoggedInUser({ email }: LoggedInUserProps) {
  return (
    <Box
      component='section'
      display='flex'
      flexDirection='column'
      sx={{ backgroundColor: lightGrey }}
    >
      <pre>{JSON.stringify(email, null, 2)}</pre>
    </Box>
  );
}

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  return await logout(request);
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireUser will redirect to the login page if the user is not logged in
  const email = await requireUserEmail(request);

  // return the user to the route, so it can be displayed
  return json({ email });
};

export default function Authenticated() {
  const data = useLoaderData<typeof loader>();
  return (
    <Box component='main' display='flex' flexDirection='column'>
      <Typography variant='h1'>Authenticated</Typography>
      {data?.user ? <LoggedInUser email={data.email} /> : null}
      <Form method='post'>
        <Button variant='contained' color='secondary' type='submit'>
          Log out
        </Button>
      </Form>
    </Box>
  );
}
