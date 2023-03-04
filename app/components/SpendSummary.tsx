import { Box, Typography } from '@mui/material';
import SpentEarned from './SpentEarned';

/**
 * Component to display the monthly spent and earned summary on the /index route
 */
export default () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      bgcolor='neutral.light'
      borderRadius={3.5}
      mt={4.5}
      px={2.5}
      py={3.5}
      width='90%'
      sx={{
        filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))',
      }}
    >
      <Box
        display='flex'
        justifyContent='space-between'
        pb={2}
        sx={{ borderBottom: 1, borderBottomColor: 'neutral.main' }}
      >
        <SpentEarned label='Spent' value='$1,460' bgcolor='error.light' />
        <SpentEarned label='Earned' value='$2,730' bgcolor='primary.main' />
      </Box>
      <Typography variant='caption' pt={2.5}>
        You spent $1,015 on dining out this month. Let's try to make it lower
      </Typography>
      <Typography
        variant='caption'
        pt={2.5}
        color='primary.dark'
        sx={{ textDecoration: 'underline' }}
      >
        <strong>Tell me more</strong>
      </Typography>
    </Box>
  );
};
