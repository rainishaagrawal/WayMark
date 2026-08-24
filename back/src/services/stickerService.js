import { callGeminiAPI } from "../config/aiConfig.js";
import DestinationSticker from "../models/DestinationSticker.js";

export const generateDestinationSticker = async (destinationName) => {
  const prompt = `Return a strict JSON object identifying the country and the most famous iconic landmark or attraction for the destination "${destinationName}". 
  Format: {"country": "...", "landmark": "..."}
  Example for Jaipur: {"country": "India", "landmark": "Hawa Mahal"}
  Return ONLY the JSON.`;
  
  let country = "";
  let landmark = "";
  
  try {
    const aiResponse = await callGeminiAPI(prompt, "You are a geography AI.");
    const cleaned = aiResponse.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);
    country = data.country || "Unknown";
    landmark = data.landmark || destinationName;
  } catch (err) {
    console.error("Failed to parse AI landmark:", err);
    landmark = destinationName;
    country = "Unknown";
  }

  const existingSticker = await DestinationSticker.findOne({
    destination: { $regex: new RegExp(`^${destinationName}$`, "i") }
  });

  if (existingSticker) {
    return existingSticker;
  }

  const imagePrompt = `A die-cut travel sticker for ${country} featuring ${landmark} and the national flag of ${country}. The word "${country}" is written at the top in a cute handwritten font. Thick white border around the entire sticker. Solid pure white background. Flat vector illustration style, bright colors, isolated on white`;
  const encodedPrompt = encodeURIComponent(imagePrompt);
  
  const seed = Math.floor(Math.random() * 1000000);
  const stickerUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;

  const newSticker = new DestinationSticker({
    destination: destinationName,
    country,
    landmark,
    stickerUrl
  });
  
  await newSticker.save();
  return newSticker;
};

