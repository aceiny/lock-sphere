import { getEnvOrFatal } from "common/utils/env.util";
import { ConnectionOptions } from "tls";

export const PostgresConfig = {
  type: getEnvOrFatal<string>("DB_DRIVER"),
  host: getEnvOrFatal<string>("DB_HOST") || "localhost",
  port: getEnvOrFatal<number>("DB_PORT"),
  username: getEnvOrFatal<string>("DB_USER"),
  password: getEnvOrFatal<string>("DB_PASSWORD"),
  database: getEnvOrFatal<string>("DB_NAME"),
  
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: getEnvOrFatal("APP_ENV") == "development", // set to false in production
  extra: {
    max: getEnvOrFatal<number>("POOL_SIZE"), // maximum number of clients in the pool
    idleTimeoutMillis: getEnvOrFatal<string>("POOL_TIMEOUT"), // close idle clients after 30 seconds
    connectionTimeoutMillis: getEnvOrFatal<string>("POOL_MAX_CONN_LIFETIME"), // return an error after 2 seconds if connection could not be made
  },
} as ConnectionOptions;
