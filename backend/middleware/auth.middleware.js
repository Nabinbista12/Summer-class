import jwt from "jsonwebtoken";


export const checkToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log("authHeader:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  // console.log("token:", token);

  // console.log("process:", process.env.JWT_SECRET_TOKEN);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
