const getApiKey = () => {
  return localStorage.getItem('suno_api_key');
};

const API_BASE_URL = '/api/v1';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateSong = async (
  title: string,
  styleOfMusic: string,
  instrumental: boolean,
  lyrics: string,
  prompt: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Suno API key not found. Please set it in the settings.');
  }

  try {
    // Prepare the request body
    let requestBody: any = {
      model: "V5",
      customMode: false,
      instrumental: instrumental,
      callBackUrl: "", // Optional: can be set if needed
    };

    if (lyrics.trim()) {
      // Custom Mode
      requestBody.customMode = true;
      requestBody.prompt = lyrics;
      requestBody.style = styleOfMusic;
      requestBody.title = title;
    } else {
      // Non-custom Mode
      requestBody.customMode = false;
      requestBody.prompt = prompt;
      requestBody.style = "";
      requestBody.title = "";
    }

    // Start the generation task
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to start song generation:', errorText);
      throw new Error(`Failed to start song generation: ${errorText}`);
    }

    const responseData = await response.json();
    const taskId = responseData.data?.taskId;
    if (!taskId) {
      throw new Error('No taskId returned from Suno API');
    }

    // Poll for task status until success or failure
    let taskStatus = '';
    let audioUrl = '';
    while (taskStatus !== 'SUCCESS') {
      await delay(3000); // wait 3 seconds before polling
      const statusResponse = await fetch(`${API_BASE_URL}/generate/record-info?taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Failed to get task status:', errorText);
        throw new Error(`Failed to get task status: ${errorText}`);
      }

      const statusData = await statusResponse.json();
      taskStatus = statusData.data?.status;

      if (taskStatus === 'SUCCESS') {
        const audioData = statusData.data?.response?.data?.[0];
        if (audioData && audioData.audio_url) {
          audioUrl = audioData.audio_url;
        } else {
          throw new Error('No audio URL found in task response');
        }
      } else if (taskStatus === 'FAILED') {
        throw new Error('Song generation task failed');
      }
    }

    return audioUrl;
  } catch (error) {
    console.error('Error in generateSong:', error);
    throw error;
  }
};
