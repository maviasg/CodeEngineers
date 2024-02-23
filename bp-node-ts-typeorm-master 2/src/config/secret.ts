import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const ENVIRONMENT = process.env.NODE_ENV;

export const TYPEORM_CONNECTION = process.env.TYPEORM_HOST;
export const APP_VERSION = process.env.npm_package_version;
export const APP_NAME = process.env.npm_package_name;
export const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT,
  TYPEORM_LOGGING,
  SWAGGER_URL,
  SENTRY_DSN,
  PORT,
  JWT_SECRET,
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  FROM_EMAIL,
  EMAIL_APP_PASSWORD,
  TIMEZONE,
} = process.env;
