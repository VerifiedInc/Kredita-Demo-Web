import { createCookieSessionStorage, redirect } from '@remix-run/node';

import { config } from './config';

/*************************
 * SESSION FUNCTIONALITY *
 *************************/

/**
 * Creates a session storage object
 * @see https://remix.run/docs/en/v1/utils/sessions#createcookiesessionstorage
 */
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: [config.sessionSecret],
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  },
});

// key for getting/setting the user name in the session
const USER_SESSION_KEY = 'userName';

/**
 * Gets the session from the request
 * @param {Request} request
 * @returns {Promise<Session>} session
 */
export const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
};

/**
 * Gets the user from the session
 * @param {Request} request
 * @returns {Promise<string | null>} user
 */
export const getUserName = async (request: Request): Promise<string | null> => {
  const session = await getSession(request);
  const name = session.get(USER_SESSION_KEY);
  return name;
};

/**
 * Logs a user out
 * Clears the session cookie and redirects to the login page
 * @param {Request} request
 * @returns {Promise<Response>} response
 */
export const logout = async (request: Request, redirectUrl?: string) => {
  console.log('logout');
  const session = await getSession(request);
  return redirect(redirectUrl || '/register', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
};

/**
 * Requires an authenticated user w/ name to be in the session for a request
 * logs out if no user is found
 * @param {Request} request
 * @returns {Promise<string>} name
 */
export const requireUserName = async (request: Request): Promise<string> => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const name = await getUserName(request);

  if (name) return name;

  throw await logout(
    request,
    `/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  );
};

/**
 * Creates a user session and sets the session cookie
 * @param {Request} request
 * @param {string} userUuid
 */
export const createUserSession = async (
  request: Request,
  name: string,
  redirectTo = '/'
) => {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, name);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
};
