import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // No need to set cookies in the backend
    res
      .status(200)
      .json({ message: "Logged in successfully", sessionId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//logout
router.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
});

//check
router.get("/session", (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    return res.status(200).json({ isAuthenticated: true, sessionId });
  }
  return res.status(401).json({ isAuthenticated: false });
});

router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = newPassword;
    await user.save();

    // No need to set the cookie, just return sessionId
    return res.status(200).json({
      message: "Password updated successfully and user logged in",
      sessionId: user._id,
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
