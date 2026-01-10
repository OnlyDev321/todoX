import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
  try {
    //lay token tu header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "can't find access token" });
    }

    //xac nhan token hop le
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodeUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token is expired or invalid" });
        }
        //tim user
        const user = await User.findById(decodeUser.userId).select(
          "-hashedPassword"
        );
        if (!user) {
          return res.status(404).json({ message: "user is not exit" });
        }
        //tra user ve trong req
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("ERROR when vertificate JWT in authMiddleware", error);
    return res.status(500).json({ message: "ERROR SYSTEM" });
  }
};
