import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateImagePrompt = (title: string, artistStyle: string, prompt: string, vibe?: string): string => {
  // Create a detailed image prompt based on song metadata
  const displayText = title.length > 20 ? artistStyle : title;
  const imagePrompt = `Create an album cover art image. The text "${displayText}" should be prominently centered in bold, stylish typography. The background and overall aesthetic should be in the style of the artist ${vibe || 'general'}. Incorporate elements that reflect the musical style of ${artistStyle}. Make it visually striking and relevant to the music genre, with appropriate colors and imagery that captures the essence of the song inspired by ${prompt}.`;

  return imagePrompt;
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
    };
    const model = 'gemini-2.0-flash-exp';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let imageData: string | null = null;
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }
      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        imageData = `data:${inlineData.mimeType || 'image/png'};base64,${inlineData.data}`;
        break; // Take the first image
      }
    }

    if (!imageData) {
      throw new Error("No image data in response");
    }

    return imageData;
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate image. Please check your API key and try again.");
  }
};
