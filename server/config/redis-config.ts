import { ConnectionOptions } from "tls";

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required.`);
  }
  return value;
}
export const RedisConfig = {
  host: getEnvVar("REDIS_HOST"),
  port: +getEnvVar("REDIS_PORT"),
  /*username: getEnvVar("REDIS_USERNAME"),
  password: getEnvVar("REDIS_PASSWORD"),
  tls: {
    servername: getEnvVar("REDIS_SERVER_NAME"),
  },*/ // local development
};
