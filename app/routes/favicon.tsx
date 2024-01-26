import { LoaderFunction, Response } from '@remix-run/node';
import axios from 'axios';
import { BrandDto } from '@verifiedinc/core-types';
import sharp from 'sharp';

import { config } from '~/config';
import { getBrandDto } from '~/coreAPI.server';
import { logger } from '~/logger.server';
import { Brand, getBrand } from '~/utils/getBrand';

// Convert buffer to webp.
const toWebp = async (buffer: ArrayBuffer): Promise<Buffer> => {
  return sharp(buffer).resize(80, 80).webp({ quality: 80 }).toBuffer();
};

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
      ? ((await getBrandDto(
          brandUuid,
          config.coreServiceAdminAuthKey
        )) as BrandDto)
      : null
  );

  try {
    if (!brand.logo.length) {
      throw new Error(`No logo for ${brand.name}`);
    }

    const brandUrl = brand.logo.startsWith('https')
      ? brand.logo
      : `${url.origin}${brand.logo}`;
    const response = await axios.get(brandUrl, {
      responseType: 'arraybuffer',
    });

    return new Response(await toWebp(response.data as ArrayBuffer), {
      headers: {
        'Content-Type': 'image/webp',
      },
    });
  } catch {
    logger.error(
      `failed to fetch favicon for brand ${brand.name}, using verified inc one.`
    );

    // Use Verified Inc.'s logo as favicon in case it failed to fetch the brand's logo.
    const response = await axios.get(`${url.origin}/verifiedinc.webp`, {
      responseType: 'arraybuffer',
    });

    return new Response(await toWebp(response.data as ArrayBuffer), {
      headers: {
        'Content-Type': 'image/webp',
      },
    });
  }
};
