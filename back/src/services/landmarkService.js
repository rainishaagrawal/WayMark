import { executeAiPrompt } from "../config/aiConfig.js";
import { getCoordinates, getNearbyPois } from "./mapService.js";

export const detectLandmarkFromImage = async (fileBuffer, mimeType = "image/jpeg") => {
  const prompt = `Analyze this uploaded landmark image. Identify the landmark name, city, country, historical significance, architectural style, and interesting facts. Respond strictly in JSON: {"landmarkName": "String", "city": "String", "country": "String", "historicalFacts": ["String"], "architecturalStyle": "String"}`;

  const mockFallback = {
    landmarkName: "Eiffel Tower",
    city: "Paris",
    country: "France",
    historicalFacts: [
      "Constructed from 1887 to 1889 as the entrance to the 1889 World's Fair.",
      "Named after the engineer Gustave Eiffel.",
    ],
    architecturalStyle: "Wrought-iron lattice tower",
  };

  const imageData = {
    mimeType: mimeType,
    data: fileBuffer.toString("base64")
  };

  const detectionResult = await executeAiPrompt(prompt, "You are a Vision AI for Landmark Detection.", mockFallback, imageData);

  let nearbyPois = null;
  try {
    const coords = await getCoordinates(`${detectionResult.landmarkName}, ${detectionResult.city}`);
    if (coords?.length > 0) {
      nearbyPois = await getNearbyPois({ lat: coords[0].lat, lon: coords[0].lon });
    }
  } catch (err) {
    console.warn("Nearby POI lookup skipped:", err.message);
  }

  return { landmark: detectionResult, nearbyPois };
};
