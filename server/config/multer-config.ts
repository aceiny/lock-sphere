import { BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getEnvOrFatal } from "common/utils/env.util";

const allowedTypes = ["image/jpeg", "image/png"];

cloudinary.config({
  cloud_name: getEnvOrFatal("CLOUDINARY_CLOUD_NAME"),
  api_key: getEnvOrFatal("CLOUDINARY_API_KEY"),
  api_secret: getEnvOrFatal("CLOUDINARY_API_SECRET"),
});

export const MulterConfig = {
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => ({
      folder: "profile_pictures", 
      format: file.mimetype === "image/jpeg" ? "jpg" : "png", 
      public_id: `profile-${Date.now()}-${uuidv4()}`,
    }),
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestException("Invalid file type"), false);
    }
  },
};
