import { useAppContext } from '~/context/AppContext';

// Returns true if one-click and non-hosted is enabled
export function useIsOneClickNonHosted() {
  const appContext = useAppContext();
  return (
    appContext.config.oneClickEnabled &&
    appContext.config.oneClickNonHostedEnabled
  );
}
