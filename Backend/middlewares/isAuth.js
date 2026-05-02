import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "token is not found" });
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.id;
    next();

  } catch (error) {
    return res.status(500).json({ message: `isAuth error: ${error.message}` });
  }
};

export default isAuth;
