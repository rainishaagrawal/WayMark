import { v2 as cloudinary } from "cloudinary";
import UploadedMedia from "../models/UploadedMedia.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloud = async (userId, file) => {
  if (!file) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "File buffer is required for upload");

  return new Promise((resolve, reject) => {
    if (
      process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
      process.env.CLOUDINARY_API_SECRET && !process.env.CLOUDINARY_API_SECRET.includes("***")
    ) {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: "voyageai" }, async (error, result) => {
        if (error) {
          return reject(new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, `Cloudinary Upload Error: ${error.message}`));
        }
        try {
          const media = await UploadedMedia.create({
            user: userId,
            originalName: file.originalname || "uploaded_file",
            cloudUrl: result.secure_url,
            publicId: result.public_id,
            fileType: file.mimetype.startsWith("image/") ? "image" : "document",
            mimeType: file.mimetype,
            size: file.size || 0,
          });
          resolve(media);
        } catch (dbError) {
          reject(dbError);
        }
      });
      uploadStream.end(file.buffer);
    } else {
      UploadedMedia.create({
        user: userId,
        originalName: file.originalname || "mock_file.jpg",
        cloudUrl: `https://via.placeholder.com/800x600?text=${encodeURIComponent(file.originalname || "Upload")}`,
        publicId: `mock_${Date.now()}`,
        fileType: "image",
        mimeType: file.mimetype || "image/jpeg",
        size: file.size || 1024,
      }).then(resolve).catch(reject);
    }
  });
};
