import { useAppContext } from '~/context/AppContext';

// Returns true if one-click is enabled
export function useIsOneClick() {
  const appContext = useAppContext();
  return appContext.config.oneClickEnabled;
}
