// import dotenv from "dotenv";
// dotenv.config();

import User from "../model/user.model.js";
import { uploadBufferToCloudinary } from "../middleware/imageUploader.middleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
  console.log('Register route hit. req.file:', !!req.file);
  console.log('Register route body keys:', Object.keys(req.body));
    const {
      username,
      fullName,
      email,
      password,
      companyName,
      bio,
      skills,
      experience,
    } = req.body;

    // Required checks
    if (!username || !email || !password || !fullName) {
      return res
        .status(400)
        .json({ message: "username, fullName, email, password required" });
    }

    // Pre-check duplicates
    const [uTaken, eTaken] = await Promise.all([
      User.findOne({ username: username.trim() }).lean(),
      User.findOne({ email: String(email).toLowerCase().trim() }).lean(),
    ]);
    if (uTaken || eTaken) {
      return res
        .status(409)
        .json({ message: "Use a different email or username" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Whitelist + normalize optionals
    const safeSkills = Array.isArray(skills)
      ? skills.filter(Boolean).map((s) => String(s).trim())
      : typeof skills === "string" && skills.trim()
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    let safeExperience = [];
    if (experience) {
      try {
        safeExperience = JSON.parse(experience);
      } catch {
        safeExperience = [];
      }
    }

    let safeProfile = undefined;
    if (req.file) {
      console.log('Received file:', { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size });
      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "profilepic",
        public_id: `user_${username}`,
        transformation: [
          { width: 1600, height: 1600, crop: "fill", gravity: "auto" },
          { quality: "auto", fetch_format: "auto" },
        ],
        });
        safeProfile = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr);
        return res.status(502).json({ message: 'Failed to upload image' });
      }
    }

    const user = await User.create({
      username: String(username).trim(),
      fullName: String(fullName).trim(),
      email: String(email).toLowerCase().trim(),
      password: hashed,
      companyName: companyName ? String(companyName).trim() : undefined,
      bio: bio ? String(bio).trim() : undefined,
      skills: safeSkills,
      experience: safeExperience,
      profilePicture: safeProfile,
    });

    // JWT
    const userToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    return res
      .status(201)
      .json({ message: "User registered", user: user.toJSON(), userToken });
  } catch (err) {
    // Handle duplicate key race condition
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ message: "Email or username already exists" });
    }
    return res.status(500).json({ message: "Error while registering" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (checkPassword) {
        const userToken = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET_TOKEN
        );
        // localStorage.setItem("user", userToken);
        return res.status(200).json({
          message: `${username} welcome to the page.`,
          user,
          userToken,
        });
      }
    }

    return res
      .status(405)
      .json({ message: "Wrong Password! Please try again." });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Error occured while login. Please try again later." });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("authHeader:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  // console.log("token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1h",
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
