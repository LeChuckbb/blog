import jwt from "jsonwebtoken";
import useMongo from "./useMongo";

const useToken = async () => {
  const { authCollection } = await useMongo();
  // access token 발급
  const getAccessToken = (id: string) => {
    const secret = process.env.ACCESS_TOKEN_SECRET as string;
    const res = jwt.sign({ id }, secret, {
      // expiresIn: "5m",
      expiresIn: "5s",
    });

    return res;
  };

  const verifyAccessToken = (token: string) => {
    try {
      const secret = process.env.ACCESS_TOKEN_SECRET;
      jwt.verify(
        token === undefined ? "token" : token.split(" ")[1],
        secret === undefined ? "secret" : secret
      );
      console.log("access token 검증 성공");
      return true;
    } catch (err: any) {
      console.log("access token 검증 실패");
      return false;
    }
  };

  // refresh token 발급
  const getRefreshToken = () => {
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: "7d",
    });
  };

  const verifyRefreshToken = async (token: string, id: string) => {
    try {
      const data = await authCollection.findOne(
        { id },
        { projection: { _id: 0, refreshToken: 1 } }
      ); // refresh token 가져오기
      return token === data?.refreshToken
        ? jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string)
        : false;
    } catch (err) {
      console.log("refresh toekn 검증 실패");
      return false;
    }
  };

  return {
    getAccessToken,
    verifyAccessToken,
    getRefreshToken,
    verifyRefreshToken,
  };
};

export default useToken;
