const express = require("express");
const _ = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");
const otpGenerator = require("otp-generator");

// router.get("/greetings",(req, res)=>{
//     res.send("Helloooooooooo")
// })

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "bshoumen@gmail.com",
    pass: "kmemmjefppxbrafc",
  },
});

_.post("/sendotp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email Is Required",
    });
  }
  let otp = otpGenerator.generate(6);
  let existingUser = await User.findOne({ email: email });

  if (!existingUser) {
    const user = new User({
      email: email,
      otp: otp,
    }).save();
  } else {
    await User.findOneAndUpdate({ email: email }, { otp: otp });
  }

  const info = await transporter.sendMail({
    from: '"Shoumen team" bshoumen@gmail.com',
    to: email,
    subject: "This is your otp",
    html: `<body style=margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif><div style="width:100%;padding:50px 0;background-color:#f5f7fb"><div style="max-width:600px;margin:0 auto;background-color:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,.08)"><div style="padding:40px 30px;text-align:center;background-color:#111827"><div style="width:60px;height:60px;margin:0 auto 18px;background-color:#4f46e5;border-radius:16px;line-height:60px;color:#fff;font-size:26px;font-weight:700">✓</div><h1 style=margin:0;color:#fff;font-size:28px;font-weight:700>Welcome Aboard!</h1><p style="margin:10px 0 0;color:#9ca3af;font-size:14px">Your account has been created successfully</div><div style="padding:40px 35px"><p style="margin:0 0 8px;color:#6b7280;font-size:14px">Hello {{name}},<h2 style="margin:0 0 18px;color:#111827;font-size:24px">Thanks for joining us! 👋</h2><p style=margin:0;color:#6b7280;font-size:15px;line-height:1.7>We're happy to have you with us. Please verify your email address to complete your registration and activate your account.<div style="margin:30px 0;padding:25px;text-align:center;background-color:#f8f9ff;border:1px solid #e5e7eb;border-radius:14px"><p style="margin:0 0 12px;color:#6b7280;font-size:13px">Your verification code<div style="display:inline-block;padding:14px 25px;background-color:#eef2ff;color:#4f46e5;border-radius:10px;font-size:28px;font-weight:700;letter-spacing:7px">${otp}</div><p style="margin:12px 0 0;color:#9ca3af;font-size:12px">This code expires in 10 minutes.</div><div style="text-align:center;margin:30px 0"><a href={{verificationUrl}} style="display:inline-block;padding:14px 32px;background-color:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:700">Verify Email</a></div><p style=margin:0;color:#9ca3af;font-size:13px;line-height:1.6;text-align:center>If you didn't create this account, you can safely ignore this email.</div><div style="padding:25px 30px;text-align:center;background-color:#f9fafb;border-top:1px solid #eee"><p style="margin:0 0 8px;color:#374151;font-size:14px;font-weight:700">Your Company<p style=margin:0;color:#9ca3af;font-size:12px>© 2026 Your Company. All rights reserved.</div></div></div>`,
  });

  console.log("Message sent: %s", info.messageId);

  res.json("Hello");
});

_.post("/login/:email", async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;

  let existingUser = await User.findOne({ email: email });
  //console.log(existingUser.otp);

  if (existingUser.isLogin) {
    return res.send("Age logout koro");
  }

  if (!existingUser.otp) {
    return res.send("OTP already Used");
  }

  if (existingUser.otp == otp) {
    let existingUser = await User.findOneAndUpdate(
      { email: email },
      { otp: "", isLogin: true },
    );
    res.send("Login");
  } else {
    res.send("OTP dont Match");
  }
});

// /**
//  * @swagger
//  * /register:
//  *   post:
//  *     summary: Register a new user
//  *     description: Creates a new user account
//  *     tags:
//  *       - Authentication
//  *
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - email
//  *               - password
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Shoumen Biswas
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 example: shoumen@gmail.com
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 example: 12345678
//  *
//  *     responses:
//  *       201:
//  *         description: User registered successfully
//  *
//  *       400:
//  *         description: Invalid request
//  */
// router.post("/register", (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Name, email and password are required",
//     });
//   }

//   res.status(201).json({
//     success: true,
//     message: "User registered successfully",
//     user: {
//       name,
//       email,
//     },
//   });
// });

module.exports = _;
