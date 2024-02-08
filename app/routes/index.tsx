import {
  AccountCircle,
  AutoGraph,
  CreditCard,
  Send,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import IconBoxAndLabel from '~/components/IconBoxAndLabel';
import SpendSummary from '~/components/SpendSummary';
import { requireUserName } from '~/session.server';

import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  return logoutUseCase({ request });
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request }) => {
  // requireUser will redirect to the login page if the user is not logged in
  const name = await requireUserName(request);

  // return the user to the route, so it can be displayed
  return json({ name });
};

export default function Index() {
  const borderRadius = 30;
  return (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Box
        position='absolute'
        zIndex={-1}
        top={-116}
        bgcolor='primary.main'
        height={324}
        width='100%'
        sx={{
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
      />
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        width='100%'
      >
        <Box
          color='neutral.light'
          display='flex'
          flexDirection='column'
          alignItems='center'
          ml={2}
        >
          <Typography variant='h1'>$7,425</Typography>
          <Typography variant='subtitle1' fontWeight={400}>
            Available balance
          </Typography>
        </Box>
        <AccountCircle
          sx={{ mr: 2, fontSize: '4rem', color: 'neutral.light' }}
        />
      </Box>
      <SpendSummary />

      <Box width='90%' mt={4.5} mb={2.25}>
        <Typography variant='h4'>Activity</Typography>
      </Box>
      <Box display='flex' justifyContent='space-between' width='90%'>
        <IconBoxAndLabel label='Transfer'>
          <Send sx={{ color: 'neutral.light' }} />
        </IconBoxAndLabel>
        <IconBoxAndLabel label='My Card'>
          <CreditCard sx={{ color: 'neutral.light' }} />
        </IconBoxAndLabel>
        <IconBoxAndLabel label='Insight'>
          <AutoGraph sx={{ color: 'neutral.light' }} />
        </IconBoxAndLabel>
      </Box>
      <Form method='post'>
        <Button>Sign Out</Button>
      </Form>
    </Box>
  );
}
