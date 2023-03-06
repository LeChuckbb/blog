import type { NextApiHandler } from "next";
import useMongo from "../../../lib/useMongo";
import crypto from "crypto";
import { apiHandler } from "../../../lib/api";
import * as Yup from "yup";
import { validateRequest } from "../../../lib/yup";

interface RegistrationData {
  id: string;
  password: string;
}
interface User {
  id: string;
  digest: string;
  salt: string;
}

/* hashed pwd 생성에 사용된 코드 */
const createSalt = (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("base64"));
    });
  });

const createDigest = (plainPassword: string, salt: string): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve(key.toString("base64"));
    });
  });

const registerSchema = Yup.object().shape({
  id: Yup.string().required("id is required!"),
  password: Yup.string().required("password is required!"),
});

const Register: NextApiHandler = async (req, res) => {
  const data: RegistrationData = validateRequest(req.body, registerSchema);
  const { id, password } = data;
  const { authCollection } = await useMongo();
  const salt = await createSalt();
  const digest = await createDigest(password, salt);
  const user: User = {
    id,
    digest,
    salt,
  };
  const result = await authCollection.insertOne(user);

  res.status(200).json(result);
};

export default apiHandler({ POST: Register });
