// import dotenv from "dotenv";
// dotenv.config();

import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    console.log("Register path hit");
    let { username, email, password } = req.body;

    console.log(username, email, password);

    const checkUsername = await User.findOne({ username: username });
    const checkEmail = await User.findOne({ email: email });

    if (checkUsername || checkEmail) {
      return res
        .status(409)
        .json({
          message: "Please use different email or username. Please use another",
        });
    }

    console.log(checkEmail);
    console.log(checkUsername);

    password = await bcrypt.hash(password, 10);

    console.log(password);

    const user = new User({ username, email, password });

    console.log("user saved");
    await user.save();

    console.log(user);
    console.log("ok");

    const userToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET_TOKEN,
      {
        expiresIn: "1h",
      }
    );

    console.log(user);

    return res
      .status(201)
      .json({ message: "Users registered successfully", user, userToken });
  } catch (err) {
    res.status(404).json({ message: "Error while registering." });
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
        return res
          .status(200)
          .json({
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
