import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { json, LoaderFunction } from '@remix-run/node';
import { requireUserEmail } from '~/session.server';

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireUserEmail will redirect to the login page if the user is not logged in
  const email = await requireUserEmail(request);

  // return the user to the route, so it can be displayed
  return json({ email });
};

export default function Verified() {
  return (
    <Box>
      <Typography variant='h1'> Congrats you're verified!</Typography>
    </Box>
  );
}
