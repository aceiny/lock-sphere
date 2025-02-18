import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { getEnvOrFatal } from "common/utils/env.util";

export const CorsConfig : CorsOptions= {
  origin: [
    getEnvOrFatal('FRONTEND_URL'),
    'http://localhost:3001'

  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
