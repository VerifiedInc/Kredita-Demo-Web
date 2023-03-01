import { createContext } from 'react';

export interface ClientStyleContextData {
  reset: () => void;
}

// style context for Emotion/MUI
// ref: https://github.com/mui/material-ui/blob/master/examples/remix-with-typescript/app/src/ClientStyleContext.tsx
export default createContext<ClientStyleContextData>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => {},
});
