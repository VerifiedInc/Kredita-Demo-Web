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
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  sessionSecret: string;
}

const dbConfig =
  process.env.NODE_ENV === 'test'
    ? {
        dbName: process.env.TEST_DB_NAME || '',
        dbUser: process.env.TEST_DB_USER || '',
        dbPassword: process.env.TEST_DB_PASSWORD || '',
        dbHost: process.env.TEST_DB_HOST || '',
        dbPort: parseInt(process.env.TEST_DB_PORT || '5432', 10),
      }
    : {
        dbName: process.env.DB_NAME || '',
        dbUser: process.env.DB_USER || '',
        dbPassword: process.env.DB_PASSWORD || '',
        dbHost: process.env.DB_HOST || '',
        dbPort: parseInt(process.env.DB_PORT || '5432', 10),
      };

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
  ...dbConfig,
};
