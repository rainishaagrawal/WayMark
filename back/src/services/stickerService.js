import { callGeminiAPI } from "../config/aiConfig.js";
import DestinationSticker from "../models/DestinationSticker.js";

export const generateDestinationSticker = async (destinationName) => {
  const prompt = `Return a strict JSON object identifying the country and the most famous iconic visual representation (can be a landmark, monument, or famous local street food like Poha Jalebi) for the destination "${destinationName}". 
  Format: {"country": "...", "landmark": "..."}
  Example for Jaipur: {"country": "India", "landmark": "Hawa Mahal"}
  Example for Indore: {"country": "India", "landmark": "Poha Jalebi"}
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

  const imagePrompt = `Cute hand-drawn watercolor travel sticker of ${landmark} in ${country}. Features the landmark and a small national flag. Thick white die-cut border. Clean, colorful clipart isolated on a pure solid white background. No extra text, no shadows, in the style of a scrapbook die-cut sticker.`;
  const encodedPrompt = encodeURIComponent(imagePrompt);
  
  const seed = Math.floor(Math.random() * 1000000);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}`;

  let finalStickerUrl = pollinationsUrl;
  
  try {
    const fs = (await import("fs")).default;
    const path = (await import("path")).default;

    console.log("Removing background for:", destinationName);
    const bgResponse = await fetch("http://localhost:3001/remove-background-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: pollinationsUrl })
    });
    
    if (bgResponse.ok) {
      const arrayBuffer = await bgResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `sticker_${Date.now()}_${Math.floor(Math.random()*1000)}.png`;
      const filepath = path.join(process.cwd(), "..", "front", "public", "stickers", filename);
      fs.writeFileSync(filepath, buffer);
      finalStickerUrl = `/stickers/${filename}`;
      console.log("Background removed and saved:", finalStickerUrl);
    } else {
      console.warn("Background removal failed, falling back to original URL");
    }
  } catch (err) {
    console.error("Error calling bg-remove-api:", err.message);
  }

  const newSticker = new DestinationSticker({
    destination: destinationName,
    country,
    landmark,
    stickerUrl: finalStickerUrl
  });
  
  await newSticker.save();
  return newSticker;
};

