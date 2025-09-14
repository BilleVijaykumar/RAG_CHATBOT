import { ChromaClient } from "chromadb";
import axios from "axios";

const chroma = new ChromaClient({ path: "http://localhost:8000" });

export async function ragQuery(query) {
  try {
    // 1. Search vector DB (mocked for now)
    const docs = ["Breaking news about AI", "Economy updates", "Sports highlights"];

    // 2. Gemini API endpoint
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // 3. Axios POST request with API key in headers
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: `Context: ${docs.join(" ")}. Question: ${query}`
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("RAG query failed:", error.message);
    return "Sorry, I could not fetch the answer.";
  }
}
