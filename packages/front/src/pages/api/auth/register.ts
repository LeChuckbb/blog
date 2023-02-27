import type { NextApiHandler } from "next";
import useMongo from "../../../lib/useMongo";
import crypto from "crypto";
import { apiHandler } from "../../../lib/api";
import * as Yup from "yup";
import { validateRequest } from "../../../lib/yup";

/* hashed pwd 생성에 사용된 코드 */
const createSalt = (): Promise<string> =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("base64"));
    });
  });

const createDigest = (
  plainPassword: string
): Promise<{
  digest: string;
  salt: string;
}> =>
  new Promise(async (resolve, reject) => {
    const salt = await createSalt();
    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve({ digest: key.toString("base64"), salt });
    });
  });

const registerSchema = Yup.object().shape({
  id: Yup.string().required("id is required!"),
  password: Yup.string().required("password is required!"),
});

const register: NextApiHandler = async (req, res) => {
  const data = validateRequest(req.body, registerSchema);
  const { id, password } = data;
  const { authCollection } = await useMongo();
  const { digest, salt } = await createDigest(password);
  const result = await authCollection.insertOne({
    id,
    digest,
    salt,
  });

  res.status(200).json(result);
};

export default apiHandler({ POST: register });
