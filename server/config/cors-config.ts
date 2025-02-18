import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
export const CorsConfig : CorsOptions= {
  origin: [
    'https://lock.yxne.tech/',
    'https://lock.yxne.tech',    
    'http://localhost:3001'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
