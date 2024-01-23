import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import type { PropsWithChildren } from 'react';

import { useBrand } from './hooks/useBrand';

export default function Layout({ children }: PropsWithChildren) {
  const brand = useBrand();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container
        maxWidth='xs'
        sx={{ paddingX: 3, display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4.5, mb: 5 }}>
          <img
            alt={`${brand.name} logo`}
            src={brand.logo}
            style={{ maxWidth: 80 }}
            crossOrigin='anonymous'
          />
        </Box>
        {children}
      </Container>
    </Box>
  );
}
