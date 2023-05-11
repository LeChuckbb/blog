import type { NextApiHandler } from "next";
import useMongo from "../../../lib/mongo";
import { apiHandler } from "../../../lib/api";
import { AppError } from "../../../lib/api";

const Logout: NextApiHandler = async (req, res) => {
  const { authCollection } = await useMongo();
  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
  const logoutResult = await authCollection.findOneAndUpdate(
    { id: adminId },
    { $set: { refreshToken: "" } }
  );

  if (!logoutResult.value)
    throw new AppError("AUE005", "로그아웃에 실패했습니다.", 400);

  res.status(200).end();
};

export default apiHandler({
  GET: Logout,
});
