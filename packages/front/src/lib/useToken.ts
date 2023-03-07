import jwt from "jsonwebtoken";
import useMongo from "./useMongo";

const useToken = async () => {
  const { authCollection } = await useMongo();
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

  // access token 발급
  const getAccessToken = (id: string) => {
    const res = jwt.sign({ id }, accessTokenSecret, {
      expiresIn: "5m",
    });
    return res;
  };

  const verifyAccessToken = (token: string) => {
    try {
      if (token === undefined) return false;

      jwt.verify(token.split(" ")[1], accessTokenSecret);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // refresh token 발급
  const getRefreshToken = () => {
    return jwt.sign({}, refreshTokenSecret, {
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
        ? jwt.verify(token, refreshTokenSecret)
        : false;
    } catch (err) {
      console.error(err);
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
