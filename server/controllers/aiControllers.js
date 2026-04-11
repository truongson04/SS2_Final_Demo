import Sessions from "../models/Sessions.js";
import { voiceModel, genAI } from "../config/ai.js";
import Resume from "../models/Resumes.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      systemInstruction:
        "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
    });
    const result = await model.generateContent(userContent);
    const response = await result.response;
    const enhanceContent = response.text();
    return res
      .status(200)
      .json({ enhanceContent, message: "Done, hope you enjoy it :)" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
export const enhanceProjectDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      systemInstruction:
        "Act as an expert resume writer. Your task is to rewrite the project description below to be concise and impactful Constraints: Limit the output to strictly 1-2 sentences. Highlight key responsibilities and quantifiable achievements. Use strong action verbs and ensure it is ATS-friendly. Return ONLY the revised text. Do not include explanations, options, or conversational filler.",
    });
    const result = await model.generateContent(userContent);
    const response = await result.response;
    const enhanceContent = response.text();
    return res.status(200).json({
      enhanceContent,
      message: "Done, enjoy your project description :)",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// analysis resume
export const analysisResume = async (req, res) => {
  const { userContent } = req.body;
  if (!userContent) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const userPrompt = `This is my CV content ${JSON.stringify(userContent)}`;
  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `
      You are a Senior Technical Recruiter with expertise in evaluating software engineering candidates.
Your task is to analyze the provided CV text and generate detailed, constructive feedback.

### INPUT PROCESSING:
- Evaluate the candidate based on structure, technical skills depth, project descriptions, and impact (quantifiable results).
- If no specific Job Description is provided, evaluate based on general industry standards for the role implied in the CV.

### OUTPUT FORMAT REQUIREMENTS (STRICT):
1.  Return ONLY a valid JSON object.
2.  DO NOT include markdown formatting .
3.  DO NOT output any introductory or concluding text.
4.  The output must follow this strict schema:

{
  "score": "Integer (0-100), representing the overall quality of the CV",
  "summary": "A concise professional summary of the candidate's profile (2-3 sentences)",
  "strengths": ["List of string", "Specific strong points found in the CV"],
  "weaknesses": ["List of string", "Specific weak points or red flags"],
  "improvements": ["List of string", "Actionable advice to improve the CV"]
}   
    
      `,
    });
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const analysis = response.text();
    return res.status(200).json({
      message: "Generated successfully, this is our analysis for your resume",
      analysis,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      systemInstruction:
        "You are an expert in resume writing. Your task is to enhance'the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
    });
    const result = await model.generateContent(userContent);
    const response = await result.response;
    const enhanceContent = response.text();
    return res
      .status(200)
      .json({ enhanceContent, message: "Done, enjoy your job description :)" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
// Extract text from resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const systemPrompt = `You are an expert AI Agent to extract data from this resume : ${resumeText} Provide data in this following JSON format with no additional text before or after: {

professional_summary:{

        type:String,

        default:''

    },

    skills:[{

        type:String

    }],

    personal_info:{

        image:{type:String, default:''},

        full_name:{type:String, default:''},

        profession:{type:String, default:""},

        email:{type:String, default:''},

        phone:{type:String, default:""},

        linkedin:{type:String, default:''},

        website:{type:String, default:''}

    },

    experience:[

        {

            company:{type:String},

            position:{type:String},

            start_date:{type:String},

            end_data:{type:String},

            description:{type:String},

            is_current:{type:Boolean}

        }

    ],

    project:[

        {

            name:{type:String},

            type:{type:String},

            description:{type:String}

        }

    ],

    education:[

        {

            institution:{type:String},

            degree:{type:String},

            field:{type:String},

             graduation_date:{type:String},

              gpa:{type:String},

             

        }

    ]}`;
    const userPrompt = "extract data from this resume";
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent({
      contents: [
        {},
        {
          role: "user",
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    const response = JSON.parse(result.response.text());
    const newResume = await Resume.create({ userId, title, ...response });
    res.json({
      resumeId: newResume._id,
      message:
        "Uploaded successfully but there could be some mistakes when extracting content, feel free to modify it :))",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
const getSystemInstruction = (jobDescription, resumeContent) => {
  return `
    You are an expert Hiring Manager conducting a professional job interview.
    CONTEXT:
    - JOB DESCRIPTION: ${jobDescription}
    - CANDIDATE'S RESUME: ${JSON.stringify(resumeContent)}
    
    RULES:
    1. Start immediately with the first question.
    2. One question at a time.
    3. Be professional and probing.
    4. Do not repeat "I am ready".
    
    ACTION: Analyze the data and ask the first question now.
    You can response in  Vietnamese or English based on the language in the JOB DESCRIPTION
  `;
};
// interview with AI
export const chatWithAi = async (req, res) => {
  try {
    const { text, userContent, sessionId, resumeId, voiceMode } = req.body;
    const userId = req.userId;

    if (text === "READY" && !sessionId) {
      return res.status(200).json({
        response:
          "Please paste your job description in the input chat to start",
      });
    }

    function createWavHeader(
      dataLength,
      sampleRate,
      numChannels,
      bitsPerSample,
    ) {
      const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
      const blockAlign = (numChannels * bitsPerSample) / 8;
      const buffer = Buffer.alloc(44);

      buffer.write("RIFF", 0);
      buffer.writeUInt32LE(36 + dataLength, 4);
      buffer.write("WAVE", 8);

      buffer.write("fmt ", 12);
      buffer.writeUInt32LE(16, 16);
      buffer.writeUInt16LE(1, 20);
      buffer.writeUInt16LE(numChannels, 22);
      buffer.writeUInt32LE(sampleRate, 24);
      buffer.writeUInt32LE(byteRate, 28);
      buffer.writeUInt16LE(blockAlign, 32);
      buffer.writeUInt16LE(bitsPerSample, 34);

      buffer.write("data", 36);
      buffer.writeUInt32LE(dataLength, 40);

      return buffer;
    }

    // ==========================================
    // HÀM PHỤ: Chỉ dùng để lồng tiếng (Voice Model)
    // ==========================================
    const generateAudio = async (textToSpeak) => {
      if (!voiceMode) return null;
      try {
        const ttsModel = voiceModel.getGenerativeModel({
          model: process.env.VOICE_MODEL,
        });

        const ttsResult = await ttsModel.generateContent({
          contents: [{ role: "user", parts: [{ text: textToSpeak }] }],
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

        if (!audioPart) return null;

        const mimeType = audioPart.inlineData.mimeType;
        const base64Data = audioPart.inlineData.data;

        if (mimeType.includes("pcm") || mimeType.includes("L16")) {
          // Extract sample rate if specified
          const rateMatch = mimeType.match(/rate=(\d+)/);
          const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;

          const pcmBuffer = Buffer.from(base64Data, "base64");
          const header = createWavHeader(pcmBuffer.length, sampleRate, 1, 16);
          const wavBuffer = Buffer.concat([header, pcmBuffer]);

          return `data:audio/wav;base64,${wavBuffer.toString("base64")}`;
        }

        return `data:${mimeType};base64,${base64Data}`;
      } catch (err) {
        console.error("Error with the model ", err.message);
        return null;
      }
    };

    // case with no session
    if (!sessionId) {
      // BƯỚC 1: Gọi Não (GEMINI_MODEL) để lấy Text
      const modelConfig = {
        model: process.env.GEMINI_MODEL,
        systemInstruction: getSystemInstruction(text, userContent),
      };

      const model = genAI.getGenerativeModel(modelConfig);
      const chat = model.startChat({ history: [] });

      const result = await chat.sendMessage(
        "Please start the interview. Ask the first question based on my Resume",
      );
      const firstQuestion = result.response.text();

      const audioBase64 = await generateAudio(firstQuestion);

      const newSession = new Sessions({
        userId,
        resumeId,
        contextData: { jobDescription: text, resumeContent: userContent },
        history: [
          { role: "user", parts: [{ text: "Ask the first question" }] },
          { role: "model", parts: [{ text: firstQuestion }] },
        ],
      });

      await newSession.save();
      return res.status(200).json({
        response: firstQuestion,
        audioData: audioBase64,
        sessionId: newSession._id,
      });
    }

    // ==========================================
    // TRƯỜNG HỢP 2: ĐANG CHAT QUA LẠI (ĐÃ CÓ SESSION)
    // ==========================================
    const currentSession = await Sessions.findOne({ _id: sessionId });
    if (!currentSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    // BƯỚC 1: Gọi Não (GEMINI_MODEL) để lấy câu trả lời bằng Text
    const modelConfig = {
      model: process.env.GEMINI_MODEL,
      systemInstruction: getSystemInstruction(
        currentSession.contextData.jobDescription,
        currentSession.contextData.resumeContent,
      ),
    };

    const model = genAI.getGenerativeModel(modelConfig);

    const geminiHistory = currentSession.history.slice(-6).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts[0].text }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(text);
    const aiResponse = result.response.text();

    const audioBase64 = await generateAudio(aiResponse);

    currentSession.history.push(
      { role: "user", parts: [{ text: text }] },
      { role: "model", parts: [{ text: aiResponse }] },
    );
    await currentSession.save();

    return res.status(200).json({
      response: aiResponse,
      audioData: audioBase64,
      sessionId: currentSession._id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: "Something wrong", error: err.message });
  }
};

// Get all interview sessions for a user
export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.query;

    const query = { userId };
    if (resumeId) query.resumeId = resumeId;

    const history = await Sessions.find(query)
      .select("createdAt contextData.jobDescription status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ history });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get a specific interview session
export const getInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const session = await Sessions.findOne({ _id: sessionId, userId });
    if (!session) {
      return res
        .status(404)
        .json({ message: "Session not found or unauthorized" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete an interview session
export const deleteInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    const result = await Sessions.deleteOne({ _id: sessionId, userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Session not found or unauthorized" });
    }

    return res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Quick chat with AI assistant (for floating chat widget)
export const quickChat = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL,
      systemInstruction: `You are a friendly and helpful AI assistant for CVBuilder - a professional resume building platform.
Your role is to help users with:
- Resume/CV writing tips and best practices
- Career advice and job search strategies  
- Interview preparation tips
- Professional development guidance
- Any questions about using the CVBuilder platform

Keep responses concise, helpful, and professional.
You can respond in Vietnamese or English based on the user's language.`,
    });

    const geminiHistory = (history || [])
      .filter((msg) => msg && msg.content && msg.content.trim())
      .slice(-10)
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const aiResponse = await result.response.text();

    return res.status(200).json({ response: aiResponse });
  } catch (err) {
    console.error("Quick chat error:", err.message || err);
    return res
      .status(400)
      .json({ message: "Something went wrong", error: err.message });
  }
};
