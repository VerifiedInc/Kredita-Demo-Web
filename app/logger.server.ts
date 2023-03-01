import winston, { createLogger, format, transports } from 'winston';
import nrWinstonEnricher from '@newrelic/winston-enricher';
import { omit } from 'lodash';

import { config } from './config';
import { AlertError } from './errors';

const newRelicFormatter = nrWinstonEnricher(winston);

const newRelicOptions = {
  host: 'log-api.newrelic.com',
  path: '/log/v1',
  headers: {
    'X-Licesnse-Key': config.newRelicLoggingLicenseKey,
  },
  ssl: true,
  level: config.logLevel || 'debug',
  format: format.combine(newRelicFormatter(), format.json()),
};

const defaultFormat = format.printf((info) => `${info.level}: ${info.message}`);

// add a timestamp when running locally. Timestamps can be added in supplementary fashion in deployed envs (e.g. by newrelic)
const localFormat = format.combine(
  format.colorize(),
  format.timestamp({
    format: 'mm:ss.SSS',
  }),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const consoleFormat = config.NODE_ENV === 'local' ? localFormat : defaultFormat;

// prevent reporting anywhere but to stdout if running locally
// Note using NPM default log levels: https://github.com/winstonjs/winston#logging-levels
const localTransports = [
  new transports.Console({
    format: consoleFormat,
    level: config.logLevel || 'debug',
  }),
];

// TODO: add http transport for newrelic
const defaultTransports = [
  new transports.Console({
    format: consoleFormat,
    level: config.logLevel || 'debug',
  }),
  new transports.Http(newRelicOptions),
];

const logTransports =
  config.NODE_ENV === 'local' ? localTransports : defaultTransports;

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  format: format.combine(format.splat(), format.errors({ stack: true })),
  transports: logTransports,
  silent: config.NODE_ENV === 'test',
});

/**
 * logs that a thrown error has been caught
 * @param {string} caughtBy name of the method/function that caught the error
 * @param {string} thrownBy name of the method/function that threw the error
 * @param {unknown} error the thrown error
 * @returns {void}
 */
export const logCaughtError = (
  caughtBy: string,
  thrownBy: string,
  error: unknown
): void => {
  const meta = typeof error === 'object' ? omit(error, 'hook', 'ctx') : error;
  const alertPrefix = error instanceof AlertError ? '[[ALERT]] ' : '';
  logger.error(
    `${alertPrefix}${caughtBy} caught an error thrown by ${thrownBy}. Error: ${JSON.stringify(
      meta
    )}.`,
    error
  );
};
