import { useRouteLoaderData } from '@remix-run/react';

import { Brand } from '~/utils/getBrand';

export function useBrand(): Brand & { apiKey: string } {
  const rootData = useRouteLoaderData<{ brand: Brand; apiKey: string }>('root');
  const { brand, apiKey } = rootData || {};
  return { ...(brand as Brand), apiKey: apiKey as string };
}
