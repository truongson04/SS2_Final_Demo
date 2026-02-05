import genAI from "../config/ai.js";

export const enhanceProfessionalSummary = async(req, res)=>{
try {
    const {userContent}= req.body;
    if(!userContent){
        return res.status(400).json({message:"Missing fields"})
    }
    const model = genAI.getGenerativeModel({
        model:process.env.GEMINI_MODEL,
        systemInstruction:"You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else."
    })
    const result = await model.generateContent(userContent);
    const response = await result.response;
    const enhanceContent = response.text()
    return res.status(200).json({enhanceContent})

} catch (error) {
    return res.status(400).json({message:error.message})
}
}