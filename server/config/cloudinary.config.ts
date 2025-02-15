import { v2 as cloudinary } from 'cloudinary';
import { getEnvOrFatal } from 'common/utils/env.util';

cloudinary.config({
    cloud_name: getEnvOrFatal('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnvOrFatal('CLOUDINARY_API_KEY'),
    api_secret: getEnvOrFatal('CLOUDINARY_API_SECRET'),
  });
