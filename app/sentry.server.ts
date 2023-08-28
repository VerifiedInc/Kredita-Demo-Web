import * as Sentry from '@sentry/remix';
import { config } from '~/config';

export function initSentry() {
  // Initialize Sentry on server side.
  // see docs: https://docs.sentry.io/platforms/javascript/guides/remix/#configure
  Sentry.init({
    // We define a release on initialize so Sentry can know which release to use the sourcemap do show human-readable stack traces.
    release: config.COMMIT_SHA,
    // Environment options are: local, development, sandbox and production
    environment: config.ENV,
    dsn: config.sentryDSN,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    ignoreErrors: ['query() call aborted', 'queryRoute() call aborted'],
    // Performance Monitoring
    // Capture 100% of the transactions other than production.
    // Capture 20% of the transactions in production.
    tracesSampleRate: 1.0, // opting to record 100% of all transactions in all envs for now
  });
}
