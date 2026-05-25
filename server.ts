import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header as requested
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. API: Fetch Educational Trivia about a selected state/province
app.post("/api/gemini/state-info", async (req, res) => {
  const { country, stateName } = req.body;
  if (!country || !stateName) {
    return res.status(400).json({ error: "country and stateName are required parameters." });
  }

  if (!ai) {
    return res.status(200).json({
      fallback: true,
      capital: "Check Settings",
      climate: "AI Key Not Synced",
      welcomeMsg: "Please configure your GEMINI_API_KEY in Settings > Secrets to unlock live AI trivia!",
      funFact: `Welcome to ${stateName}! In actual play, Gemini AI will provide dynamic facts about this region's geography, landscape, culture, and nature here.`,
      historicalFact: "Did you know each state has unique geographic landmarks shaping its local history?",
      placesToVisit: ["Major Landmarks", "Historic Capitals", "Scenic Parks"]
    });
  }

  try {
    const prompt = `Provide educational geography facts for students about the state or province of "${stateName}" in the country of "${country}". Include its official capital, its general climate/geography, an engaging fun fact, a brief historical geographic fact, and 3 famous geographic or historical places to visit here. Keep the tone friendly, academic, encouraging, and perfect for young school students learning geography.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert, friendly interactive Geography Teacher that helps school children learn map skills, regional geography, and historical events globally.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            capital: { type: Type.STRING, description: "The official capital of the state or province." },
            climate: { type: Type.STRING, description: "A simple description of the climate, topography, or geography (e.g., mountains, plains, coastal)." },
            funFact: { type: Type.STRING, description: "An engaging, child-friendly fun fact about this state's geography, culture, or animal life." },
            historicalFact: { type: Type.STRING, description: "A brief fact showing how geography influenced history, trade, or settlement in this state." },
            placesToVisit: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 famous geographic or historical landmarks to explore here."
            }
          },
          required: ["capital", "climate", "funFact", "historicalFact", "placesToVisit"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response string from Gemini");
    }

    const data = JSON.parse(text.trim());
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini state-info error:", error);
    return res.status(500).json({
      error: "Could not fetch fun facts from Gemini",
      details: error.message
    });
  }
});

// 2. API: Ask the Interactive Map Tutor custom questions
app.post("/api/gemini/ask-tutor", async (req, res) => {
  const { question, history, currentCountry, completedStates } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required." });
  }

  if (!ai) {
    return res.status(200).json({
      answer: "Hi! I am your AI Geography Guide. It looks like you haven't linked your GEMINI_API_KEY in Settings > Secrets yet. To unlock fully live chat answers, please add your key! In the meantime: you are playing the Map Puzzle of " + (currentCountry || "India & USA") + ". Keep dragging those puzzle pieces!"
    });
  }

  try {
    // Construct safe conversation system
    const completedList = completedStates && completedStates.length > 0 
      ? completedStates.join(", ") 
      : "None yet";
    
    const contextStr = `The student is currently playing the Puzzle Map Simulator. They are learning the geography of "${currentCountry || "India and USA"}". So far, they have successfully dragged and dropped the following states into their correct position: [${completedList}].`;
    
    const chatHistory = history || [];
    const formattedContents = chatHistory.map((h: { role: string; content: string }) => ({
      role: h.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: h.content }]
    }));

    // Append current prompt
    const fullPrompt = `${contextStr}\n\nStudent's Query: "${question}"\n\nPlease answer this geography question clearly and enthusiastically. Use simple, educational language with short bullet points. Challenge the student with a tiny trivia question at the end to keep them engaged! Limit response to 3-4 short paragraphs maximum.`;

    formattedContents.push({
      role: "user" as const,
      parts: [{ text: fullPrompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: "You are an affectionate, energetic, highly knowledgeable school Geography Tutor named 'Atlas'. You specialize in India, USA, global physical geography, maps, coordinates, capitals, and natural landmarks. Use markdown lists and bold formatting to make answers attractive. Always end with a short and fun geography challenge."
      }
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Gemini ask-tutor error:", error);
    return res.status(500).json({
      error: "Error querying map tutor",
      details: error.message
    });
  }
});

// Vite Middleware & Production routing
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[GeoServer] Puzzle Map Simulator running at http://localhost:${PORT}`);
  });
};

startServer().catch((e) => {
  console.error("Failed to start full-stack server:", e);
});
