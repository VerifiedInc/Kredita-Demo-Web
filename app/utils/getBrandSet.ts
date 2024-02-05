import { BrandDto } from '@verifiedinc/core-types';

import { config } from '~/config';
import { getBrandApiKey, getBrandDto } from '~/coreAPI.server';

import { getBrand } from './getBrand';
import { logger } from '~/logger.server';

export const getBrandSet = async (searchParams: URLSearchParams) => {
  let brand = getBrand(null);
  let apiKey = config.verifiedApiKey;

  // Allow custom branding under environment flag.
  if (config.customBrandingEnabled) {
    const brandUuid = searchParams.get('brand');

    // Override possibly brand in session if query param is set.
    if (brandUuid) {
      logger.info(`getting brand: ${brandUuid}`);

      apiKey = await getBrandApiKey(brandUuid, config.coreServiceAdminAuthKey);

      logger.info(`got api key: ${apiKey}`);

      brand = getBrand(
        brandUuid
          ? ((await getBrandDto(
              brandUuid,
              config.coreServiceAdminAuthKey
            )) as BrandDto)
          : null
      );

      logger.info(`got brand: ${JSON.stringify(brand)}`);
    }
  }

  return {
    apiKey,
    brand,
  };
};
