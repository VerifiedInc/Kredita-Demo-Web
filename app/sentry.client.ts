import { useEffect } from 'react';
import { useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { SeverityLevel } from '@sentry/types';
import { browserConfig } from '~/config.client';

export function initSentry() {
  // Initialize Sentry on client side.
  // see docs: https://docs.sentry.io/platforms/javascript/guides/remix/#configure
  Sentry.init({
    // We define a release on initialize so Sentry can know which release to use the sourcemap do show human-readable stack traces.
    release: browserConfig.release,
    // Environment options are: local, development, sandbox and production
    environment: browserConfig.env,
    dsn: browserConfig.sentryDSN,
    integrations: [
      new Sentry.BrowserTracing({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        // Headers are only attached to requests that are from web wallet project in their URL.
        tracePropagationTargets: [
          // Exclude build path and Log Rocket requests from performance.
          // Context about Log Rocket:
          // Sentry adds baggage to the request body and Log Rocket are very strict to yours payload, giving CORS error if extra param is attached.
          /^\/?((?!(build?.+|\.lr-.+\.com)).)*$/gim,
        ],
        routingInstrumentation: Sentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches
        ),
      }),
      // ref: https://docs.sentry.io/platforms/javascript/session-replay/configuration/#network-details
      new Sentry.Replay({
        networkDetailAllowUrls: [
          window.location.origin,
          /wallet.*verified/, // remix's backend api
          /core-api.*verified/, // core service api
          /wallet-api.*unumid/, // verified email aka old wallet server api
        ],
        networkRequestHeaders: ['Cache-Control'],
        networkResponseHeaders: ['Referrer-Policy'],
        // unblocking everything by default
        // TODO use HTML classes to redact sensitive data. ref: https://docs.sentry.io/platforms/javascript/session-replay/privacy/
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: false,
      }),
    ],
    ignoreErrors: ['query() call aborted', 'queryRoute() call aborted'],
    // Performance Monitoring
    // Capture 100% of the transactions other than production.
    // Capture 20% of the transactions in production.
    // tracesSampleRate: browserConfig.env === 'production' ? 0.2 : 1.0,
    tracesSampleRate: 1.0, // opting to record 100% of all transactions in all envs for now
    // Session Replay
    // Capture 100% of the session replay other than production.
    // Capture 10% of the session replay in production.
    // replaysSessionSampleRate: browserConfig.env === 'production' ? 0.1 : 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysSessionSampleRate: browserConfig.env === 'production' ? 0.2 : 1.0, // record 20% to production env and 100% to other envs.
    // Session Replay On Error
    // Capture 100% of the session replay.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

export function identifySentryUser(user: Sentry.User) {
  Sentry.setUser(user);
}

/**
 * Captures a message with Sentry
 * @param {string} message
 * @param {object} options
 */
export function captureSentryMessage(message: string, options?: any) {
  let extra: Record<string, any> = {};
  let level: SeverityLevel = 'info';

  // Apply options status to extra if existing.
  if (options?.status) {
    extra = {
      ...extra,
      status: options.status,
    };
  }

  // Apply options extra if existing.
  if (options?.extra) {
    extra = {
      ...extra,
      ...options.extra,
    };
  }

  // Add stack if existing and set level to error.
  if (options.stack) {
    extra = {
      ...extra,
      stack: options.stack,
    };
    level = 'error';
  }

  if (options.error instanceof Error) {
    Sentry.captureException(options.error);
  }

  Sentry.captureMessage(message, { level, extra });
}
