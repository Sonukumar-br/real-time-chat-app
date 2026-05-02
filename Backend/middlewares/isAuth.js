import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    let token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "token is not found" });
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.id;

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default isAuth;
