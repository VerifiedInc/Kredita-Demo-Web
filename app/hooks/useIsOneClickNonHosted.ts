import { useSearchParams } from '@remix-run/react';
import { useAppContext } from '~/context/AppContext';

// Returns true if one-click and non-hosted is enabled
export function useIsOneClickNonHosted() {
  const [searchParams] = useSearchParams();
  const isHosted = searchParams.get('isHosted') !== 'false' ?? true;
  const appContext = useAppContext();
  return appContext.config.oneClickEnabled && !isHosted;
}
