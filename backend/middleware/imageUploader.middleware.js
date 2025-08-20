import multer from "multer";
import cloudinary from "../config/cloudinary.config.js";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, next) => {
    const ok = ["image/png", "image/jpeg"].includes(file.mimetype);
    console.log(ok);
    
    next(ok ? null : new Error("Only JPG and PNG allowed"), ok);
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
