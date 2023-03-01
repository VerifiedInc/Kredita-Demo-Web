import type { LoaderFunction } from '@remix-run/node';
import { Response } from '@remix-run/node';

/**
 * To create a route with no UI, use what Remix calls a "resource route",
 * which is a route file that exports a `loader` and/or `action` function but no default export
 *
 * ref: https://remix.run/docs/en/v1/guides/api-routes#resource-routes
 */
export const loader: LoaderFunction = async () => {
  return new Response(null, { status: 204 });
};
