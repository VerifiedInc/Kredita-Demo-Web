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

// key for getting/setting the user email in the session
const USER_SESSION_KEY = 'userEmail';

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
export const getUserEmail = async (
  request: Request
): Promise<string | null> => {
  const session = await getSession(request);
  const email = session.get(USER_SESSION_KEY);
  return email;
};

/**
 * Logs a user out
 * Clears the session cookie and redirects to the login page
 * @param {Request} request
 * @returns {Promise<Response>} response
 */
export const logout = async (request: Request) => {
  console.log('logout');
  const session = await getSession(request);
  return redirect('/register', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
};

/**
 * Requires an authenticated user w/ email to be in the session for a request
 * logs out if no user is found
 * @param {Request} request
 * @returns {Promise<string>} email
 */
export const requireUserEmail = async (request: Request): Promise<string> => {
  const email = await getUserEmail(request);

  if (email) return email;

  throw await logout(request);
};

/**
 * Creates a user session and sets the session cookie
 * @param {Request} request
 * @param {string} userUuid
 */
export const createUserSession = async (
  request: Request,
  email: string,
  redirectTo = '/'
) => {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, email);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
};
