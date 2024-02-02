import { logout } from '~/session.server';
import { getFormDataOrEmpty } from '~/utils/getFormDataOrEmpty.server';

export const logoutUseCase = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const formData = await getFormDataOrEmpty(request);
  const hasRedirectParam = formData.get('redirect') === 'true';

  searchParams.delete('1ClickUuid');
  searchParams.delete('sharedCredentialsUuid');

  if (hasRedirectParam) {
    searchParams.set('redirect', 'true');
  }

  const searchParamsString = searchParams.toString();
  const search = searchParamsString ? `?${searchParamsString}` : '';

  return logout(request, `/register${search}`);
};
