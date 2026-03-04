import Resume from "../models/Resumes.js";
import User from "../models/Users.js";

export async function getAllUsers(req, res){
    const users = await User.find({isDeleted:false});
    
    let returnUsers = [];
    for(const user of users){
        const cvNums =await Resume.countDocuments({userId:user._id});
        user.cvNumbers = cvNums;
        user.password = undefined;
        console.log(user)
        returnUsers.push(user)
        
    }
    
    return res.json({message:"Get success", users: returnUsers})
}
export async function changeStatus (req, res){
    try {
        const {userId, isActive}= req.body;
    await User.updateOne({_id:userId}, {$set:{isActive}})
    return res.status(200).json({message:"Updated successfully"}); 
    } catch (error) {
        return res.status(400).json({message:error})
    }
    
}
export async function changeStatusMulti (req, res){
   try {
    const {userIds, isActive}= req.body;
    await User.updateMany({_id: {$in:userIds}}, {
        $set:{isActive}
    })
    return res.status(200).json({message:"Updated successfully"}); 
    
   } catch (error) {
      return res.status(400).json({message:error})
   }
}
export async function deleteUser(req, res) {
    try {
        const {userId} = req.params;
       
        await User.updateOne({_id:userId}, {$set:{isDeleted:true}})
        return res.status(200).json({message:"Deleted successfully"}); 
    } catch (error) {
        return res.status(400).json({message:error})
        
    }

    
}
export async function deleteManyUsers(req, res) {
    try {
        const {userIds} = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({message:"userIds must be a non-empty array"});
        }
        await User.updateMany({_id:{$in:userIds}}, {$set:{isDeleted:true}});
        return res.status(200).json({message:"Deleted successfully"});
    } catch (error) {
        return res.status(400).json({message:error.message || "Delete failed"})
    }
}
