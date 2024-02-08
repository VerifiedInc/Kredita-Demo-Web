import { Typography, useTheme } from '@mui/material';
import { Link } from '@remix-run/react';

import { useBrand } from '~/hooks/useBrand';

export function OneClickLegalText() {
  const theme = useTheme();
  const brand = useBrand();

  return (
    <Typography
      variant='caption'
      mt={1.8}
      mb={4.5}
      color='neutral.main'
      sx={{ textAlign: 'center' }}
    >
      By using {brand.name} demo, you agree to Verified Inc.‘s{' '}
      <Link
        to='https://www.verified.inc/legal#terms-of-use'
        target='_blank'
        style={{ color: theme.palette.primary.main }}
      >
        Terms of Use
      </Link>{' '}
      <br /> and acknowledge our{' '}
      <Link
        to='https://www.verified.inc/legal#privacy-policy'
        target='_blank'
        style={{ color: theme.palette.primary.main }}
      >
        Privacy Policy
      </Link>
      .
    </Typography>
  );
}
