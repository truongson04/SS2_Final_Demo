
import Sessions from "../models/Sessions.js";
import genAI from "../config/ai.js";
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
export const interviewGenerate = async (req, res) => {
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
      You are a Senior Technical Recruiter.
    Analyze the following CV and generate a list of interview questions.

    **CRITICAL REQUIREMENT:**
    The output must be a JSON array (no markdown formatting) complying with this structure:
    
         [
            {
                "id": "integer",
                "category": "string (Technical/Behavioral/Project)",
                "difficulty": "string (Low/Medium/High)",
                "question": "string",
                "suggestedAnswer":string (How to answer the question well ?)
            }
        ]
    
      `,
    });
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const questions = response.text();
    return res
      .status(200)
      .json({ message: "Generated successfully", questions });
  } catch (error) {
    return res.status(400).json({ message: "Two many request, please comeback later :))" });
  }
};
// analysis resume
export const analysisResume = async (req, res)=>{
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
    return res
      .status(200)
      .json({ message: "Generated successfully, this is our analysis for your resume", analysis });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
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
    res.json({ resumeId: newResume._id , message :'Uploaded successfully but there could be some mistakes when extracting content, feel free to modify it :))'});
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
    - CANDIDATE'S RESUME: ${ JSON.stringify(resumeContent)}
    
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
    const { text, userContent, sessionId } = req.body;
    const userId = req.userId;

       if(text==='READY' && !sessionId){

  return res.status(200).json({response:"Please paste your job description in the input chat to start"})

 }
    if (!sessionId) {
      

    
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL,
        systemInstruction: getSystemInstruction(text, userContent),
      });

      
      const chat = model.startChat({
        history: [],
       
      });

   
      const result = await chat.sendMessage("Please start the interview. Ask the first question based on my Resume");
      const firstQuestion = await result.response.text();

   
      const newSession = new Sessions({
        userId,
        contextData: {
          jobDescription: text,
          resumeContent: userContent,
        },
        history: [
          {
           role:'user',
           parts:[{text:'Ask the first question'}]
          },
          {
            role: "model",
            parts: [{ text: firstQuestion }],
          },
        ],
      });

      await newSession.save();
      return res.status(200).json({ response: firstQuestion, sessionId: newSession._id });
    }

 
    
    const currentSession = await Sessions.findOne({ _id: sessionId });
    if (!currentSession) {
      return res.status(404).json({ message: "Session not found" });
    }

  
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL, 
      systemInstruction: getSystemInstruction(
        currentSession.contextData.jobDescription,
        currentSession.contextData.resumeContent
      ),
    });

    
    const geminiHistory = currentSession.history.slice(-6).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.parts[0].text }],
    }));

    const chat = model.startChat({
      history: geminiHistory,
     
    });

    
   const result = await chat.sendMessage(text);
   const aiResponse= await result.response.text()

   
    currentSession.history.push(
      { role: "user", parts: [{ text: text }] },
      { role: "model", parts: [{ text: aiResponse }] }
    );

    await currentSession.save();

    return res.status(200).json({ response: aiResponse, sessionId: currentSession._id });

  } catch (err) {
    console.error(err);
  

    return res.status(400).json({ message: "Something wrong", error: err.message });
  }
};
