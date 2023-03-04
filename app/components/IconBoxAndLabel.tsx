import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface IconBoxAndLabelProps extends PropsWithChildren {
  label: string;
}

/**
 * Component to display 'Activity' boxes for the /index route
 */
export default ({ label, children }: IconBoxAndLabelProps) => {
  return (
    <Box
      sx={{
        filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))',
        px: { xs: 2.75, largeMobile: 4.25 },
      }}
      display='flex'
      flexDirection='column'
      alignItems='center'
      bgcolor='neutral.light'
      py={2.5}
      borderRadius={1.5}
    >
      <Box bgcolor='primary.main' p={1} borderRadius={1.5}>
        {children}
      </Box>
      <Typography variant='caption' mt={2.25}>
        {label}
      </Typography>
    </Box>
  );
};
