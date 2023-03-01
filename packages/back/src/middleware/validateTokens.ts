const Token = require("../util/token");
import dayjs from "dayjs";
import { AppError } from "../util/types";
import { tryCatch } from "../util/tryCatch";
import { Request, Response, NextFunction } from "express";

const ValidateTokens = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("validateTokens");

    const accessToken = Token.verify(req.headers.authorization);
    const refreshToken = await Token.refreshVerify(
      req.cookies.refreshToken,
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
        const newAccessToken = Token.accessToken("KenLiu");
        res
          .set("authorization", `Bearer ${newAccessToken}`)
          .set("Access-Control-Expose-Headers", "authorization");
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
        const newRefreshToken = Token.refreshToken();

        res.cookie("refreshToken", newRefreshToken, {
          secure: false,
          httpOnly: true,
          expires: dayjs().add(7, "days").toDate(),
        });

        next();
      } else {
        // case 1 -> 모두가 유효한 경우, 검증 이상무 -> 그냥 넘김
        console.log("CASE 1");
        console.log(next);
        next();
      }
    }
  }
);

export default ValidateTokens;
