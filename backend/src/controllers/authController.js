import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m"; // 30 phut
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, password, email } = req.body;

    console.log(req.body);
    if (!firstName || !lastName || !userName || !password || !email) {
      return res.status(400).json({
        message: "can't not firstName, lastName, userName",
      });
    }

    //kiem tra userName ton tai chua
    const duplicate = await User.findOne({ userName });

    if (duplicate) {
      return res.status(409).json({ message: "userName already exists" });
    }

    //ma hoa password
    const hashedPassword = await bcrypt.hash(password, 10); // salt = 10

    //tao user moi
    await User.create({
      userName,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    //return
    return res.sendStatus(204);
  } catch (error) {
    console.error("ERROR when call signUp", error);
    return res.status(500).json({ message: "ERROR System" });
  }
};

export const signIn = async (req, res) => {
  try {
    //lay input
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "userName or password is missing." });
    }

    //lay hashedpassword trong db de so voi password input
    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(401)
        .json({ message: "userName or password is not correct" });
    }

    //kiem tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "userName or password is not correct" });
    }

    //neu khớp, tạo accessToken với JWT
    //@ts-ignore
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    //tao refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    //tao session moi de luu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //tra refresh token ve trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // backend, frontend deploy rieng
      maxAge: REFRESH_TOKEN_TTL,
    });
    //tra access token ve trong res
    return res
      .status(200)
      .json({ message: `User ${user.displayName} Logged in!`, accessToken });
  } catch (error) {
    console.error("ERROR when call signIn", error);
    return res.status(500).json({ message: "Error System" });
  }
};

export const signOut = async (req, res) => {
  try {
    //lay refresh token tu cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      //xoa refresh token trong Session
      await Session.deleteOne({ refreshToken: token });
      //xoa cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Error when call signOut", error);
    return res.status(500).json({ message: "ERROR SYSTEM" });
  }
};

//tao access token moi tu refresh token
export const refreshToken = async (req, res) => {
  try {
    //lay refresh token tu cookies
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token is not exit" });
    }
    //so voi refresh token trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "Token is invalid or expired" });
    }

    //kiem tra het han chua
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token is expired" });
    }

    //tao access token moi
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    //return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("ERROR when call refreshToken", error);
    return res.status(500).json({ message: "ERROR SYSTEM" });
  }
};
