import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

interface Config {
  COMMIT_SHA: string;
  NODE_ENV: string;
  ENV: string;
  logRocketId: string;
  logRocketProjectName: string;
  logLevel: string;
  newRelicEnabled: boolean;
  newRelicAppName: string;
  newRelicLicenseKey: string;
  newRelicLoggingLicenseKey: string;
  sessionSecret: string;
  verifiedApiKey: string;
  coreServiceUrl: string;
  verifiedWalletUrl: string;
  demoUrl: string;
  sentryDSN: string;
  oneClickEnabled: boolean;
  oneClickNonHostedEnabled: boolean;
  coreServiceAdminAuthKey: string;
  customBrandingEnabled: boolean;
}

export const config: Config = {
  COMMIT_SHA: execSync('git rev-parse --verify HEAD').toString().trim(),
  NODE_ENV: process.env.NODE_ENV || 'development',
  ENV: process.env.ENV || 'local',
  logRocketId: process.env.LOG_ROCKET_ID || '',
  logRocketProjectName: process.env.LOG_ROCKET_PROJECT_NAME || '',
  logLevel: process.env.LOG_LEVEL || 'debug',
  newRelicEnabled: process.env.NEW_RELIC_ENABLED === 'true',
  newRelicAppName: process.env.NEW_RELIC_APP_NAME || '',
  newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
  newRelicLoggingLicenseKey: process.env.NEW_RELIC_LOGGING_LICENSE_KEY || '',
  sessionSecret: process.env.SESSION_SECRET || '',
  verifiedApiKey: process.env.VERIFIED_API_KEY || '',
  coreServiceUrl: process.env.CORE_SERVICE_URL || '',
  verifiedWalletUrl: process.env.VERIFIED_WALLET_URL || '',
  demoUrl: process.env.DEMO_URL || '',
  sentryDSN: process.env.SENTRY_DSN || '',
  oneClickEnabled: Boolean(process.env.ONE_CLICK_ENABLED === 'true'),
  oneClickNonHostedEnabled: Boolean(
    process.env.ONE_CLICK_NON_HOSTED_ENABLED === 'true'
  ),
  coreServiceAdminAuthKey: process.env.CORE_SERVICE_ADMIN_AUTH_KEY || '',
  customBrandingEnabled: Boolean(
    process.env.CUSTOM_BRANDING_ENABLED === 'true'
  ),
};
