import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resumes.js";
import passport from "passport";
import sendEmail from "../config/email.js";
import Forgot from "../models/ForgotPassword.js";

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
    // send email to check user

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // send email to welcome new user
    const messageContent = `Successfully register, welcome to our service`;
    sendEmail(email, "Welcome new user", messageContent);
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
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Authentication error" });
    }
    if (!user) {
      return res.status(400).json({ message: "Fail to login " });
    }
    const token = generateToken(user._id);
    user.password = undefined;

    res.redirect(`${process.env.CLIENT_URL}/app?token=${token}`);
  })(req, res, next);
};
// forgot password (send OTP)
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const userCheck = await User.findOne({
    email,
  });
  if (!userCheck && !req.body.newCheck) {
    return res
      .status(404)
      .json({ message: "Your email is invalid, please recheck it" });
  }

  const numbers = "0123456789";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  try {
    const forgotObj = {
      email,
      otp,
      expireAt: Date.now(),
    };
    const forgot = new Forgot(forgotObj);
    await forgot.save();
    const messageContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
    <title>Verification Code</title>
    <style>
        /* CSS Reset cơ bản cho Email */
        body { margin: 0; padding: 0; min-width: 100%; background-color: #020617; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        table { border-spacing: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        td { padding: 0; }
        img { border: 0; }
        .wrapper { width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #020617; }
        .webkit { max-width: 600px; margin: 0 auto; }
        
        /* Dark Mode support */
        @media (prefers-color-scheme: dark) {
            body { background-color: #020617 !important; }
            .content-block { background-color: #0f172a !important; }
        }
    </style>
</head>
<body style="background-color: #020617; margin: 0; padding: 0;">
    
    <center class="wrapper" style="width: 100%; table-layout: fixed; background-color: #020617; padding-top: 40px; padding-bottom: 40px;">
        <div class="webkit" style="max-width: 600px; margin: 0 auto;">
            
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border: 1px solid #1e293b; background-color: #0f172a; box-shadow: 0 0 20px rgba(6, 182, 212, 0.15);">
                
                <tr>
                    <td height="4" style="background-color: #06b6d4; font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>

             

                <tr>
                    <td align="center" style="padding: 0 40px;">
                        <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0 0 10px 0; letter-spacing: 1px;">
                            SYSTEM ALERT
                        </h1>
                        <p style="color: #94a3b8; font-size: 14px; margin: 0 0 30px 0; line-height: 1.5;">
                            Authentication request detected. <br>Use the code below to verify your identity.
                        </p>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="background-color: #020617; border: 2px dashed #334155; border-radius: 12px; padding: 30px;">
                                    
                                    <span style="display: block; color: #06b6d4; font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px;">
                                        Security Code
                                    </span>
                                    
                                    <span style="display: block; color: #ffffff; font-family: 'Courier New', monospace; font-size: 42px; font-weight: bold; letter-spacing: 10px; text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);">
                                        ${otp}
                                    </span>

                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding: 0 40px 40px 40px;">
                        <p style="color: #ef4444; font-size: 13px; margin: 0; font-family: 'Courier New', monospace;">
                            [!] This code will expire in 3 minutes.
                        </p>
                        <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">
                            If you did not request this, please ignore this email or contact support.
                        </p>
                    </td>
                </tr>

                <tr>
                    
                </tr>

            </table>
            
          

        </div>
    </center>
</body>
</html>
    `;
    console.log(otp);
    sendEmail(email, `CV Builder Verification + ${Date.now()}`, messageContent);
    return res.status(200).json({
      message:
        "An OTP code has been sent to your email. Please check it, even with your spam letter",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
// forgot password (check OTP and reset password )
export const handleOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const check = await Forgot.findOne({
      email,
      otp,
    });

    if (!check) {
      return res.status(400).json({ message: "Invalid OTP? " });
    }
    return res.status(200).json({ message: "OTP verification successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const resetPassword = async (req, res) => {
  const { newPassword, email } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await User.findOne({ email });
  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({ message: "Reset successfully" });
};
