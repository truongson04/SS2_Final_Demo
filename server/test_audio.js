import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.VOICE_KEY || process.env.GEMINI_API_KEY);
const ttsModel = genAI.getGenerativeModel({
  model: process.env.VOICE_MODEL || "gemini-2.5-flash-preview-tts",
});

function createWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  // "RIFF" chunk descriptor
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write("WAVE", 8);

  // "fmt " sub-chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

async function run() {
  try {
    const ttsResult = await ttsModel.generateContent({
      contents: [{ role: "user", parts: [{ text: "Please generate audio for this text: Hello, I am ready" }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" },
          },
        },
      },
    });

    const audioPart =
      ttsResult.response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData && p.inlineData.mimeType?.startsWith("audio/"),
      );
      
    if (audioPart && audioPart.inlineData.mimeType.includes("pcm")) {
      const pcmData = Buffer.from(audioPart.inlineData.data, "base64");
      // rate=24000
      const sampleRate = 24000;
      const numChannels = 1;
      const bitsPerSample = 16;
      const header = createWavHeader(pcmData.length, sampleRate, numChannels, bitsPerSample);
      const wavBuffer = Buffer.concat([header, pcmData]);
      const base64Wav = wavBuffer.toString("base64");
      
      console.log("WAV Mime Type: audio/wav");
      console.log("Wav base64 length:", base64Wav.length);
      console.log("First 50 chars:", base64Wav.substring(0, 50));
    } else {
      console.log("MIME TYPE:", audioPart?.inlineData?.mimeType);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
run();
