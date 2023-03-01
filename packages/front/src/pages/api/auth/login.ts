import type { NextApiHandler } from "next";
import useMongo from "../../../lib/useMongo";
import util from "util";
import useToken from "../../../lib/useToken";
import crypto from "crypto";
import { AppError } from "../../../types/api";
import { apiHandler } from "../../../lib/api";
import { deleteCookie, setCookie } from "cookies-next";

const verifyPassword = async (
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

const login: NextApiHandler = async (req, res) => {
  const { authCollection } = await useMongo();
  const { getAccessToken, getRefreshToken } = await useToken();

  const { id, password } = req.body;
  const user = await authCollection.findOne({ id });
  if (!user) throw new AppError("AUE001", "존재하지 않는 아이디입니다.", 400);

  const verifed = await verifyPassword(password, user.salt, user.digest);
  if (!verifed)
    throw new AppError("AUE002", "비밀번호가 일치하지 않습니다.", 400);

  // accessToken & refreshToken 생성
  const accessToken = await getAccessToken(id);
  const refreshToken = await getRefreshToken();

  // refreshToken을 DB에 저장
  await authCollection.updateOne({ id }, { $set: { refreshToken } });

  res
    .setHeader("authorization", `Bearer ${accessToken}`)
    .setHeader("Access-Control-Expose-Headers", "authorization");
  setCookie("refreshToken", refreshToken, {
    req,
    res,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });

  res.json({ message: "Login Success" });
};

export default apiHandler({
  POST: login,
});
