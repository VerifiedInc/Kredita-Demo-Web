import { logout } from '~/session.server';

export const logoutUseCase = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const verificationOptions = searchParams.get('verificationOptions');
  const isHosted = searchParams.get('isHosted');

  searchParams.delete('1ClickUuid');
  searchParams.delete('sharedCredentialsUuid');
  searchParams.delete('optedOut');

  if (verificationOptions) {
    searchParams.set('verificationOptions', String(verificationOptions));
  }

  if (isHosted) {
    searchParams.set('isHosted', String(isHosted));
  }

  const searchParamsString = searchParams.toString();
  const search = searchParamsString ? `?${searchParamsString}` : '';

  return logout(request, `/register${search}`);
};
