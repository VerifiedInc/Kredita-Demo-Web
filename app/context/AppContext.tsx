import { createContext, ReactNode, useContext } from 'react';

import { BrowserConfig } from '~/config.client';

export type AppContext = {
  config: BrowserConfig;
};

const Context = createContext<AppContext | null>(null);

export const useAppContext = () =>
  useContext(Context) as NonNullable<AppContext>;

type AppContextProviderProps = Pick<AppContext, 'config'> & {
  children: ReactNode;
};

// Put here the variables we want to share through the application,
// example: can be components that doesn't have an easy prop injection.
export function AppContextProvider({
  children,
  ...props
}: AppContextProviderProps) {
  const config =
    typeof window !== 'undefined'
      ? window.ENV
      : (props.config as unknown as BrowserConfig);
  return <Context.Provider value={{ config }}>{children}</Context.Provider>;
}
