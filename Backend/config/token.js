import jwt from "jsonwebtoken";

const gentoken = (userid) => {
  return jwt.sign(
    { id: userid },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default gentoken;


