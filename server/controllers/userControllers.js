import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resumes.js";
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
// register new user
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        message: "User already exits",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(newUser._id);
    newUser.password = undefined;
    return res.status(201).json({
      message: "User created successfully",
      token,
      user: newUser,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}
// login user
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }
    if (user.comparePassword (password)) {
      return res.json({ message: "Invalid password" });
    }
    const token = generateToken(user._id);
    user.password = undefined;
    return res.status(200).jon({ message: "Login successfully", token, user });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}
export const getUserById = async(req, res)=>{
try{
 const userId = req.userId;
 const user = await User.find({
  _id:userId
 })
 if(!user){
  return res.status(404).json({message:"User not found"})
 }
 user.password = undefined;
 return res.status(200).json({user})
}
catch(err){
  return res.status(400).json({message:err.message})
}
}
// get CV 
export const getUserResumes = async(req, res)=>{
 try{
    const userId = req.userId;
    const resumes = await Resume.find({userId});
    return res.status(200).json({
      resumes
    })

 }
 catch(err){
  return res.status(400).json({message:err.message})
 }
}