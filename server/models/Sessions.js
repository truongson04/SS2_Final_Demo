import mongoose from "mongoose";
const interviewSessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
    },
    resumeId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Resume', 
        required: true
    },
    contextData:{
        jobDescription: { type: String, required: true },
        resumeContent:{
            type:Object,
            required:true
        },
        language: { type: String, default: "English" },
        voiceName: { type: String, default: "Puck" }
    },
    history:[
        {
            role:{
                type:String,
                enum:['user', 'model'],
                required:true
            },
            parts:[
                {
                    text:{type:String, required:true}
                }
            ], 
            timestamp: { type: Date, default: Date.now }
        }
    ], 
    status: {
    type: String,
    enum: ['active', 'completed', 'evaluated'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now }
})
const Sessions = mongoose.model('Sessions', interviewSessionSchema, 'InterviewSessions')
export default Sessions