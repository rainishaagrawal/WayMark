import mongoose from "mongoose";

const stickerSchema = new mongoose.Schema(
  {
    destination: { type: String, required: true, index: true },
    country: { type: String, default: "" },
    landmark: { type: String, required: true },
    stickerUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const DestinationSticker = mongoose.model("DestinationSticker", stickerSchema);
export default DestinationSticker;

