import { LoaderFunction, Response, redirect } from '@remix-run/node';
import axios from 'axios';

import { config } from '~/config';
import { getBrandDto } from '~/coreAPI.server';
import { logger } from '~/logger.server';
import { Brand, getBrand } from '~/utils/getBrand';

/**
 * Loader function to fetch the favicon for the brand.
 * Return default favicon if brand is not found.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const brandUuid = searchParams.get('brand');
  const brand: Brand | null = getBrand(
    brandUuid
      ? await getBrandDto(brandUuid, config.coreServiceAdminAuthKey)
      : null
  );

  try {
    const brandUrl = brand.logo.startsWith('https')
      ? brand.logo
      : `${url.origin}${brand.logo}`;
    const response = await axios.get(brandUrl, {
      responseType: 'arraybuffer',
    });
    return new Response(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/png',
      },
    });
  } catch {
    logger.error(`failed to fetch favicon for brand ${brand.name}`);
  }

  // Should never get here since we use the default favicon in brand when is null,
  // but it can happen of the url not being valid.
  return redirect('/favicon.ico');
};
