import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  const accessToken = req.cookies.AccessToken;

  try {
    if (!accessToken) {
      return res.status(401).json({
        message: "Error! Unauthorized ",
      });
    }

    // console.log("hello 2")
    const decodeToken = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    // console.log("hello 3")
    const isUser = await User.findById(decodeToken.userId).select("-password");

    if (!isUser) {
      return res.status(401).json({
        message: "Error! User not found",
      });
    }

    req.user = isUser;
    next();
  } catch (e) {
    if (e.name === "TokenEpiredError") {
      return res.status(401).json({
        message: "Unuthorized, access token expired",
      });
    }
  }
};
