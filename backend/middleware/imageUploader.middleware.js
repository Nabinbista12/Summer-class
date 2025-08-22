import multer from "multer";
import cloudinary from "../config/cloudinary.config.js";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, next) => {
    const accepted = ["image/png", "image/jpeg", "image/webp" ];
    const ok = accepted.includes(file.mimetype);
    console.log('upload middleware, file mimetype:', file.mimetype, 'accepted:', ok);
    if (!ok) {
      return next(new Error("Only JPG, PNG or WEBP allowed"), false);
    }
    return next(null, true);
  },
});

export function uploadBufferToCloudinary(buffer, option = {}) {
  console.log(buffer);
  
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", ...option },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}
