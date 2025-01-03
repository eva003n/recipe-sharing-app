import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

export function generateToken(userId, userEmail) {
  const accessToken = jwt.sign({ userId, userEmail }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
    issuer: "Lesps",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
    issuer: "Lesps",
  });

  return {accessToken, refreshToken}
}
