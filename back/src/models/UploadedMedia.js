import mongoose from "mongoose";

const uploadedMediaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User reference is required"], index: true },
    originalName: { type: String, required: true },
    cloudUrl: { type: String, required: [true, "Cloud URL is required"] },
    publicId: { type: String, required: [true, "Cloud Public ID is required"], index: true },
    fileType: { type: String, enum: ["image", "video", "document", "audio"], required: true, index: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

uploadedMediaSchema.index({ user: 1, fileType: 1 });

export const UploadedMedia = mongoose.model("UploadedMedia", uploadedMediaSchema);
export default UploadedMedia;
