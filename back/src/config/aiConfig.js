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

    let text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from Gemini API");
    
    // Attempt to extract JSON from markdown or raw text
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    }

    try {
      return JSON.parse(text);
    } catch (parseErr) {
      console.warn("JSON Parse Failed for Gemini text:", text);
      throw parseErr;
    }
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("⚠️ Gemini Quota Exceeded (429). Instantly falling back to Groq.");
    } else {
      console.warn("⚠️ Gemini API call failed, attempting Groq fallback:", error.message);
    }
    throw error;
  }
};

export const callGroqAPI = async (prompt, systemInstruction = "") => {
  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: "openai/gpt-oss-20b",
        messages: [
          ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data?.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from Groq API");
    
    // Attempt to extract JSON from markdown or raw text
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      text = jsonMatch[0];
    } else {
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    }

    try {
      return JSON.parse(text);
    } catch (parseErr) {
      console.warn("JSON Parse Failed for Groq text:", text);
      throw parseErr;
    }
  } catch (error) {
    console.error("❌ Groq API call failed:", error.message);
    if (error.response && error.response.data) {
        console.error("Groq Error Data:", JSON.stringify(error.response.data, null, 2));
    }
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
