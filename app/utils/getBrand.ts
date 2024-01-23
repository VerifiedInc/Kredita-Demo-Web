import tinycolor from 'tinycolor2';
import { BrandDto } from '~/coreAPI.server';

export type Brand = {
  uuid: string;
  name: string;
  logo: string;
  homepageUrl: string;
  theme: {
    light: string;
    main: string;
    dark: string;
  };
};

export function getBrand(brandDto: BrandDto | null): Brand {
  if (!brandDto) {
    return {
      uuid: '_',
      name: 'Kredita',
      logo: '/logo192.webp',
      homepageUrl: '/',
      theme: {
        light: '#FACE6F',
        main: '#FFAD00',
        dark: '#CB8A00',
      },
    };
  }

  return {
    uuid: brandDto.uuid,
    name: brandDto.receiverName,
    logo: brandDto.logoImageUrl,
    homepageUrl: brandDto.homepageUrl,
    theme: {
      light: tinycolor(brandDto.primaryColor).lighten(20).toString(),
      main: brandDto.primaryColor,
      dark: tinycolor(brandDto.primaryColor).darken(20).toString(),
    },
  };
}
