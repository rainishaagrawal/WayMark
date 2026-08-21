import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "MOCK_GEMINI_KEY";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "MOCK_GROQ_KEY";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export const callGeminiAPI = async (prompt, systemInstruction = "", imageData = null) => {
  try {
    const parts = [];
    if (systemInstruction) parts.push({ text: systemInstruction });
    if (imageData) {
      parts.push({
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data
        }
      });
    }
    parts.push({ text: prompt });

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: parts,
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini API");
    return JSON.parse(text);
  } catch (error) {
    console.warn("⚠️ Gemini API call failed or unparseable, attempting Groq fallback:", error.message);
    if (error.response?.data) {
      console.warn("Gemini Error Data:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

export const callGroqAPI = async (prompt, systemInstruction = "") => {
  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("❌ Groq API call failed:", error.message);
    throw error;
  }
};

export const executeAiPrompt = async (prompt, systemInstruction = "", mockFallback = {}, imageData = null) => {
  try {
    return await callGeminiAPI(prompt, systemInstruction, imageData);
  } catch (geminiError) {
    try {
      if (imageData) throw new Error("Groq fallback not configured for vision");
      return await callGroqAPI(prompt, systemInstruction);
    } catch (groqError) {
      console.error("💥 All AI Services failed. Returning intelligent mock fallback.");
      return mockFallback;
    }
  }
};
