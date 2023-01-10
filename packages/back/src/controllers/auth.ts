import { Request, Response } from "express";
import crypto from "crypto";
import util from "util";
import Auth from "../models/auth";

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

export const login = () => async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;
    const user = await Auth.findOne({ id: id });
    console.log(user);

    if (!user) throw new Error("존재하지 않는 아이디입니다.");

    const verifed = await verifyPassword(password, user.salt, user.hashedPwd);
    if (!verifed) throw new Error("비밀번호가 일치하지 않습니다");

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};
