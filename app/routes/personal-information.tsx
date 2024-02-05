import {
  Box,
  Button,
  Stack,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import { LoaderFunction, json, redirect } from '@remix-run/node';

import { getSharedCredentialsOneClick } from '~/coreAPI.server';
import { getBrandSet } from '~/utils/getBrandSet';

import { useBrand } from '~/hooks/useBrand';
import { usePersonalInformationFields } from '~/features/personalInformation/hooks/usePersonalInformationFields';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  const brandSet = await getBrandSet(searchParams);

  const oneClickUuid = searchParams.get('1ClickUuid');

  if (oneClickUuid) {
    const result = await getSharedCredentialsOneClick(
      brandSet.apiKey,
      oneClickUuid
    );

    if (result?.credentials) {
      return json(result?.credentials);
    }
  }

  // No credentials found, so user should be redirected to the register page.
  return redirect('/register' + searchParams.toString());
};

export default function PersonalInformation() {
  const brand = useBrand();
  const { fields, isValid } = usePersonalInformationFields();

  const fieldSx: SxProps = { width: '100%' };
  const buttonContainerSx: SxProps = {
    position: 'sticky',
    bottom: 0,
    py: 2,
    zIndex: 2,
    background:
      'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 1) 35%)',
  };

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Typography variant='h1' mt={0} align='center'>
        {brand.name}
      </Typography>
      <Typography
        variant='h3'
        mt={2.5}
        mb={1}
        fontWeight={400}
        textAlign='center'
      >
        Please fill the information below to get started
      </Typography>
      <Stack
        direction='column'
        spacing={2}
        my={2}
        width='100%'
        position='relative'
      >
        {Object.values(fields).map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={field.value}
            onChange={field.change}
            error={!!field.error}
            helperText={field.error}
            sx={fieldSx}
          />
        ))}
        <Box sx={buttonContainerSx}>
          <Button fullWidth disabled={!isValid}>
            Get Started
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
