import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { PropsWithChildren } from 'react';

import KreditaLogo from '~/images/kredita-logo.png';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container
        maxWidth='xs'
        sx={{ paddingX: 3, display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4.5, mb: 5 }}>
          <img
            alt='black Kredita logo'
            src={KreditaLogo}
            style={{ maxWidth: 29 }}
          />
        </Box>
        {children}
      </Container>
    </Box>
  );
}
