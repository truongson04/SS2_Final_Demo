import Resume from "../models/Resumes.js";
import User from "../models/Users.js";

export async function getDashboardStats(req, res) {
    try {
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const totalResumes = await Resume.countDocuments();
        
       
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            isDeleted: false,
            createdAt: { $gte: sevenDaysAgo }
        });
        
       
        const activeUsersCount = await User.countDocuments({ isDeleted: false, isActive: true });
        
        return res.status(200).json({
            message: "Success",
            stats: {
                totalUsers,
                totalResumes,
                newUsersThisWeek,
                activeUsersCount
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to load dashboard stats", error: error.message });
    }
}

export async function getAllUsers(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const isExport = req.query.isExport === 'true';
        
        
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const minCv = parseInt(req.query.minCv) || 0;
        const maxCv = req.query.maxCv ? parseInt(req.query.maxCv) : null;
        
        const skip = (page - 1) * limit;
        
      
        const matchStage = { isDeleted: false };
        
        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (startDate || endDate) {
            matchStage.createdAt = {};
            if (startDate) matchStage.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                matchStage.createdAt.$lte = end;
            }
        }

  
        const pipeline = [
            { $match: matchStage },
          
            {
                $lookup: {
                    from: "resumes",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userResumes"
                }
            },
         
            {
                $addFields: {
                    cvNumbers: { $size: "$userResumes" }
                }
            },
           
            {
                $match: {
                    ...(minCv > 0 ? { cvNumbers: { $gte: minCv } } : {}),
                    ...(maxCv !== null ? { cvNumbers: { $lte: maxCv, ...(minCv > 0 ? { $gte: minCv } : {}) } } : {})
                }
            },
        
            {
                $project: {
                    userResumes: 0,
                    password: 0 
                }
            },
            { $sort: { createdAt: -1 } }
        ];

       
        const countPipeline = [...pipeline, { $count: "total" }];
        const countResult = await User.aggregate(countPipeline);
        const totalUsersCount = countResult.length > 0 ? countResult[0].total : 0;

    
        if (!isExport) {
            pipeline.push({ $skip: skip }, { $limit: limit });
        }
        
        const users = await User.aggregate(pipeline);
        
        if (isExport) {
            return res.status(200).json({
                message: "Export success",
                users: users
            });
        }
        
        return res.status(200).json({
            message: "Get success", 
            users: users,
            pagination: {
                total: totalUsersCount,
                page,
                limit,
                totalPages: Math.ceil(totalUsersCount / limit)
            }
        });
    } catch (error) {
         console.error(error);
         return res.status(500).json({ message: "Failed to load users", error: error.message });
    }
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
export async function getUserById(req, res) {
    try {
        
        const {userId} = req.params
        
        const user = await User.findOne({_id: userId});
        const resumes = await Resume.find({userId});
      
        
        return res.status(200).json({user, resumes})
    } catch (error) {
        return res.status(400).json({message:"Failed to load user"})
        
    }
    
}
export async function upgradeAdmin(req, res) {
    console.log("Yes")
    const {userId, role} = req.body;
    try {
        await User.updateOne({_id: userId}, {$set:{role: role}});
        return res.status(200).json({message:"Update successfully !"});


    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"Failed to update"})
        
    }
    
}