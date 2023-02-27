import type { NextApiHandler } from "next";
import useMongo from "../../../lib/useMongo";
import { AppError } from "../../../lib/errorType";
import { apiHandler } from "../../../lib/api";

const logout: NextApiHandler = async (req, res) => {
  const { authCollection } = await useMongo();
  const logoutResult = await authCollection.findOneAndUpdate(
    {
      id: process.env.ADMIN_ID,
    },
    { $set: { refreshToken: "" } }
  );

  if (!logoutResult.value)
    throw new AppError("AUE005", "로그아웃에 실패했습니다.", 400);

  res.status(200).end();
};

export default apiHandler({
  GET: logout,
});
