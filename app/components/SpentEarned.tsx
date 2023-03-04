import { Box, BoxProps, Typography } from '@mui/material';

interface SpentEarnedProps extends BoxProps {
  label: string;
  value: string;
}

/**
 * Component to display labeled monetary amounts in the SpendSummary component.
 */
export default ({ label, value, bgcolor }: SpentEarnedProps) => {
  return (
    <Box display='flex' alignItems='center'>
      <Box
        bgcolor={bgcolor}
        height={10}
        width={10}
        borderRadius='50%'
        mr={1}
        mt={2}
      />
      <Box>
        <Typography variant='subtitle2' fontWeight={400}>
          {label}
        </Typography>
        <Typography variant='h2'>{value}</Typography>
      </Box>
    </Box>
  );
};
