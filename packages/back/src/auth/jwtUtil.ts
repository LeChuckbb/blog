const { promisify } = require("util");
import jwt from "jsonwebtoken";
import AuthModel from "../models/auth";

module.exports = {
  // access token 발급
  accessToken: (id: string) => {
    return jwt.sign({ id }, process.env.ACESS_TOKEN_SECRET as string, {
      expiresIn: "0", // 유효기간
    });
  },
  verify: (token: string) => {
    // access token 검증
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET as string);
      console.log(decoded);
      return true;
    } catch (err: any) {
      return false;
    }
  },
  refreshToken: () => {
    // refresh token 발급
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "0",
    });
  },
  refreshVerify: async (token: string, id: string) => {
    // refresh token 검증
    try {
      const data = await AuthModel.findOne({ id }, { _id: 0, refreshToken: 1 }); // refresh token 가져오기
      if (token === data?.refreshToken) {
        try {
          jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};