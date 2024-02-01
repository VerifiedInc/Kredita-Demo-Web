import { logout } from '~/session.server';

export const logoutUseCase = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const formData = await request.clone().formData();
  const hasRedirectParam = formData.get('redirect') === 'true';

  searchParams.delete('1ClickUuid');
  searchParams.delete('sharedCredentialsUuid');

  if (hasRedirectParam) {
    searchParams.set('redirect', 'true');
  }

  const searchParamsString = searchParams.toString();

  return logout(
    request,
    hasRedirectParam
      ? `/register${searchParamsString ? `?${searchParamsString}` : ''}`
      : undefined
  );
};
