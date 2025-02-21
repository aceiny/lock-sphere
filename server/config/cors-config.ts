import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { getEnvOrFatal } from "common/utils/env.util";
export const CorsConfig : CorsOptions= {
  origin: [
    'https://e6e4-154-246-106-78.ngrok-free.app',
    'http://localhost:3001',
    'http://localhost:3000',
    'https://sphere.yxne.tech',
    'https://lock.yxne.tech'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', , 'PATCH' , 'DELETE']
};
