const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const asyncHandler = require('express-async-handler'); // Wrap async route handlers
const { validateUserRegistration, validateUserLogin } = require('../validators/userValidator');
const handleValidationErrors = require('../middleware/errorHandler');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { google } = require('googleapis');
const redisClient = require('../config/redisClient');
const User = require('../models/User');

// OAuth2 Setup for Nodemailer
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Multer Storage Configuration for Profile Picture Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 🔹 User Registration with Validation
router.post(
  '/register',
  validateUserRegistration,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.status(400);
      throw new Error('Email is already in use');
    }

    const user = new User(req.body);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  })
);

// 🔹 Validate Token Route
router.get('/validate-token', authMiddleware, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

// 🔹 Get User Details
router.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(user);
  })
);

// 🔹 User Login with Validation
router.post(
  '/login',
  validateUserLogin,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  })
);

// 🔹 Send OTP for Registration
router.post(
  '/send-otp',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    await redisClient.setEx(email, 300, otp.toString());

    let accessToken;
    try {
      const accessTokenResponse = await oAuth2Client.getAccessToken();
      accessToken = accessTokenResponse.token;
    } catch (error) {
      console.error("Error obtaining Gmail access token in send-otp:", error);
      res.status(500);
      throw new Error("Authentication error with Gmail OAuth. Please check your refresh token and credentials.");
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `MarketMitra <${EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for MarketMitra Registration',
      html: `<p>Your OTP is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (mailError) {
      console.error("Error sending registration OTP email:", mailError);
      res.status(500);
      throw new Error("Failed to send OTP email. Please try again later.");
    }
  })
);

// 🔹 Verify OTP and Register User
router.post(
  '/verify-otp',
  asyncHandler(async (req, res) => {
    const { email, otp, userData } = req.body;
    const storedOtp = await redisClient.get(email);

    if (!storedOtp || parseInt(storedOtp) !== parseInt(otp)) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    // Remove the OTP from Redis after successful verification
    await redisClient.del(email);

    // Create user in database
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  })
);

// 🔹 Resend OTP Endpoint
router.post(
  '/resend-otp',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    // Generate a new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Store the new OTP in Redis with a 5-minute expiration
    await redisClient.setEx(email, 300, otp.toString());

    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `MarketMitra <${EMAIL_USER}>`,
      to: email,
      subject: 'Your new OTP for MarketMitra Registration',
      html: `<p>Your new OTP is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP resent successfully' });
  })
);

// 🔹 Forgot Password: Send OTP
router.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await redisClient.setEx(`forgot:${email}`, 300, otp.toString());

    let accessToken;
    try {
      const accessTokenResponse = await oAuth2Client.getAccessToken();
      accessToken = accessTokenResponse.token;
    } catch (error) {
      console.error("Error obtaining Gmail access token in forgot-password:", error);
      res.status(500);
      throw new Error("Authentication error with Gmail OAuth. Please check your refresh token and credentials.");
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOptions = {
      from: `MarketMitra <${EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `<p>Your OTP for resetting your password is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (mailError) {
      console.error("Error sending OTP email:", mailError);
      res.status(500);
      throw new Error("Failed to send OTP email. Please try again later.");
    }
  })
);

// 🔹 Verify OTP for Forgot Password
router.post(
  '/verify-forgot-password-otp',
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = await redisClient.get(`forgot:${email}`);
    if (!storedOtp || parseInt(storedOtp) !== parseInt(otp)) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }
    // Set a verification flag in Redis for 5 minutes
    await redisClient.setEx(`forgot-verified:${email}`, 300, 'true');
    await redisClient.del(`forgot:${email}`);
    res.status(200).json({ message: 'OTP verified successfully' });
  })
);

// 🔹 Reset Password
router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;
    const verified = await redisClient.get(`forgot-verified:${email}`);
    if (!verified) {
      res.status(400);
      throw new Error('OTP not verified or expired');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.password = newPassword; // This triggers pre-save hooks for hashing
    await user.save();
    await redisClient.del(`forgot-verified:${email}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Password reset successfully', token });
  })
);

// 🔹 Update User Profile (Supports Profile Picture Upload)
router.put(
  '/:userId',
  authMiddleware,
  upload.single('profilePicture'),
  asyncHandler(async (req, res) => {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true });
    if (!updatedUser) {
      res.status(404);
      throw new Error('User not found');
    }
    res.json(updatedUser);
  })
);

// routes/orders.js
router.get('/admin/:adminId', async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $match: {
          "productDetails.createdBy": mongoose.Types.ObjectId(req.params.adminId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }
    ]).sort('-createdAt');

    res.json(orders);
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ error: "Failed to fetch admin orders" });
  }
});

module.exports = router;