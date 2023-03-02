// const Token = require("../util/token");
import useToken from "./useToken";
import type { NextApiRequest, NextApiResponse } from "next";
import { AppError } from "../types/api";
import { errorHandler } from "./api";
import { setCookie } from "cookies-next";

const ValidateTokens = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    console.log("validateTokens");
    const {
      getAccessToken,
      getRefreshToken,
      verifyAccessToken,
      verifyRefreshToken,
    } = await useToken();

    const accessToken = await verifyAccessToken(
      req.headers.authorization as string
    );
    const refreshToken = await verifyRefreshToken(
      req.cookies.refreshToken as string,
      "KenLiu"
    );

    /*
      case1. Access O Refresh O
      case2. Access O Refresh X
      case3. Access X Refresh O
      case4. Access X Refresh X
    */
    if (!accessToken) {
      if (!refreshToken) {
        // case4 -> 재로그인 유도
        console.log("CASE 4");
        throw new AppError("AUE004", "모든 토큰 만료. 재로그인 요망", 202);
      } else {
        // case 3 -> Refresh Token을 이용해서 Access Token 재발급
        console.log("CASE 3");
        const newAccessToken = getAccessToken("KenLiu");

        res
          .setHeader("authorization", `Bearer ${newAccessToken}`)
          .setHeader("Access-Control-Expose-Headers", "authorization");
        throw new AppError(
          "AUE003",
          "accessToken 만료. RefreshToken을 이용한 재발급",
          202
        );
      }
    } else {
      if (!refreshToken) {
        // case 2 -> refresh Token 재발급
        console.log("CASE 2");
        const newRefreshToken = await getRefreshToken();

        setCookie("refreshToken", newRefreshToken, {
          req,
          res,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
        });

        next();
      } else {
        // case 1 -> 모두가 유효한 경우, 검증 이상무 -> 그냥 넘김
        console.log("CASE 1");
        next();
      }
    }
  } catch (err) {
    errorHandler(err, res);
  }
};

export default ValidateTokens;