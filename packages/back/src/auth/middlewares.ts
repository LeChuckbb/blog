const jwt = require("./jwtUtil");
import dayjs from "dayjs";

const authJWT = async (req: any, res: any, next: any) => {
  const accessToken = jwt.verify(req.headers.authorization);
  const refreshToken = await jwt.refreshVerify(
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
      throw new Error("토큰이 모두 만료되었습니다. 재로그인해주세요.");
    } else {
      // case 3 -> Refresh Token을 이용해서 Access Token 재발급
      console.log("CASE 3");
      const newAccessToken = jwt.accessToken("KenLiu");
      return res.status(201).json({
        accessToken: newAccessToken,
        message: "accessToken 만료로 인한 재발급",
      });
      // 1. accessToken을 response 로 전달.
      // 2. 이후 클라이언트에서 자동으로 accessToken을 갈아끼워 재요청을 보낼수 있게끔 해야함. 어떻게?
    }
  } else {
    if (!refreshToken) {
      // case 2 -> refresh Token 재발급
      console.log("CASE 2");
      const newRefreshToken = jwt.refreshToken();

      res.cookie("refreshToken", newRefreshToken, {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(7, "days").toDate(),
      });

      next();
    } else {
      // case 1 -> 모두가 유효한 경우, 검증 이상무 -> 그냥 넘김
      console.log("CASE 1");
      next();
    }
  }
};

module.exports = authJWT;
