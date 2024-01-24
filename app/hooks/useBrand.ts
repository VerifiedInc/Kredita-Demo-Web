import { useRouteLoaderData } from '@remix-run/react';

import { Brand } from '~/utils/getBrand';

export function useBrand(): Brand {
  const rootData = useRouteLoaderData<{ brand: Brand }>('root');
  const { brand } = rootData || {};
  return brand as Brand;
}
