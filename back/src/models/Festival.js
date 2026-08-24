import mongoose from "mongoose";

const festivalSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Festival name is required"], trim: true, index: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: [true, "Destination reference is required"], index: true },
    description: { type: String, required: [true, "Festival description is required"] },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date, required: [true, "End date is required"] },
    category: { type: String, enum: ["CULTURAL", "MUSIC", "FOOD", "RELIGIOUS", "SEASONAL", "OTHER"], default: "CULTURAL", index: true },
    seasonalAttractionInfo: {
      weather: { type: String, default: "" },
      highlights: { type: [String], default: [] },
    },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

festivalSchema.index({ destination: 1, startDate: 1 });
festivalSchema.index({ category: 1, startDate: 1 });

export const Festival = mongoose.model("Festival", festivalSchema);
export default Festival;
