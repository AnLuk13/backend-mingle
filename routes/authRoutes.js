import express from "express";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "1d", // Token will expire in 1 day
  });
};

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });
    res.status(200).json({ message: "Logged in successfully", token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//testing

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear JWT token cookie
  return res.status(200).json({ message: "Logged out successfully" });
});

// Check session (verify JWT)
router.get("/session", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }
  // Verify JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isAuthenticated: false });
    }
    return res.status(200).json({ isAuthenticated: true, userId: decoded.id });
  });
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    return res.status(200).json({
      message: "Password updated successfully and user logged in",
      token: token,
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "No user with this email" });
//     }
//     const newPassword = generatePassword();
//     const transporter = nodemailer.createTransport({
//       service: "Gmail", // Or any SMTP service
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // Your email password or app password
//       },
//     });
//     const mailOptions = {
//       from: "minglesupport@gmail.com",
//       to: user.email,
//       subject: "Your New Password",
//       text: `Your new password is: ${newPassword}`,
//     };
//     await transporter.sendMail(mailOptions);
//     user.password = newPassword;
//     await user.save();
//     return res
//       .status(200)
//       .json({ message: "A new password has been sent to your email." });
//   } catch (error) {
//     console.error("Error in forgot-password route:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

