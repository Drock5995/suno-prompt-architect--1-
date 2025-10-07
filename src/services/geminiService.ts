import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  // The environment variable for the API key was not found.
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateSunoPrompt = async (
  artist: string,
  vibe: string,
  lyrics?: string
): Promise<string> => {
  const systemInstruction = `You are an expert prompt engineer for the Suno AI music generator. Your goal is to create a single, detailed, and descriptive prompt that translates a user's vision into music. The prompt must be a continuous block of text, not a list, and must not exceed 1000 characters.

Your primary task is to capture the sonic identity of the specified artist. However, if lyrics are provided, your prompt must be directly inspired by their mood, story, and imagery. The instrumentation, tempo, and production choices should all serve to enhance the feeling of the lyrics. For example, if the lyrics describe a lonely walk in a neon-lit city, the prompt should suggest elements like 'shimmering synth pads like reflections on wet pavement' and a 'slow, pensive drum machine beat'.

Focus on a rich vocabulary of adjectives and technical terms that an AI can interpret. Do not use markdown. Return only the pure text prompt.`;

  const userPrompt = `
Generate a music prompt based on these details:
- Artist Style: ${artist}
- Vibe/Theme: ${vibe}
${lyrics ? `- Lyrics to Inspire the Music: [LYRICS]${lyrics}[/LYRICS]` : ''}

Create a detailed prompt that includes:
- Genre (e.g., '80s synth-pop with a modern darkwave twist')
- Mood (e.g., 'nostalgic, melancholic, but with a driving beat')
- Instrumentation (e.g., 'LinnDrum machine, Roland Juno-106 synth pads, shimmering chorus-effected guitar')
- Vocal Style (e.g., 'male, baritone, breathy, with layered harmonies')
- Tempo (e.g., 'medium-tempo, around 120 bpm')
- Production (e.g., 'gated reverb on the snare, analog warmth')
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    // Enforce the character limit on the client side as a failsafe.
    return response.text.trim().substring(0, 1000);
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    return "Error: Could not generate prompt. Please check your API key and try again.";
  }
};

export const generateLyrics = async (
  artist: string,
  vibe: string
): Promise<string> => {
  const systemInstruction = `You are an expert songwriter, channeling the spirit of the world's greatest lyricists. Your task is to write an original, structured song in the distinct style of a specified artist, reflecting a given theme.

Your process is to 'show, not tell.' Instead of stating an emotion, you will paint a picture with words, using sensory details, vivid imagery, and metaphors to evoke that feeling in the listener.

Key Principles:
1.  **Structure:** Create a complete song structure: [Verse 1], [Chorus], [Verse 2], [Bridge], and a final [Chorus].
2.  **Storytelling:** Create a small narrative or a vivid scene. Give the listener a situation they can visualize and feel.
3.  **Imagery:** Use concrete, sensory language. What does it look, sound, or feel like?
4.  **Emotional Core:** Start with a strong, relatable concept. What is the central feeling or story you want to convey?
5.  **Authenticity:** Write with vulnerability and honesty, capturing the specified artist's unique voice. Use Google Search to analyze their lyrical patterns, vocabulary, and common themes.
6.  **The Hook:** The chorus should be memorable and encapsulate the core idea of the song.

You MUST format the output with clear labels for each section: [Verse 1], [Chorus], [Verse 2], [Bridge]. Each section must be on a new line. Return only the formatted lyrics, with no additional commentary.`;

  const userPrompt = `
Artist to emulate: ${artist}
Vibe/Theme for the song: ${vibe}

Based on this, write a complete song with two verses, a chorus, and a bridge that tells a story and paints a picture, just as ${artist} would.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating lyrics with Gemini:", error);
    return "Error: Could not generate lyrics.";
  }
};