import User from "../models/Users.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (user.role !== "admin") {
      console.log(user);
      console.log(user.role);

      return res
        .status(403)
        .json({ message: "You are not allowed to do this " });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default isAdmin;
