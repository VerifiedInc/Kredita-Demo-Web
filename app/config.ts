import dotenv from 'dotenv';

dotenv.config();

interface Config {
  NODE_ENV: string;
  logRocketId: string;
  logRocketProjectName: string;
  logLevel: string;
  newRelicEnabled: boolean;
  newRelicAppName: string;
  newRelicLicenseKey: string;
  newRelicLoggingLicenseKey: string;
  sessionSecret: string;
  unumAPIKey: string;
  coreServiceUrl: string;
  unumWalletUrl: string;
  demoUrl: string;
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  logRocketId: process.env.LOG_ROCKET_ID || '',
  logRocketProjectName: process.env.LOG_ROCKET_PROJECT_NAME || '',
  logLevel: process.env.LOG_LEVEL || 'debug',
  newRelicEnabled: process.env.NEW_RELIC_ENABLED === 'true',
  newRelicAppName: process.env.NEW_RELIC_APP_NAME || '',
  newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
  newRelicLoggingLicenseKey: process.env.NEW_RELIC_LOGGING_LICENSE_KEY || '',
  sessionSecret: process.env.SESSION_SECRET || '',
  unumAPIKey: process.env.UNUM_API_KEY || '',
  coreServiceUrl: process.env.CORE_SERVICE_URL || '',
  unumWalletUrl: process.env.UNUM_WALLET_URL || '',
  demoUrl: process.env.DEMO_URL || '',
};
