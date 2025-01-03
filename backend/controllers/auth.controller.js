
import { logInSchema, signUpSchema } from "../middlewares/validator.js";
import  User  from "../models/user.model.js";
import { doHash, doHashValidation, hMacProcess } from "../utils/hashing.js";
import jwt from "jsonwebtoken";
// import generateCode from "../utils/generateCode.js";

import dotenv from "dotenv";

dotenv.config();

import { generateToken } from "../utils/generateTokens.js";


import connectToRedis from "../config/redis.js";
import verifyEmail from "../utils/verifyEmail.js";
// import { sendVerificationEmail } from "../utils/sendMail.js";


let redis = await connectToRedis().then((value) => {
  return value;
});

dotenv.config();

export async function signUp(req, res) {
  const { username, email, password } = req.body;

  try {
    const { error, value } = signUpSchema.validate({
      username,
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    //query databse to check if user exist
    const existingUser = await User.findOne({ email }).select("+password");

    //check if user exists
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists!",
      });
    }
    //if user does not exisst
    if (!existingUser) {
      //password hashing
      const hashedPassword = await doHash(password, 12);

      const newUser = new User({
        userName: username,
        email,
        password: hashedPassword,
      });

      //create new user in database
      const result = await newUser.save();

      //when saving user mongoose will return password thus we prevent that
      result.password = undefined;
      if (result) {

        // const secretCode = await generateCode();
        // sendVerificationEmail(email, secretCode)

        return res.status(201).json({
          success: true,
          message: `Account created successfully for ${result.userName}`,
        });
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}

//Authentication
export const logIn = async (req, res) => {
  //user credentials, validate them before generating a token
  const { email, password, username } = req.
  body;

  try {
    if (email && password) {
 
      const { error, value } = logInSchema.validate({
        email,
        password,
        username,
      });

      //validation error
      if (error) throw error;

      //returns a doc with user if exists
      const existingUser = await User.findOne({ email }).select("+password");

      if (existingUser) {
        const isValidEmail = verifyEmail(email, existingUser.email);
        const isMatchingPassword = await doHashValidation(
          password,
          existingUser.password

        );
        //create user token

        if (isMatchingPassword && isValidEmail) {
          //generate token for user session
          //
          const { accessToken, refreshToken } = generateToken(existingUser._id, existingUser.email);
          //store refresh tolen in redis

          const storeAccessToken = async (userId, refreshToken) => {
            await redis.set(userId, refreshToken, "EX", 24 * 60 * 60);
          };

          storeAccessToken(`refresh token:${existingUser._id}`, refreshToken);

          //configure and send cookie
          configureCookie(res, accessToken, refreshToken);

          return res.status(200).json({
            success: true,
            message: "Logged in successfully",
          });
        }
      } else {
        return res.status(422).json({
          success: false,
          message: "Invalid email and password",
        });
      }
    }
  } catch (e) {
    res.status(500).json({ message: "An error occured" });
    console.log(`Server error ${e.message}`);
  }
};

export const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.RefreshToken;

    //check if the refresh token sent by the client matches  secret
    if (refreshToken) {
      const decodeToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    
      await redis.del(`refresh token:${decodeToken._id}`);
      res.status(200);
      res.clearCookie("AccessToken");
      res.clearCookie("RefreshToken");
//no content for delete and put request
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    }
  } catch (e) {
    console.log(e.message);
    res.status(401).json({
      message: `Error! Unauthorized`,
    });
  }
};

//refresh access token
export const tokenRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.RefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }
    const decodeToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const storedToken = await redis.get(`refresh token:${decodeToken.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({
        message: "Errur Unauthorized",
      });
    }

    const accessToken = jwt.sign(
      { userId: decodeToken.userId, email: decodeToken.userEmail },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.cookie("AccessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      maxAge: 15 * 60 * 1000, //15min
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //CSRF cross site resource forgery attack
    });
    return res.status(200).json({
      message: "Successfull authorization",
    });
  } catch (e) {
    return res.status(500).json({
      message: `Server Error ${e.message}`,
    });
  }
};

function configureCookie(res, accessToken, refreshToken) {
  res.cookie("AccessToken", accessToken, {
    httpOnly: true, //prevent xss attacks
    maxAge: 15 * 60 * 1000, //15min
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //CSRF cross site resource forgery attack
  });
  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true, //prevent xss attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", 
    maxAge: 24 * 60 * 60 * 1000, //1day
  });
}



/**
 * controllers receive request from routers, validate the request, call services and return a response
 */
