import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resumes.js";
import passport from "passport";

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
    console.log(err);
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
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = generateToken(user._id);
    user.password = undefined;
    return res.status(200).json({ message: "Login successfully", token, user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
}
// get user from id
export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.find({
      _id: userId,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
// get CV
export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId });
    return res.status(200).json({
      resumes,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
// google login
export const googleResister = async (
  accessToken,
  refreshToken,
  profile,
  done,
) => {
  try {
    const user = await User.findOne({ googleId: profile.id });
    console.log(user);
    if (user) {
      return done(null, user);
    } else {
      const newUser = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      });
      return done(null, newUser);
    }
  } catch (error) {
    console.log(error);
    return done(error, null);
  }
};
export const googleLogin = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    console.log(user);
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Authentication error" });
    }
    if (!user) {
      return res.status(400).json({ message: "Fail to login " });
    }
    const token = generateToken(user._id);
    user.password = undefined;
    res.redirect(`http://localhost:5173/app?token=${token}`);
    // return res.status(200).json({
    //   message: "Login successfully",
    //   token: token,
    //   user,
    // });
  })(req, res, next);
};
