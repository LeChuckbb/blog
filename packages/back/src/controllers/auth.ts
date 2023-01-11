import { Request, Response } from "express";
import crypto from "crypto";
import util from "util";
import AuthModel from "../models/auth";
import dayjs from "dayjs";
const jwt = require("../auth/jwtUtil");

export const verifyPassword = async (
  password: string,
  salt: string,
  userPassword: string
) => {
  const pbkdf2Promise = util.promisify(crypto.pbkdf2);
  const key = await pbkdf2Promise(password, salt, 9999, 64, "sha512");
  const hashedPassword = key.toString("base64");

  if (hashedPassword === userPassword) return true;
  return false;
};

// verifyAccessToken
// verifyRefreshToken
/*
  사용자가 입력한 ID/PW를 검증하여 성공시 refreshToken, accessToken을 발급.
  refreshToken은 쿠키로, accessToken은 response body에 실어서 반환한다.
*/
export const login = () => async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;
    const user = await AuthModel.findOne({ id: id });

    if (!user) throw new Error("AUE001");
    const verifed = await verifyPassword(password, user.salt, user.hashedPwd);
    if (!verifed) throw new Error("AUE002");

    // accessToken & refreshToken 생성
    const accessToken = jwt.accessToken(id);
    const refreshToken = jwt.refreshToken();

    // refreshToken을 DB에 저장
    await AuthModel.updateOne({ id }, { $set: { refreshToken } });

    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      expires: dayjs().add(7, "days").toDate(),
    });

    return res.status(200).json({ message: "ok", accessToken });
  } catch (error: any) {
    const err = error.toString();
    if (err.includes("AUE001"))
      return res
        .status(400)
        .json({ code: "AUE001", message: "존재하지 않는 아이디입니다." });
    else if (err.includes("AUE002"))
      return res
        .status(400)
        .json({ code: "AUE002", message: "비밀번호가 일치하지 않습니다." });

    return res.status(500).json({ error });
  }
};

export const isAuth = () => {
  return "hi";
};

/* hashed pwd 생성에 사용된 코드 */
// const createSalt = () =>
//   new Promise((resolve, reject) => {
//     crypto.randomBytes(64, (err, buf) => {
//       if (err) reject(err);
//       resolve(buf.toString("base64"));
//     });
//   });

// const createHashedPassword: any = (plainPassword: string) =>
//   new Promise(async (resolve, reject) => {
//     const salt: any = await createSalt();
//     crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
//       if (err) reject(err);
//       resolve({ hashedPassword: key.toString("base64"), salt });
//     });
//   });
