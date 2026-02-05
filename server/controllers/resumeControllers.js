import imagekit from "../config/imageKit.js";
import Resume from "../models/Resumes.js";
import fs from 'fs'
export const createResume = async(req, res)=>{
    try{
        const userId = req.userId;
        const {title}= req.body;
        const newResume = await Resume.create({userId, title})
        return res.status(201).json({message:'Resume has been created successfully !', resume:newResume})
    }
    catch(err){
        return res.status(400).json({message:err.message})
    }
}
export const deleteResume = async(req, res)=>{
try{
const userId = req.userId;
const{resumeId}= req.params;
await Resume.deleteOne({_id:resumeId, userId});
return res.status(200).json({message:'Resume has been deleted'})
}
catch(err){

}
}
export const getResumeById = async(req, res)=>{
    try{
        const userId =req.userId;
        const{resumeId}= req.params;
        const resume = Resume.findOne({_id:resumeId, userId});
        if(!resume){
            return res.status(404).json({message:"Cannot found resume"})
        }
        resume._v= undefined;
         resume.created_at= undefined;
          resume.updated_at = undefined;
          return res.status(200).json({resume})
    }   
    catch(err){
        return res.status(400).json({message:err.message})
    }
}
export const getPublicResumeById= async(req, res)=>{
try{
const {resumeId}= req.params;
const resume = await Resume.findOne({_id:resumeId, public:true})
if(!resume){
    return res.status(404).json({message:'Resume not found'})
}
return res.status(200).json({resume})
}

catch(err){
return res.status(400).json({message:err.message})
}
}

export const updateResume = async(req, res)=>{
    try{
  const{resumeId, resumeData, removeBackground}= req.body;
  const userId = req.userId;
  const image = req.file;
  const resumeDataClone =   JSON.parse(resumeData)
  // handle AI image
  if(image){
    const response = await imagekit.files.upload({
  file: fs.createReadStream(image.path),
  fileName: 'resume.png',
  folder:'user-resumes',
  transformation:{
    pre:'w-300, h-300, fo-face, z-0.75'+(removeBackground ?', e-bgremove':'')
  }
});
resumeDataClone.personal_info.image= response.url

  }
  await Resume.updateOne({userId, _id:resumeId},resumeDataClone)
  return res.status(200).json({message:'Saved successfully'})
    }
    catch(err){
return res.status(400).json({message:err.message})
    }
}