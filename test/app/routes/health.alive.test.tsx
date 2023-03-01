/**
 * @jest-environment node
 */
// need the above line to tell Jest that this test file should be run in a Node.js environment, not jsdom

import type { LoaderArgs } from '@remix-run/node';
import { loader } from '../../../app/routes/health.alive';

test('GET returns a 204 response', async () => {
  // we can test a GET request to a resource route by calling the loader function directly
  const response = await loader({} as LoaderArgs);
  expect(response.status).toBe(204);
});
